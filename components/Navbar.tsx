import React from 'react';

type MainView = 'home' | 'archive' | 'review' | 'profile' | 'leaderboard';

interface BottomNavbarProps {
  currentView: MainView;
  onNavigate: (view: MainView) => void;
}

// --- Icon Components ---
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke={active ? '#28C985' : 'currentColor'}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const ArchiveIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke={active ? '#28C985' : 'currentColor'}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);
const LeaderboardIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke={active ? '#28C985' : 'currentColor'}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);
const ReviewIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke={active ? '#28C985' : 'currentColor'}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
  </svg>
);
const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke={active ? '#28C985' : 'currentColor'}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);


const BottomNavbar: React.FC<BottomNavbarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: 'home', label: 'হোম', Icon: HomeIcon },
    { view: 'archive', label: 'আর্কাইভ', Icon: ArchiveIcon },
    { view: 'leaderboard', label: 'লিডারবোর্ড', Icon: LeaderboardIcon },
    { view: 'review', label: 'রিভিউ', Icon: ReviewIcon },
    { view: 'profile', label: 'প্রোফাইল', Icon: ProfileIcon },
  ] as const;

  return (
    <nav className="flex-shrink-0 w-full max-w-2xl mx-auto fixed bottom-0 left-1/2 -translate-x-1/2 bg-neutral-800 border-t border-slate-700/50 flex justify-around items-center h-16">
      {navItems.map(({ view, label, Icon }) => {
        const isActive = currentView === view;
        return (
          <button
            key={view}
            onClick={() => onNavigate(view)}
            className={`flex flex-col items-center justify-center h-full w-full transition-colors ${isActive ? 'text-[#28C985]' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Icon active={isActive} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavbar;