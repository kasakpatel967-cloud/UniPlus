
import React, { useState } from 'react';
import { SPORTS } from '../constants';
import { Sport, User } from '../types';

interface SportsProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const Sports: React.FC<SportsProps> = ({ user, onUpdateUser }) => {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [joiningFor, setJoiningFor] = useState<Sport | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'joined'>('all');
  
  // Directly derive from props to ensure reactivity when App state updates
  const joinedIds = user.joinedSportIds || [];

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joiningFor) return;
    
    // Safety check: Don't join if already a member
    if (joinedIds.includes(joiningFor.id)) {
      setJoiningFor(null);
      return;
    }

    const updatedUser: User = {
      ...user,
      joinedSportIds: [...joinedIds, joiningFor.id]
    };
    
    onUpdateUser(updatedUser);
    alert(`Pulse Verified! Welcome to the ${joiningFor.name} squad. Your medical and experience logs have been synced with the Gymkhana.`);
    setJoiningFor(null);
  };

  const handleLeave = (sport: Sport) => {
    if (confirm(`Terminate your membership with the ${sport.name} squad? This will clear your active training slot.`)) {
      const updatedUser: User = {
        ...user,
        joinedSportIds: joinedIds.filter(id => id !== sport.id)
      };
      
      // This call updates the parent App state, which flows back down as a new 'user' prop
      onUpdateUser(updatedUser);
      alert(`Pulse Terminated. You have left the ${sport.name} squad.`);
    }
  };

  const filteredSports = viewMode === 'all' 
    ? SPORTS 
    : SPORTS.filter(s => joinedIds.includes(s.id));

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Sports Hub</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-3 italic">Sync your athletic pulse with the BVM Sports Division.</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-fuchsia-50 dark:border-fuchsia-900/30 flex items-center gap-3">
              <div className="w-8 h-8 bg-fuchsia-500 rounded-full flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
              </div>
              <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Memberships: {joinedIds.length}</span>
           </div>
        </div>
      </header>

      {/* Sub-Navigation for Sports */}
      <div className="flex gap-2 p-2 bg-slate-100 dark:bg-slate-900/50 rounded-3xl w-fit border border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => setViewMode('all')}
          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'all' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-md' : 'text-slate-500 hover:text-purple-400'}`}
        >
          Explore All
        </button>
        <button 
          onClick={() => setViewMode('joined')}
          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative ${viewMode === 'joined' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-md' : 'text-slate-500 hover:text-purple-400'}`}
        >
          My Squads
          {joinedIds.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-fuchsia-500 text-white rounded-full flex items-center justify-center text-[8px] border-2 border-white dark:border-slate-800">
              {joinedIds.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredSports.length > 0 ? (
          filteredSports.map(sport => {
            // Recalculated per sport per render
            const isMember = joinedIds.includes(sport.id);
            return (
              <div key={sport.id} className="bg-white dark:bg-slate-800 rounded-[3.5rem_1rem_3.5rem_1rem] overflow-hidden border-2 border-slate-50 dark:border-slate-700 shadow-2xl hover:border-purple-500 transition-all group funky-shadow flex flex-col animate-in zoom-in-95">
                <div className="relative h-64 overflow-hidden">
                  <img src={sport.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute bottom-6 left-8">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{sport.name}</h3>
                    <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest mt-1">BVM Team Alpha</p>
                  </div>
                  {isMember && (
                    <div className="absolute top-6 right-6 px-4 py-1.5 bg-green-500 text-white text-[10px] font-black uppercase rounded-full shadow-lg border-2 border-white animate-pulse">
                      Active Pulse
                    </div>
                  )}
                </div>

                <div className="p-10 flex-1 flex flex-col">
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                    {sport.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Head Coach</p>
                      <p className="text-xs font-black text-slate-800 dark:text-white mt-1">{sport.coach}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Venue Hub</p>
                      <p className="text-xs font-black text-slate-800 dark:text-white mt-1 truncate">{sport.venue}</p>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-4 pt-6 border-t border-slate-50 dark:border-slate-700">
                    {isMember ? (
                      <button 
                        onClick={() => handleLeave(sport)}
                        className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-2 border-red-100 dark:border-red-900/20 hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-95"
                      >
                        Unjoin Squad
                      </button>
                    ) : (
                      <button 
                        onClick={() => setJoiningFor(sport)}
                        className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 active:scale-95 shadow-xl transition-all"
                      >
                        Join Now
                      </button>
                    )}
                    <button 
                      onClick={() => setSelectedSport(sport)}
                      className="px-6 py-4 bg-white dark:bg-slate-700 border-2 border-purple-100 dark:border-purple-800 text-purple-600 dark:text-purple-300 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900 transition-all"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-800/50 card-shape border-4 border-dashed border-slate-100 dark:border-slate-800 text-center funky-shadow">
             <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 text-slate-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Your Squad List is Empty</p>
             <p className="text-sm font-bold text-slate-400 mt-2">Switch to "Explore All" to find your athletic pulse.</p>
             <button 
               onClick={() => setViewMode('all')}
               className="mt-8 px-10 py-4 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl"
             >
               Explore Sports Hub
             </button>
          </div>
        )}
      </div>

      {joiningFor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[120] animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-800 max-w-2xl w-full p-10 card-shape shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-4 border-purple-200 dark:border-purple-800 relative animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
              <button 
                onClick={() => setJoiningFor(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2 flex items-center gap-4">
                 <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 Join {joiningFor.name}
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">BVM Athletic Division Enrollment Pulse</p>

              <form onSubmit={handleJoinSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Experience Pulse</label>
                    <select required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:border-purple-500 dark:text-white font-bold transition-all">
                      <option value="">Select Level</option>
                      <option>Beginner (Rookie)</option>
                      <option>Intermediate (Zonal Player)</option>
                      <option>Advanced (State/National)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Preferred Position/Role</label>
                    <input required placeholder="e.g. Opening Batsman, Forward, etc." className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:border-purple-500 dark:text-white font-bold transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Athletic Motivation (Brief)</label>
                  <textarea required rows={3} placeholder="Tell us why you want to join this squad..." className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:border-purple-500 dark:text-white font-medium transition-all" />
                </div>

                <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-3xl border-2 border-purple-100 dark:border-purple-900/30 flex items-start gap-4">
                  <input required type="checkbox" id="medical" className="mt-1 w-5 h-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500" />
                  <label htmlFor="medical" className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase leading-relaxed cursor-pointer select-none">
                    I confirm I have no underlying medical conditions preventing high-intensity participation.
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 py-5 bg-purple-600 text-white font-black rounded-3xl uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all">Confirm Squad Entry</button>
                  <button type="button" onClick={() => setJoiningFor(null)} className="px-10 py-5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-black rounded-3xl uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-colors">Abort</button>
                </div>
              </form>
           </div>
        </div>
      )}

      {selectedSport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 max-w-2xl w-full p-12 card-shape shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-4 border-purple-100 dark:border-purple-900/30 relative animate-in zoom-in-95 duration-300">
             <button 
               onClick={() => setSelectedSport(null)}
               className="absolute top-8 right-8 text-slate-400 hover:text-purple-600 transition-colors"
             >
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>

             <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center text-white shadow-2xl rotate-3">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedSport.name} Dossier</h2>
                  <p className="text-xs font-bold text-fuchsia-500 uppercase tracking-widest mt-1">Official BVM Sports Division</p>
                </div>
             </div>

             <div className="space-y-8">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl space-y-6">
                   <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Schedule</span>
                      <span className="text-sm font-black text-slate-800 dark:text-white uppercase">{selectedSport.time}</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Squad Strength</span>
                      <span className="text-sm font-black text-slate-800 dark:text-white uppercase">{selectedSport.members} Athletes</span>
                   </div>
                   <div className="flex justify-between items-center pb-2">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Training Venue</span>
                      <span className="text-sm font-black text-slate-800 dark:text-white uppercase">{selectedSport.venue}</span>
                   </div>
                </div>
             </div>

             <button 
               onClick={() => setSelectedSport(null)}
               className="w-full mt-10 py-5 bg-slate-900 dark:bg-purple-600 text-white font-black rounded-3xl uppercase text-[11px] tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
             >
               Acknowledge & Sync
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sports;
