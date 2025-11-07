import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError
} from 'firebase/auth';
import { auth, createUserProfile } from '../services/firebase';
import Spinner from './Spinner';

type FormMode = 'signin' | 'signup';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<FormMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleMode = () => {
    setMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setError(null);
    setEmail('');
    setPassword('');
  };

  const handleAuthError = (err: AuthError) => {
    switch (err.code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if(user.email) {
          await createUserProfile(user.uid, user.email);
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // On success, the onAuthStateChanged listener in App.tsx will handle the redirect.
    } catch (err) {
      setError(handleAuthError(err as AuthError));
      setIsLoading(false);
    }
  };

  const title = mode === 'signin' ? 'Welcome Back!' : 'Create an Account';
  const buttonText = mode === 'signin' ? 'Sign In' : 'Sign Up';
  const toggleText = mode === 'signin' 
    ? "Don't have an account?" 
    : "Already have an account?";
  const toggleLinkText = mode === 'signin' ? "Sign Up" : "Sign In";

  return (
    <div className="w-full max-w-md mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
            ddi
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
            Your AI-Powered MCQ Learning Companion
        </p>
      </header>
      <main className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-6">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password"  className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? <Spinner /> : buttonText}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          {toggleText}{' '}
          <button onClick={toggleMode} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            {toggleLinkText}
          </button>
        </p>
      </main>
    </div>
  );
};

export default AuthPage;