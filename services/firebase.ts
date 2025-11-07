import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, update } from "firebase/database";
import { 
  getAuth, 
  onAuthStateChanged,
  User,
  NextOrObserver
} from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { MCQ, LeaderboardUser } from '../types';

// IMPORTANT: This configuration has been updated with your provided details.
const firebaseConfig = {
  apiKey: "AIzaSyDMN3D2ghLboXbXCR3EJ53gJTuEeYR9N8Y",
  authDomain: "earm-db1ec.firebaseapp.com",
  databaseURL: "https://earm-db1ec-default-rtdb.firebaseio.com",
  projectId: "earm-db1ec",
  storageBucket: "earm-db1ec.appspot.com",
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);
export const auth = getAuth(app);

export const onAuthChange = (callback: NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback);
};

export const uploadProfilePicture = async (userId: string, file: File): Promise<string> => {
    const fileRef = storageRef(storage, `profile_pictures/${userId}`);
    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);
    return photoURL;
};

export const createUserProfile = async (userId: string, email: string): Promise<void> => {
  const userRef = ref(database, `users/${userId}`);
  await set(userRef, {
    email: email,
    xp: 0,
    displayName: '',
    nickname: '',
    photoURL: ''
  });
};

export const getUserProfile = async (userId: string): Promise<LeaderboardUser | null> => {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
        return { id: userId, ...snapshot.val() };
    }
    return null;
};

export const updateUserProfile = async (userId: string, data: { displayName?: string; nickname?: string; photoURL?: string; }): Promise<void> => {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, data);
};

export const getMCQs = async (subjectId: string): Promise<MCQ[] | null> => {
  const mcqsRef = ref(database, `mcqs/${subjectId}`);
  const snapshot = await get(mcqsRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

export const saveMCQs = async (subjectId: string, mcqs: MCQ[]): Promise<void> => {
  const mcqsRef = ref(database, `mcqs/${subjectId}`);
  await set(mcqsRef, mcqs);
};

export const getUserXP = async (userId: string): Promise<number> => {
  const xpRef = ref(database, `users/${userId}/xp`);
  const snapshot = await get(xpRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return 0; // Default to 0 if no XP record found
  }
};

export const addUserXP = async (userId: string, pointsToAdd: number): Promise<void> => {
  const currentXP = await getUserXP(userId);
  const newXP = currentXP + pointsToAdd;
  const xpRef = ref(database, `users/${userId}/xp`);
  await set(xpRef, newXP);
};

export const getMistakes = async (userId: string): Promise<{[subjectId: string]: MCQ[]}> => {
  const mistakesRef = ref(database, `users/${userId}/mistakes`);
  const snapshot = await get(mistakesRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return {};
  }
};

export const addMistakes = async (userId: string, subjectId: string, newMistakes: MCQ[]): Promise<void> => {
  const subjectMistakesRef = ref(database, `users/${userId}/mistakes/${subjectId}`);
  const snapshot = await get(subjectMistakesRef);
  let existingMistakes: MCQ[] = [];
  if (snapshot.exists()) {
    existingMistakes = snapshot.val();
  }

  // Create a Set of existing question strings to check for duplicates
  const existingQuestions = new Set(existingMistakes.map(q => q.question));
  
  // Filter newMistakes to only include ones not already present
  const uniqueNewMistakes = newMistakes.filter(q => !existingQuestions.has(q.question));

  if (uniqueNewMistakes.length > 0) {
    const allMistakes = [...existingMistakes, ...uniqueNewMistakes];
    await set(subjectMistakesRef, allMistakes);
  }
};

export const updateMistakes = async (userId: string, subjectId: string, remainingMistakes: MCQ[]): Promise<void> => {
    const subjectMistakesRef = ref(database, `users/${userId}/mistakes/${subjectId}`);
    if (remainingMistakes.length > 0) {
        await set(subjectMistakesRef, remainingMistakes);
    } else {
        // If no mistakes remain, remove the subject node
        await set(subjectMistakesRef, null);
    }
};

export const getLeaderboardData = async (): Promise<LeaderboardUser[]> => {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const usersData = snapshot.val();
      const leaderboard: LeaderboardUser[] = Object.keys(usersData)
        .map(userId => ({
            id: userId,
            email: usersData[userId].email || 'Anonymous',
            xp: usersData[userId].xp || 0,
            displayName: usersData[userId].displayName || '',
            nickname: usersData[userId].nickname || '',
            photoURL: usersData[userId].photoURL || ''
        }))
        .filter(user => user.xp > 0);
      
      // Sort by XP descending
      leaderboard.sort((a, b) => b.xp - a.xp);

      return leaderboard;
    }
    return [];
};
