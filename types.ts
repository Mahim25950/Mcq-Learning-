// Fix: Define and export all necessary types. The original file content was incorrect.
export interface Subject {
  id: string;
  name: string;
  emoji: string;
}

export interface MCQ {
  question: string;
  options: string[];
  answer: number;
}

export interface LeaderboardUser {
  id: string;
  email: string;
  xp: number;
  displayName: string;
  nickname: string;
  photoURL: string;
}

export interface VocabularyWord {
  word: string;
  meaning: string;
  synonym: string;
  antonym: string;
}
