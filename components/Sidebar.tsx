
import React, { useState, useEffect } from 'react';
import { View, User } from '../types';
import Logo from './Logo';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  user: User;
  onLogout: () => void;
  isDark: boolean;
  toggleDark: () => void;
  activeSession?: boolean;
  unreadCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, user, onLogout, isDark, toggleDark, activeSession, unreadCount = 0 }) => {
  const [hasProKey, setHasProKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio) {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasProKey(hasKey);
      }
    };
    checkKey();
    const interval = setInterval(checkKey, 5000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { label: View; icon: string }[] = [
    { label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Timetable', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Library', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { label: 'Clubs', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Scholarships', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'StudyGroup', icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994-.586-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z' },
    { label: 'Assignments', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { label: 'Sports', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Assistant', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-20 md:w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-purple-100 dark:border-purple-900/50 z-50 flex flex-col transition-all shadow-2xl">
      <div className="p-8 border-b border-purple-50 dark:border-purple-900/30 flex items-center gap-4">
        <Logo className="w-14 h-14" />
        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            <span className="font-funky text-2xl tracking-tight text-purple-800 dark:text-purple-300">UniPlus</span>
            {hasProKey && (
              <span className="bg-fuchsia-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-md uppercase animate-pulse">Pro</span>
            )}
          </div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-fuchsia-500 font-black">Secure Matrix</p>
        </div>
      </div>

      <nav className="flex-1 mt-8 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.label)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[2rem_1rem_2rem_1rem] transition-all group relative overflow-hidden ${
              currentView === item.label
                ? 'bg-purple-600 text-white shadow-xl shadow-purple-200 dark:shadow-none translate-x-1'
                : 'text-slate-500 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-300'
            }`}
          >
            <div className="relative">
              <svg
                className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 group-hover:scale-125 ${currentView === item.label ? 'animate-bounce' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
              </svg>
              {item.label === 'Dashboard' && unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-fuchsia-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-[8px] font-black text-white animate-pulse">
                  {unreadCount}
                </div>
              )}
              {item.label === 'StudyGroup' && activeSession && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
              )}
            </div>
            <span className="hidden md:block font-extrabold text-sm uppercase tracking-wider">{item.label}</span>
            {currentView === item.label && (
              <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-fuchsia-400"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-purple-50 dark:border-purple-900/30 space-y-4">
        <div className="flex gap-2">
          <button 
            onClick={toggleDark}
            className="flex-1 flex items-center justify-center p-3 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 transition-all hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/40"
            title="Toggle Pulse Theme"
          >
            {isDark ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            )}
          </button>
          <button 
            onClick={onLogout}
            className="flex-1 flex items-center justify-center p-3 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 transition-all hover:bg-red-600 hover:text-white"
            title="Terminate Session"
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 bg-purple-50/50 dark:bg-purple-900/20 rounded-2xl group cursor-pointer border border-transparent hover:border-purple-300 transition-all" onClick={() => onNavigate('Profile')}>
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-lg group-hover:rotate-6 transition-transform relative">
            <img src={user.photo || `https://ui-avatars.com/api/?name=${user.name}&background=A855F7&color=fff`} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="hidden md:block flex-1 min-w-0">
            <p className="text-xs font-black truncate text-purple-900 dark:text-purple-100">{user.name}</p>
            <p className="text-[10px] text-fuchsia-500 dark:text-fuchsia-400 font-bold tracking-tighter uppercase">Verified Pulse</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
