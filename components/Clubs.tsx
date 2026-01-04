
import React, { useState } from 'react';
import { CLUBS } from '../constants';
import { Club, User } from '../types';

interface ClubsProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const Clubs: React.FC<ClubsProps> = ({ user, onUpdateUser }) => {
  const [joiningClub, setJoiningClub] = useState<Club | null>(null);

  const joined = user.joinedClubIds || [];

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joiningClub) return;
    
    const updatedUser: User = {
      ...user,
      joinedClubIds: [...joined, joiningClub.id]
    };
    onUpdateUser(updatedUser);
    alert(`Welcome to ${joiningClub.name}! Your enrollment pulse has been registered.`);
    setJoiningClub(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Hubs & Chapters</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Join specialized communities and accelerate your career pulse.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="space-y-8">
          <div className="flex items-center gap-4 border-b-4 border-purple-100 dark:border-purple-900/30 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-2xl">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h2 className="text-3xl font-black text-purple-600 dark:text-purple-400 uppercase tracking-tighter">Compulsory Hubs</h2>
          </div>
          <div className="grid gap-8">
            {CLUBS.filter(c => c.type === 'Compulsory').map(club => (
              <div key={club.id} className="bg-white dark:bg-slate-800 p-10 rounded-[3rem_1rem_3rem_1rem] shadow-xl border-2 border-transparent hover:border-purple-500 transition-all cursor-pointer funky-shadow group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-purple-600 transition-colors tracking-tight">{club.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-medium">{club.description}</p>
                <div className="mt-10">
                  <button 
                    disabled={joined.includes(club.id)}
                    onClick={() => setJoiningClub(club)}
                    className={`px-10 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${
                      joined.includes(club.id) 
                      ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600' 
                      : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {joined.includes(club.id) ? 'Status: Enrolled' : 'Begin Admission'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4 border-b-4 border-fuchsia-100 dark:border-fuchsia-900/30 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-fuchsia-600 flex items-center justify-center text-white shadow-2xl">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h2 className="text-3xl font-black text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-tighter">Global Chapters</h2>
          </div>
          <div className="grid gap-8">
            {CLUBS.filter(c => c.type === 'Chapter').map(club => (
              <div key={club.id} className="bg-white dark:bg-slate-800 p-10 rounded-[1rem_3rem_1rem_3rem] border-2 border-slate-50 dark:border-slate-700 shadow-xl hover:border-fuchsia-500 transition-all funky-shadow group relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-fuchsia-600 transition-colors tracking-tight">{club.name}</h3>
                  <div className="w-10 h-10 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-900/30 flex items-center justify-center text-fuchsia-500 shadow-inner">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed font-medium">{club.description}</p>
                <div className="mt-10">
                   <button 
                    disabled={joined.includes(club.id)}
                    onClick={() => setJoiningClub(club)}
                    className={`px-10 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${
                      joined.includes(club.id) 
                      ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600' 
                      : 'bg-slate-900 dark:bg-fuchsia-600 text-white hover:bg-purple-600 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {joined.includes(club.id) ? 'Status: Joined' : 'Connect Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {joiningClub && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[100]">
          <div className="bg-white dark:bg-slate-800 max-w-2xl w-full p-12 card-shape shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-fuchsia-500 dark:border-fuchsia-800 overflow-y-auto max-h-[90vh]">
            <h2 className="text-4xl font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tighter">Chapter Induction</h2>
            <form onSubmit={handleJoinSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Selected Community</label>
                <input readOnly value={joiningClub.name} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none font-black" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Past Experience Pulse</label>
                  <select className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none text-slate-900 dark:text-white focus:border-fuchsia-500">
                     <option>Newbie (Eager Learner)</option>
                     <option>Active Member (Previously Involved)</option>
                     <option>Lead/Core (Executive Experience)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">GitHub / Portfolio Pulse</label>
                  <input placeholder="https://github.com/username" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none text-slate-900 dark:text-white focus:border-fuchsia-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Personal Pitch (250 chars)</label>
                <textarea required rows={3} placeholder="Tell us how you'll contribute to this chapter's growth..." className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none text-slate-900 dark:text-white focus:border-fuchsia-500 transition-all font-medium" />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-5 bg-fuchsia-600 text-white font-black rounded-3xl uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all">Finalize Induction</button>
                <button type="button" onClick={() => setJoiningClub(null)} className="px-10 py-5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black rounded-3xl uppercase text-[10px] tracking-widest hover:bg-slate-200">Abort</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clubs;
