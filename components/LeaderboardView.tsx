import React from 'react';
import { User } from 'firebase/auth';
import { LeaderboardUser } from '../types';

const MedalIcon = ({ rank }: { rank: number }) => {
    const colors = ['text-yellow-400', 'text-slate-300', 'text-yellow-600'];
    const iconClasses = "h-7 w-7";

    if (rank < 3) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className={`${iconClasses} ${colors[rank]}`} viewBox="0 0 20 20" fill="currentColor">
              <path d="M11.996 2.003a.75.75 0 00-1.246-.533l-5.024 8.542a.75.75 0 00.528 1.247h2.99c.044 0 .088.006.13.018l-1.68 4.2a.75.75 0 001.246.533l5.024-8.542a.75.75 0 00-.528-1.247h-2.99a.753.753 0 01-.13-.018l1.68-4.2z" />
              <path d="M12.25 1a.75.75 0 00-1.5 0v.333a.75.75 0 001.5 0V1zM10.75 18.5a.75.75 0 001.5 0v-.333a.75.75 0 00-1.5 0v.333zM4.75 10a.75.75 0 000 1.5h.333a.75.75 0 000-1.5H4.75zM14.917 10a.75.75 0 000 1.5h.333a.75.75 0 000-1.5h-.333zM6.583 4.417a.75.75 0 00-1.06 1.06l.235.236a.75.75 0 001.06-1.06l-.235-.236zM13.083 14.583a.75.75 0 00-1.06 1.06l.235.236a.75.75 0 001.06-1.06l-.235-.236zM6.583 15.643a.75.75 0 001.06-1.06l-.235-.236a.75.75 0 00-1.06 1.06l.235.236zM13.083 5.477a.75.75 0 001.06-1.06l-.235-.236a.75.75 0 00-1.06 1.06l.235.236z" />
            </svg>
        );
    }
    return <span className="font-bold text-slate-400 text-lg w-7 text-center">{rank + 1}</span>;
}


interface LeaderboardViewProps {
  users: LeaderboardUser[];
  currentUser: User | null;
  onViewProfile: (user: LeaderboardUser) => void;
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ users, currentUser, onViewProfile }) => {
  if (users.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 flex flex-col h-full justify-center items-center">
        <h2 className="text-2xl font-bold text-white mb-2">লিডারবোর্ড</h2>
        <p>এখনও কোনো ডেটা নেই।</p>
        <p>কুইজ খেলে পয়েন্ট অর্জন শুরু করুন!</p>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">লিডারবোর্ড</h2>
      <ul className="space-y-3">
        {users.map((user, index) => {
          const isCurrentUser = currentUser?.uid === user.id;
          const nameToDisplay = user.displayName || user.nickname || user.email;
          const avatarUrl = user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${nameToDisplay}`;

          return (
            <li
              key={user.id}
              onClick={() => onViewProfile(user)}
              className={`flex items-center p-3 rounded-lg transition-all cursor-pointer hover:bg-slate-700/50 ${isCurrentUser ? 'bg-blue-500/20 border-2 border-blue-400 shadow-lg' : 'bg-slate-800'}`}
            >
              <div className="w-10 text-center font-bold text-lg flex items-center justify-center">
                <MedalIcon rank={index} />
              </div>
              <img
                className="w-10 h-10 rounded-full mx-3 ring-2 ring-slate-600 object-cover"
                src={avatarUrl}
                alt={nameToDisplay}
              />
              <div className="flex-grow overflow-hidden">
                <p className={`font-semibold truncate ${isCurrentUser ? 'text-white' : 'text-slate-200'}`}>{nameToDisplay}</p>
              </div>
              <div className="flex items-center flex-shrink-0 ml-3 space-x-1.5 bg-yellow-400/10 text-yellow-400 rounded-full px-3 py-1 text-sm font-semibold">
                  <span>{user.xp} XP</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LeaderboardView;
