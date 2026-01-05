
import React, { useState, useEffect } from 'react';
import { User, AuthSession } from '../types';
import { authService } from '../services/authService';
import Logo from './Logo';

interface AuthProps {
  onAuth: (session: AuthSession) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    department: 'Computer Science',
    year: '1st Year',
    batch: '2023-27'
  });

  useEffect(() => {
    setError(null);
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const newUser: User = {
          studentId: formData.studentId,
          name: formData.name,
          department: formData.department,
          batch: formData.batch,
          year: formData.year,
          email: formData.email,
          phone: formData.phone || '+91 9999999999',
          registeredEventIds: [],
          attendance: {
            academic: { attended: 0, total: 0, subjects: [] },
            events: { attended: 0, total: 0, missedEventTitles: [] }
          }
        };
        const session = await authService.signup(newUser, formData.password);
        onAuth(session);
      } else if (mode === 'login') {
        // Strictly using studentId for login
        const session = await authService.login(formData.studentId, formData.password);
        onAuth(session);
      } else {
        alert(`Recovery sequence initiated for ID ${formData.studentId || 'N/A'}. Check your official pulse mail! 🚀`);
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message.split(': ')[1] || "Authentication failure. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAccess = async () => {
    setIsLoading(true);
    try {
      const demoUser: User = {
        studentId: 'BVM2024DEMO',
        name: 'Demo Student',
        department: 'Computer Science',
        batch: '2023-27',
        year: '3rd Year',
        email: 'demo@bvm.edu',
        phone: '+91 9876543210',
        registeredEventIds: ['e1'],
        attendance: {
          academic: { attended: 35, total: 40, subjects: [] },
          events: { attended: 1, total: 1, missedEventTitles: [] }
        }
      };
      const session = authService.createSession(demoUser);
      onAuth(session);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-pattern bg-purple-50 dark:bg-slate-950">
      <div className="glass card-shape w-full max-w-lg p-10 shadow-[0_30px_100px_rgba(168,85,247,0.2)] relative overflow-hidden border-4 border-purple-100 dark:border-purple-900/30 funky-shadow animate-in fade-in zoom-in-95 duration-500">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="text-center mb-10">
          <Logo className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-4xl font-funky text-purple-800 dark:text-purple-300 tracking-tighter">UniPlus</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-xs mt-2 uppercase tracking-[0.2em]">
            {mode === 'login' ? 'ID Verification Protocol' : mode === 'signup' ? "Establish New Pulse" : 'Reset ID Connection'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/30 rounded-2xl animate-in shake duration-300">
            <p className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' ? (
            <div className="animate-in slide-in-from-top-4 duration-300 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Full Name</label>
                  <input required className="w-full px-6 py-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border-2 border-purple-50 dark:border-purple-900/30 focus:border-purple-500 outline-none transition-all dark:text-white font-bold" placeholder="Radhika S." onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Student ID (23CP001)</label>
                  <input required className="w-full px-6 py-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border-2 border-purple-50 dark:border-purple-900/30 focus:border-purple-500 outline-none transition-all dark:text-white font-bold" placeholder="ID Number" onChange={e => setFormData({...formData, studentId: e.target.value})} />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Campus Email</label>
                <input type="email" required className="w-full px-6 py-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border-2 border-purple-50 dark:border-purple-900/30 focus:border-purple-500 outline-none transition-all dark:text-white font-bold" placeholder="student@bvm.edu" onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Dept</label>
                  <select className="w-full px-4 py-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border-2 border-purple-50 dark:border-purple-900/30 outline-none dark:text-white font-bold" onChange={e => setFormData({...formData, department: e.target.value})}>
                    <option>Computer Science</option>
                    <option>EC</option>
                    <option>EL</option>
                    <option>IT</option>
                    <option>Mech</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Year</label>
                  <select className="w-full px-4 py-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border-2 border-purple-50 dark:border-purple-900/30 outline-none dark:text-white font-bold" onChange={e => setFormData({...formData, year: e.target.value})}>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Student ID Number</label>
                <input 
                  required 
                  className="w-full px-6 py-4 rounded-3xl bg-white/50 dark:bg-slate-800/50 border-2 border-purple-50 dark:border-purple-900/30 focus:border-purple-500 outline-none transition-all dark:text-white font-bold" 
                  placeholder="e.g., 23CP001" 
                  onChange={e => setFormData({...formData, studentId: e.target.value})}
                />
              </div>
            </div>
          )}

          {mode !== 'forgot' && (
            <div className="relative space-y-1">
              <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Secured Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full px-6 py-4 pr-14 rounded-3xl bg-white/50 dark:bg-slate-800/50 border-2 border-purple-50 dark:border-purple-900/30 focus:border-purple-500 outline-none transition-all dark:text-white font-bold" 
                  placeholder="••••••••" 
                  required
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="pt-4 space-y-3">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-3xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all funky-shadow flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {mode === 'login' ? 'Initiate Session' : mode === 'signup' ? "Create Profile" : 'Send Recovery Beam'}
            </button>
            
            {mode === 'login' && (
              <button 
                type="button" 
                onClick={handleQuickAccess}
                disabled={isLoading}
                className="w-full py-4 bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 font-black text-[10px] uppercase tracking-[0.3em] rounded-3xl border-2 border-purple-100 dark:border-purple-900/30 hover:bg-purple-50 transition-all disabled:opacity-50"
              >
                Instant Pulse (Demo ID Access)
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 flex flex-col gap-3 items-center text-[10px] font-black uppercase tracking-widest">
          {mode === 'login' ? (
            <>
              <button onClick={() => setMode('forgot')} className="text-fuchsia-500 hover:text-purple-600 transition-colors">Lost your credential key?</button>
              <p className="text-slate-400">New at BVM? <button onClick={() => setMode('signup')} className="text-purple-600 dark:text-purple-400 underline underline-offset-4 decoration-2">Register Now</button></p>
            </>
          ) : (
            <button onClick={() => setMode('login')} className="text-purple-600 dark:text-purple-400 border-b-2 border-purple-100 hover:border-purple-300 transition-all">Back to Login</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
