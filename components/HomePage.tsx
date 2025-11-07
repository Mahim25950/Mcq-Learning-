import React from 'react';
import { SUBJECTS } from '../constants';
import { MCQ } from '../types';

type MainView = 'home' | 'archive' | 'review' | 'profile' | 'leaderboard' | 'vocabulary';

interface HomePageProps {
  onStartPractice: () => void;
  mistakes: { [subjectId: string]: MCQ[] };
  onRetryMistakes: (subjectId: string) => void;
  onNavigate: (view: MainView) => void;
}

// --- Icon components for the grid ---
const StoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const LightningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ABCIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 10.5c0-.828.672-1.5 1.5-1.5h1.5c.828 0 1.5.672 1.5 1.5v3c0 .828-.672 1.5-1.5 1.5h-1.5A1.5 1.5 0 016 13.5v-3zM14 9l3 6 3-6" /></svg>;
const TestIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const BookmarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>;

// --- Other Icons ---
const RetryIcon = () => <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 3a1 1 0 00-1-1H7a1 1 0 00-1 1v2a1 1 0 001 1h7a1 1 0 001-1V3zM19 12a7 7 0 11-14 0 7 7 0 0114 0z" transform="rotate(-45 12 12)" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3l2 1" /></svg>;
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 16l-1.5 1.5M20 20l-1.5-1.5A9 9 0 013.5 8l1.5-1.5" /></svg>;
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const ProgressIcon1 = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ProgressIcon2 = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0118 15c0 2-1.79 4-4 4a5 5 0 01-1.414-.293" /></svg>;
const ProgressIcon3 = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>;
const ProgressIcon4 = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;

const dailyGoals = [
  { text: '২০টি প্রশ্নের উত্তর দিন', progress: '0/20', Icon: ProgressIcon1, value: 0 },
  { text: 'আপনার সঠিক উত্তর ধারা বজায় রাখুন (৩+)', progress: '০/৩', Icon: ProgressIcon2, value: 0 },
  { text: '৫টি নতুন শব্দ শিখুন', progress: '০/৫', Icon: ProgressIcon3, value: 0 },
  { text: '১টি Matching টেবিল খেলুন', progress: '০/১', Icon: ProgressIcon4, value: 0 },
];

const HomePage: React.FC<HomePageProps> = ({ onStartPractice, mistakes, onRetryMistakes, onNavigate }) => {
  const mistakeSubjects = Object.keys(mistakes).filter(key => mistakes[key] && mistakes[key].length > 0);

  const getSubjectName = (subjectId: string) => {
    return SUBJECTS.find(s => s.id === subjectId)?.name || 'Unknown Subject';
  };
  
  const gridItems = [
    { label: 'স্টোর/আনলক', Icon: StoreIcon, color: 'bg-blue-500', action: null },
    { label: 'প্রশ্ন ব্যাংক', Icon: BookIcon, color: 'bg-green-500', action: null },
    { label: 'ক্লাস ও প্র্যাকটিস', Icon: LightningIcon, color: 'bg-yellow-500', action: onStartPractice },
    { label: 'মক পরীক্ষা', Icon: PencilIcon, color: 'bg-red-500', action: null },
    { label: 'রুটিন', Icon: CalendarIcon, color: 'bg-cyan-500', action: null },
    { label: 'শব্দভান্ডার', Icon: ABCIcon, color: 'bg-purple-500', action: () => onNavigate('vocabulary') },
    { label: 'পরীক্ষা', Icon: TestIcon, color: 'bg-orange-500', action: null },
    { label: 'স্টাডি প্ল্যানার', Icon: ListIcon, color: 'bg-teal-500', action: null },
    { label: 'দ্রুত রিভিশন', Icon: BookmarkIcon, color: 'bg-indigo-500', action: null },
  ];

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* Grid Menu */}
      <div className="grid grid-cols-3 gap-3">
        {gridItems.map(item => {
          const isEnabled = !!item.action;
          return (
            <button
              key={item.label}
              onClick={isEnabled ? item.action : undefined}
              disabled={!isEnabled}
              className={`flex flex-col items-center justify-center p-3 aspect-square rounded-xl transition-all ${isEnabled ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-neutral-800 opacity-50 cursor-not-allowed'}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color} mb-2`}><item.Icon /></div>
              <span className="text-xs text-center text-slate-300 font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* Continue where you left off */}
      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-2">যেখান থেকে শেষ করেছিলেন</h2>
        <div className="bg-neutral-800 p-4 rounded-xl">
          <p className="text-sm font-semibold text-slate-200">আপনার সবচেয়ে শেষ সেশনটি আবার শুরু করুন</p>
          <p className="text-xs text-slate-400 mt-1">কোনো চলমান সেশন নেই</p>
        </div>
      </div>
      
       {/* Performance based practice */}
       <div>
        <h2 className="text-lg font-bold text-slate-100 mb-2">পারফরম্যান্স অনুযায়ী প্রাকটিসের জন্য</h2>
        {mistakeSubjects.length > 0 ? (
          <div className="space-y-3">
            {mistakeSubjects.map(subjectId => (
              <div key={subjectId} className="bg-neutral-800 p-4 rounded-xl border border-red-500/50 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <RetryIcon />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{getSubjectName(subjectId)}-এর ভুলগুলো আবার চেষ্টা করুন</p>
                    <p className="text-xs text-slate-400 mt-1">({mistakes[subjectId].length} টি)</p>
                  </div>
                </div>
                <button
                  onClick={() => onRetryMistakes(subjectId)}
                  className="bg-red-500/80 text-white text-xs font-bold py-2 px-3 rounded-lg hover:bg-red-500 transition-colors"
                >
                  শুরু করুন
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-800 p-4 rounded-xl border border-slate-700 flex items-center space-x-3">
            <RetryIcon />
            <div>
              <p className="text-sm font-semibold text-slate-200">কোনো ভুল খুঁজে পাওয়া যায়নি</p>
              <p className="text-xs text-slate-400 mt-1">চালিয়ে যান!</p>
            </div>
          </div>
        )}
      </div>


      {/* Daily Goal */}
      <div className="bg-neutral-800 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
                <TargetIcon />
                <h2 className="text-lg font-bold text-slate-100">দৈনিক লক্ষ্যমাত্রা</h2>
            </div>
            <button className="p-1.5 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"><RefreshIcon /></button>
        </div>
        <p className="text-sm text-slate-400 mb-4">আজকের চ্যালেঞ্জ সম্পূর্ণ করে পয়েন্ট অর্জন করুন!</p>
        <div className="space-y-4">
            {dailyGoals.map(goal => (
                <div key={goal.text}>
                    <div className="flex items-center justify-between mb-1.5">
                       <div className="flex items-center space-x-3">
                           <goal.Icon />
                           <span className="text-sm font-medium text-slate-200">{goal.text}</span>
                       </div>
                       <span className="text-xs font-mono text-slate-400">{goal.progress}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${goal.value}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;