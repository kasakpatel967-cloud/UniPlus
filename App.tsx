
import React, { useState, useEffect, useCallback } from 'react';
import { View, User, Notification, StudyGroup, AuthSession } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Timetable from './components/Timetable';
import Events from './components/Events';
import Clubs from './components/Clubs';
import Scholarships from './components/Scholarships';
import GroupStudy from './components/StudyGroup';
import Assignments from './components/Assignments';
import Sports from './components/Sports';
import Profile from './components/Profile';
import History from './components/History';
import Library from './components/Library';
import SmartAssistant from './components/SmartAssistant';
import Logo from './components/Logo';
import Auth from './components/Auth';
import { authService } from './services/authService';
import { INITIAL_NOTIFICATIONS, STUDY_GROUPS } from './constants';

const App: React.FC = () => {
  const [session, setSession] = useState<AuthSession | null>(() => authService.getSession());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const user = session?.user || null;

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('uniplus_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [groups, setGroups] = useState<StudyGroup[]>(() => {
    const saved = localStorage.getItem('uniplus_groups');
    return saved ? JSON.parse(saved) : STUDY_GROUPS;
  });

  const [activeGroupId, setActiveGroupId] = useState<string | null>(() => {
    return localStorage.getItem('uniplus_active_group');
  });

  const [currentView, setCurrentView] = useState<View>('Dashboard');
  
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('uniplus_darkmode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleAuth = (newSession: AuthSession) => {
    setSession(newSession);
    setCurrentView('Dashboard');
  };

  const handleLogout = useCallback(() => {
    authService.logout();
    setSession(null);
    setCurrentView('Dashboard');
  }, []);

  // Secure Session Monitor (Heartbeat)
  useEffect(() => {
    if (!session) return;

    const checkSession = async () => {
      const now = Date.now();
      const timeLeft = session.expiresAt - now;

      // Refresh 1 minute before expiry
      if (timeLeft < 60000 && timeLeft > 0 && !isRefreshing) {
        setIsRefreshing(true);
        try {
          const newSession = await authService.refreshSession();
          if (newSession) setSession(newSession);
        } catch (err) {
          console.error("Session rotation failed:", err);
          handleLogout();
        } finally {
          setIsRefreshing(false);
        }
      } else if (timeLeft <= 0) {
        handleLogout();
      }
    };

    const interval = setInterval(checkSession, 10000);
    return () => clearInterval(interval);
  }, [session, isRefreshing, handleLogout]);

  const handleUpdateUser = useCallback((updatedUser: User | null) => {
    if (updatedUser && session) {
      const newSession = { ...session, user: updatedUser };
      setSession(newSession);
      localStorage.setItem('uniplus_session', JSON.stringify(newSession));
      
      const accounts = JSON.parse(localStorage.getItem('uniplus_accounts') || '[]');
      const updatedAccounts = accounts.map((acc: any) => 
        acc.studentId === updatedUser.studentId ? { ...acc, profile: updatedUser } : acc
      );
      localStorage.setItem('uniplus_accounts', JSON.stringify(updatedAccounts));
    }
  }, [session]);

  useEffect(() => {
    localStorage.setItem('uniplus_darkmode', JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('uniplus_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('uniplus_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    if (activeGroupId) {
      localStorage.setItem('uniplus_active_group', activeGroupId);
    } else {
      localStorage.removeItem('uniplus_active_group');
    }
  }, [activeGroupId]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'read' | 'time'>) => {
    const newNotif: Notification = {
      ...notif,
      id: 'n' + Date.now(),
      read: false,
      time: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!user) {
    return <Auth onAuth={handleAuth} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard': return (
        <Dashboard 
          user={user!} 
          onNavigate={setCurrentView} 
          notifications={notifications} 
          onMarkRead={markNotificationRead}
          onClearAll={clearAllNotifications}
        />
      );
      case 'Timetable': return <Timetable />;
      case 'Events': return <Events user={user!} onUpdateUser={handleUpdateUser} onAddNotification={addNotification} />;
      case 'Clubs': return <Clubs user={user!} onUpdateUser={handleUpdateUser} />;
      case 'Scholarships': return <Scholarships />;
      case 'StudyGroup': return <GroupStudy groups={groups} setGroups={setGroups} activeGroupId={activeGroupId} setActiveGroupId={setActiveGroupId} />;
      case 'Assignments': return <Assignments user={user!} />;
      case 'Sports': return <Sports user={user!} onUpdateUser={handleUpdateUser} />;
      case 'Profile': return <Profile user={user!} onUpdate={handleUpdateUser} />;
      case 'History': return <History />;
      case 'Library': return <Library user={user!} />;
      case 'Assistant': return <SmartAssistant />;
      default: return <Dashboard user={user!} onNavigate={setCurrentView} notifications={notifications} onMarkRead={markNotificationRead} onClearAll={clearAllNotifications} />;
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-500 bg-pattern ${isDark ? 'dark bg-slate-950' : 'bg-[#fdfaff]'}`}>
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        user={user!} 
        onLogout={handleLogout}
        isDark={isDark}
        toggleDark={() => setIsDark(!isDark)}
        activeSession={!!activeGroupId}
        unreadCount={notifications.filter(n => !n.read).length}
      />
      
      <main className="flex-1 ml-20 md:ml-72 p-6 md:p-10 lg:p-12 overflow-x-hidden min-h-screen relative">
        {/* Session Expiry Warning */}
        {session && session.expiresAt - Date.now() < 60000 && session.expiresAt - Date.now() > 0 && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] animate-bounce">
             <div className="bg-red-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-3">
               <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
               Pulse Expiring: Auto-Renewing...
             </div>
          </div>
        )}

        <div className="absolute top-12 right-12 flex gap-4 z-40">
           <button 
             onClick={toggleFullScreen}
             className="p-4 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border-4 border-purple-50 dark:border-purple-900/30 text-purple-600 hover:scale-110 active:scale-95 transition-all funky-shadow"
             title="Full Screen Mode"
           >
              {isFullScreen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 9L4 4m0 0l5 0m-5 0l0 5m11 0l5-5m0 0l-5 0m5 0l0 5m-5 11l5 5m0 0l-5 0m5 0l0-5m-11 0l-5 5m0 0l5 0m-5 0l0-5" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              )}
           </button>
        </div>

        <div className="max-w-7xl mx-auto pb-32 pt-4">
          {renderView()}
        </div>

        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 md:left-[calc(50%+144px)] flex items-center gap-4 px-10 py-5 glass dark:bg-slate-800/80 rounded-full shadow-[0_20px_50px_rgba(168,85,247,0.3)] z-50 animate-in slide-in-from-bottom-10 duration-1000 border-2 border-purple-200/50">
           <Logo className="w-8 h-8" />
           <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse"></div>
           <span className="font-funky text-sm tracking-widest text-purple-700 dark:text-purple-300">
             {currentView}
             {activeGroupId && currentView !== 'StudyGroup' && <span className="ml-2 text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full animate-pulse">Live Session</span>}
           </span>
        </div>
      </main>
    </div>
  );
};

export default App;
