
import React, { useState, useEffect } from 'react';
import { User, Attendance } from '../types';
import Logo from './Logo';

interface AuthProps {
  onAuth: (user: User) => void;
}

interface StoredAccount {
  email: string;
  password?: string;
  profile: User;
}

const Auth: React.FC<AuthProps> = ({ onAuth }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<User & { password?: string }>>({
    department: 'Computer Science',
    year: '1st Year'
  });

  useEffect(() => {
    setError(null);
  }, [mode]);

  const getAccounts = (): StoredAccount[] => {
    const accounts = localStorage.getItem('uniplus_accounts');
    return accounts ? JSON.parse(accounts) : [];
  };

  const saveAccount = (account: StoredAccount) => {
    const accounts = getAccounts();
    accounts.push(account);
    localStorage.setItem('uniplus_accounts', JSON.stringify(accounts));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const accounts = getAccounts();

    if (mode === 'signup') {
      if (accounts.some(acc => acc.email === formData.email)) {
        setError('This email pulse is already registered in the Hub.');
        return;
      }

      const mockAttendance: Attendance = {
        academic: {
          attended: 32,
          total: 42,
          subjects: [
            { name: 'Data Structures', attended: 12, total: 15, missedDates: ['May 12', 'May 14', 'June 01'] },
            { name: 'Cloud Computing', attended: 10, total: 12, missedDates: ['May 10', 'May 20'] },
            { name: 'OS Concepts', attended: 10, total: 15, missedDates: ['May 15', 'May 22', 'June 02', 'June 05', 'June 07'] }
          ]
        },
        events: {
          attended: 1,
          total: 2,
          missedEventTitles: ['BVM Robo-Race 2025 (Registered)']
        }
      };

      const newUser: User = {
        studentId: formData.studentId || 'BVM' + Math.floor(Math.random() * 10000),
        name: formData.name || 'Anonymous Student',
        department: (formData.department as any) || 'Computer Science',
        batch: formData.batch || '2023-27',
        year: formData.year || '2nd Year',
        email: formData.email!,
        phone: formData.phone || '+91 9999999999',
        photo: formData.photo,
        registeredEventIds: ['e1', 'e2'],
        attendance: mockAttendance
      };

      saveAccount({
        email: newUser.email,
        password: formData.password,
        profile: newUser
      });

      localStorage.setItem('uniplus_user', JSON.stringify(newUser));
      onAuth(newUser);

    } else if (mode === 'login') {
      const account = accounts.find(acc => acc.email === formData.email);
      
      if (!account) {
        setError('Email pulse not found. Register a new hub?');
        return;
      }

      if (account.password !== formData.password) {
        setError('Invalid credential key. Matrix access denied.');
        return;
      }

      localStorage.setItem('uniplus_user', JSON.stringify(account.profile));
      onAuth(account.profile);

    } else {
      alert(`A recovery link has been beamed to ${formData.email || 'your registered email'}! 🚀`);
      setMode('login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-pattern bg-purple-50 dark:bg-slate-950">
      <div className="glass card-shape w-full max-w-lg p-10 shadow-[0_30px_100px_rgba(168,85,247,0.2)] relative overflow-hidden border-4 border-purple-100 dark:border-purple-900/30 funky-shadow animate-in fade-in zoom-in-95 duration-500">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="text-center mb-10">
          <Logo className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-funky text-purple-800 dark:text-purple-300 tracking-tighter">UniPlus</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mt-3 uppercase tracking-[0.2em]">
            {mode === 'login' ? 'Vibe Back In' : mode === 'signup' ? "Student's one stop" : 'Reset the Matrix'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-900/30 rounded-2xl animate-in slide-in-from-top-2">
            <p className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div className="animate-in slide-in-from-left-4 duration-300 space-y-4">
              <div>
                <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Display Name</label>
                <input 
                  className="w-full px-6 py-4 rounded-3xl bg-white/50 dark:bg-slate-800/50 border-2 border-purple-50 dark:border-purple-900/30 focus:border-purple-500 outline-none transition-all dark:text-white font-bold" 
                  placeholder="e.g. Radhika Sharma" 
                  required 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Department</label>
                   <select 
                    className="w-full px-6 py-4 rounded-3xl bg-white/50 dark:bg-slate-800/50 border-2 border-purple-50 dark:border-purple-900/30 outline-none focus:border-purple-500 dark:text-white font-bold"
                    onChange={e => setFormData({...formData, department: e.target.value as any})}
                  >
                    <option>Computer Science</option>
                    <option>EC</option>
                    <option>EL</option>
                    <option>IT</option>
                    <option>Mech</option>
                  </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Academic Year</label>
                   <select 
                    className="w-full px-6 py-4 rounded-3xl bg-white/50 dark:bg-slate-800/50 border-2 border-purple-50 dark:border-purple-900/30 outline-none focus:border-purple-500 dark:text-white font-bold"
                    onChange={e => setFormData({...formData, year: e.target.value})}
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {mode === 'forgot' ? (
            <div className="relative animate-in slide-in-from-top-4 duration-300">
              <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Recovery Email</label>
              <input 
                type="email"
                className="w-full px-6 py-4 rounded-3xl bg-white/50 dark:bg-slate-800/50 border-2 border-purple-50 dark:border-purple-900/30 focus:border-purple-500 outline-none transition-all dark:text-white font-bold" 
                placeholder="registered@email.com" 
                required
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <p className="mt-3 text-[10px] text-slate-400 text-center uppercase tracking-widest">We will send a pulse to reset your credentials.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Campus Email</label>
                  <input 
                    type="email"
                    className="w-full px-6 py-4 rounded-3xl bg-white/50 dark:bg-slate-800/50 border-2 border-purple-50 dark:border-purple-900/30 focus:border-purple-500 outline-none transition-all dark:text-white font-bold" 
                    placeholder="student@bvm.edu" 
                    required
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Credential Key</label>
                  <input 
                    className="w-full px-6 py-4 rounded-3xl bg-white/50 dark:bg-slate-800/50 border-2 border-purple-50 dark:border-purple-900/30 focus:border-purple-500 outline-none transition-all dark:text-white font-bold" 
                    placeholder="ID (23CP301)" 
                    required={mode === 'signup'}
                    onChange={e => setFormData({...formData, studentId: e.target.value})}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Secret Password</label>
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
            </>
          )}

          <button type="submit" className="w-full py-5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-3xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all funky-shadow">
            {mode === 'login' ? 'Ignite Sessions' : mode === 'signup' ? "Establish Identity" : 'Send Reset Beam'}
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-3 items-center text-[10px] font-black uppercase tracking-widest">
          {mode === 'login' ? (
            <>
              <button onClick={() => setMode('forgot')} className="text-fuchsia-500 hover:text-purple-600 transition-colors">Lost your key?</button>
              <p className="text-slate-400">New here? <button onClick={() => setMode('signup')} className="text-purple-600 dark:text-purple-400 underline underline-offset-4 decoration-2">Register Hub</button></p>
            </>
          ) : (
            <button onClick={() => setMode('login')} className="text-purple-600 dark:text-purple-400 border-b-2 border-purple-100 hover:border-purple-300 transition-all">Back to Hangar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
