import React, { useState, useCallback, useEffect } from 'react';
import { User, signOut } from 'firebase/auth';
import { Subject, MCQ, LeaderboardUser } from './types';
import { SUBJECTS } from './constants';
import { getMCQs, saveMCQs, auth, onAuthChange, getUserXP, addUserXP, getMistakes, addMistakes, updateMistakes, getLeaderboardData, getUserProfile, updateUserProfile, uploadProfilePicture } from './services/firebase';
import { generateMCQs } from './services/gemini';
import SubjectSelector from './components/SubjectSelector';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';
import Spinner from './components/Spinner';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import BottomNavbar from './components/Navbar';
import LeaderboardView from './components/LeaderboardView';
import VocabularyView from './components/VocabularyView';
import ProfileView from './components/ProfileView';

type AppState = 'selecting' | 'loading' | 'playing' | 'finished';
type MainView = 'home' | 'archive' | 'review' | 'profile' | 'leaderboard' | 'vocabulary' | 'userProfile';

// --- Icon Components ---
const BellIcon = () => (
  <svg xmlns="http://www.w.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const QuestionMarkCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('selecting');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [currentUserData, setCurrentUserData] = useState<LeaderboardUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [userXP, setUserXP] = useState(0);
  const [mistakes, setMistakes] = useState<{[subjectId: string]: MCQ[]}>({});
  const [isMistakeQuiz, setIsMistakeQuiz] = useState(false);
  
  const [mainView, setMainView] = useState<MainView>('home');
  const [isPracticing, setIsPracticing] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [viewedProfile, setViewedProfile] = useState<LeaderboardUser | null>(null);


  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setUser(user);
      if (user) {
        const profile = await getUserProfile(user.uid);
        if (profile) {
            setCurrentUserData(profile);
            setUserXP(profile.xp);
        }
        const userMistakes = await getMistakes(user.uid);
        setMistakes(userMistakes);
      } else {
        setUserXP(0); // Reset XP on sign out
        setMistakes({});
        setCurrentUserData(null);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleRestart = useCallback(() => {
    setAppState('selecting');
    setSelectedSubject(null);
    setQuestions([]);
    setScore(0);
    setError(null);
    setIsMistakeQuiz(false); // Reset flag
  }, []);

  const startPractice = useCallback(() => {
    handleRestart();
    setIsPracticing(true);
  }, [handleRestart]);
  
  const endPractice = useCallback(() => {
    handleRestart();
    setIsPracticing(false);
  }, [handleRestart]);

  const handleSelectSubject = useCallback(async (subject: Subject, count: number) => {
    setSelectedSubject(subject);
    setAppState('loading');
    setError(null);
    try {
      let fetchedQuestions = await getMCQs(subject.id);
      if (!fetchedQuestions || fetchedQuestions.length === 0) {
        fetchedQuestions = await generateMCQs(subject.name);
        await saveMCQs(subject.id, fetchedQuestions);
      }

      // Shuffle questions to provide a different quiz each time
      const shuffled = [...fetchedQuestions].sort(() => 0.5 - Math.random());
      
      // Select the number of questions requested by the user
      const selectedQuestions = shuffled.slice(0, count);

      setQuestions(selectedQuestions);
      setScore(0);
      setAppState('playing');
    } catch (err: any) {
      console.error(err);
      setError('Failed to load questions. Please check your network connection or API key and try again.');
      setAppState('selecting');
    }
  }, []);

  const handleQuizFinish = useCallback(async (finalScore: number, incorrectQuestions: MCQ[]) => {
    setScore(finalScore);
    setAppState('finished');

    if (user && selectedSubject) {
      if (isMistakeQuiz) {
        // We were practicing mistakes, so update the list with remaining mistakes
        await updateMistakes(user.uid, selectedSubject.id, incorrectQuestions);
      } else {
        // This was a regular quiz
        // Add XP
        if (finalScore > 0) {
          await addUserXP(user.uid, finalScore);
          const newXP = userXP + finalScore;
          setUserXP(newXP);
          setCurrentUserData(prev => prev ? { ...prev, xp: newXP } : null);
        }
        // Add any new mistakes
        if (incorrectQuestions.length > 0) {
          await addMistakes(user.uid, selectedSubject.id, incorrectQuestions);
        }
      }
      // Refresh mistakes state from DB to ensure it's up to date
      const userMistakes = await getMistakes(user.uid);
      setMistakes(userMistakes);
    }
  }, [user, selectedSubject, isMistakeQuiz, userXP]);

  const startMistakePractice = (subjectId: string) => {
    const subject = SUBJECTS.find(s => s.id === subjectId);
    const mistakeQuestions = mistakes[subjectId];

    if (subject && mistakeQuestions && mistakeQuestions.length > 0) {
        setSelectedSubject(subject);
        setQuestions(mistakeQuestions);
        setScore(0);
        setAppState('playing');
        setIsPracticing(true);
        setIsMistakeQuiz(true); // Set the flag
    }
  };

  const handleNavigate = async (view: Omit<MainView, 'userProfile'>) => {
    setMainView(view);
    if (view === 'leaderboard' || view === 'profile') {
      setIsLeaderboardLoading(true);
      try {
        const data = await getLeaderboardData();
        setLeaderboardData(data);
        if (view === 'profile' && user) {
            const rankIndex = data.findIndex(leaderboardUser => leaderboardUser.id === user.uid);
            setUserRank(rankIndex !== -1 ? rankIndex + 1 : null);
        }
      } catch (e) {
        console.error("Failed to load leaderboard data", e);
        setError("Could not load leaderboard data.");
      } finally {
        setIsLeaderboardLoading(false);
      }
    }
  };

  const handleViewProfile = (userToView: LeaderboardUser) => {
    setViewedProfile(userToView);
    setMainView('userProfile');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setMainView('home');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfileUpdate = async (data: { displayName?: string, nickname?: string }) => {
    if (user) {
        await updateUserProfile(user.uid, data);
        const updatedProfile = await getUserProfile(user.uid);
        if (updatedProfile) {
            setCurrentUserData(updatedProfile);
        }
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!user) {
        setError("You must be logged in to upload a photo.");
        return;
    }
    try {
        const photoURL = await uploadProfilePicture(user.uid, file);
        await updateUserProfile(user.uid, { photoURL });
        setCurrentUserData(prev => prev ? { ...prev, photoURL } : null);
    } catch (err) {
        console.error(err);
        setError("Failed to upload profile picture.");
        // Re-throw to be caught in ProfileView
        throw err;
    }
  };

  const renderPracticeContent = () => {
    switch (appState) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center text-center h-full">
            <Spinner />
            <p className="mt-4 text-lg text-slate-300">
              Generating fresh questions for {selectedSubject?.name}...
            </p>
          </div>
        );
      case 'playing':
        return (
          selectedSubject &&
          questions.length > 0 && (
            <QuizView
              subject={selectedSubject}
              questions={questions}
              onFinish={handleQuizFinish}
              onQuit={endPractice}
            />
          )
        );
      case 'finished':
        return (
          <ResultsView
            score={score}
            totalQuestions={questions.length}
            onRestart={handleRestart}
            onExit={endPractice}
          />
        );
      case 'selecting':
      default:
        return (
          <SubjectSelector
            subjects={SUBJECTS}
            onSelectSubject={handleSelectSubject}
            error={error}
            onExit={endPractice}
          />
        );
    }
  };
  
  const renderMainContent = () => {
    switch (mainView) {
      case 'home':
        return <HomePage onStartPractice={startPractice} mistakes={mistakes} onRetryMistakes={startMistakePractice} onNavigate={handleNavigate} />;
      case 'leaderboard':
        return isLeaderboardLoading 
          ? <div className="flex items-center justify-center h-full"><Spinner /></div>
          : <LeaderboardView users={leaderboardData} currentUser={user} onViewProfile={handleViewProfile} />;
      case 'vocabulary':
        return <VocabularyView onExit={() => setMainView('home')} onAddXP={(xp) => setUserXP(prev => prev + xp)} />;
      case 'profile':
        if (!currentUserData) return <div className="flex items-center justify-center h-full"><Spinner /></div>;
        return isLeaderboardLoading 
          ? <div className="flex items-center justify-center h-full"><Spinner /></div>
          : <ProfileView 
              profileData={currentUserData}
              isCurrentUser={true}
              rank={userRank}
              onSignOut={handleSignOut}
              onUpdateProfile={handleProfileUpdate}
              onPhotoUpload={handlePhotoUpload}
            />;
      case 'userProfile':
        if (!viewedProfile) return <div className="p-8 text-center text-slate-400">User not found.</div>;
        const rank = leaderboardData.findIndex(u => u.id === viewedProfile.id) + 1;
        return <ProfileView 
            profileData={viewedProfile}
            isCurrentUser={user?.uid === viewedProfile.id}
            rank={rank > 0 ? rank : null}
            onSignOut={handleSignOut}
            onBack={() => {
                setViewedProfile(null);
                setMainView('leaderboard');
            }}
          />;
      default:
        return <div className="p-8 text-center text-slate-400">This feature is coming soon!</div>;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const avatarSeed = currentUserData?.displayName || currentUserData?.email || 'User';
  const avatarUrl = currentUserData?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${avatarSeed}`;


  return (
    <div className="h-screen bg-slate-900 text-slate-50 flex flex-col items-center justify-center transition-colors duration-300">
      {!user ? (
        <AuthPage />
      ) : (
        <div className="w-full max-w-2xl mx-auto h-full flex flex-col font-sans">
          <header className="flex justify-between items-center p-4 border-b border-slate-700/50 flex-shrink-0">
            <h1 className="text-2xl font-bold text-white">ddi</h1>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 bg-yellow-400/10 text-yellow-400 rounded-full px-3 py-1 text-sm font-semibold">
                  <StarIcon />
                  <span>{userXP} XP</span>
              </div>
              <button className="p-1 rounded-full hover:bg-slate-700 transition-colors"><BellIcon /></button>
              <button className="p-1 rounded-full hover:bg-slate-700 transition-colors"><QuestionMarkCircleIcon /></button>
              <div className="relative group">
                <img
                    className="w-9 h-9 rounded-full ring-2 ring-slate-500 object-cover"
                    src={avatarUrl}
                    alt="User"
                />
                 <button
                    onClick={handleSignOut}
                    className="absolute top-full right-0 mt-2 bg-slate-700 text-slate-300 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-slate-600 transition-all scale-0 group-hover:scale-100 origin-top-right whitespace-nowrap"
                  >
                    Sign Out
                  </button>
              </div>
            </div>
          </header>
          
          <main className="flex-grow overflow-y-auto bg-slate-900">
            {isPracticing ? (
              <div className="p-4 bg-slate-800 h-full">{renderPracticeContent()}</div>
            ) : (
             renderMainContent()
            )}
          </main>

          {!isPracticing && mainView !== 'vocabulary' && mainView !== 'userProfile' && <BottomNavbar currentView={mainView} onNavigate={handleNavigate} />}
        </div>
      )}
    </div>
  );
};

export default App;
