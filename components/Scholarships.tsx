
import React, { useState } from 'react';
import { SCHOLARSHIPS } from '../constants';
import { Scholarship } from '../types';

const Scholarships: React.FC = () => {
  const [viewing, setViewing] = useState<Scholarship | null>(null);
  const [applying, setApplying] = useState<Scholarship | null>(null);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Pulse Application Broadcasted! The review board will analyze your metrics for " + applying?.title);
    setApplying(null);
  };

  if (applying) {
    return (
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-12 card-shape shadow-[0_40px_100px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300 border-4 border-indigo-200 dark:border-indigo-800 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1" /></svg>
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Grant Application</h2>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{applying.title}</p>
           </div>
        </div>

        <form onSubmit={handleApply} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Academic Metric (Current GPA)</label>
              <input required type="number" step="0.01" max="10" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-3xl outline-none border-2 border-slate-100 dark:border-slate-700 focus:border-indigo-500 dark:text-white transition-all" placeholder="e.g. 9.45" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Enrollment Number</label>
              <input required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-3xl outline-none border-2 border-slate-100 dark:border-slate-700 focus:border-indigo-500 dark:text-white transition-all" placeholder="e.g. 23CPXXX" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Notable Achievements (List top 3)</label>
            <textarea required rows={3} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-3xl outline-none border-2 border-slate-100 dark:border-slate-700 focus:border-indigo-500 dark:text-white transition-all" placeholder="Paper publications, hackathon wins, community service..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Faculty Reference</label>
              <input required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-3xl outline-none border-2 border-slate-100 dark:border-slate-700 focus:border-indigo-500 dark:text-white transition-all" placeholder="Name of Referrer Professor" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Family Annual Income Pulse</label>
              <select className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-3xl outline-none border-2 border-slate-100 dark:border-slate-700 focus:border-indigo-500 dark:text-white transition-all">
                <option>Below 2.5 LPA</option>
                <option>2.5 LPA - 5 LPA</option>
                <option>5 LPA - 8 LPA</option>
                <option>Above 8 LPA</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Statement of Purpose</label>
            <textarea required rows={4} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 rounded-3xl outline-none border-2 border-slate-100 dark:border-slate-700 focus:border-indigo-500 dark:text-white transition-all" placeholder="Why do you deserve this academic fuel?"></textarea>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-2xl uppercase text-[10px] tracking-[0.3em]">Broadcast Application</button>
            <button onClick={() => setApplying(null)} className="px-10 py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-black rounded-3xl hover:bg-slate-200 transition-all uppercase text-[10px] tracking-widest">Abort</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Academic Fuel</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Opportunities to fund your academic excellence at BVM.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {SCHOLARSHIPS.map(s => (
          <div key={s.id} className="bg-white dark:bg-slate-800 p-10 card-shape border border-slate-100 dark:border-slate-700 shadow-xl group hover:border-indigo-500 transition-all funky-shadow relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-start mb-6">
               <div className="flex-1">
                 <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors tracking-tight">{s.title}</h3>
                 <p className="text-[10px] font-black text-indigo-500 mt-2 uppercase tracking-widest">{s.provider}</p>
               </div>
               <div className="text-right">
                 <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{s.amount}</p>
                 <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Grant Sum</p>
               </div>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-10">{s.description}</p>
            
            <div className="mt-auto pt-8 flex items-center justify-between border-t border-slate-50 dark:border-slate-700">
               <div className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-widest">
                  <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Pulse Ends: {new Date(s.deadline).toLocaleDateString()}
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setViewing(s)} className="px-6 py-3 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all">Info</button>
                  <button onClick={() => setApplying(s)} className="px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all">Apply Now</button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {viewing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[100]">
           <div className="bg-white dark:bg-slate-800 max-w-xl w-full p-10 card-shape shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-indigo-100 dark:border-indigo-900">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">{viewing.title}</h2>
              <div className="w-20 h-1.5 bg-indigo-600 mb-8 rounded-full"></div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-10 font-medium">{viewing.description}</p>
              <button onClick={() => setViewing(null)} className="w-full py-5 bg-indigo-900 dark:bg-indigo-600 text-white font-black rounded-3xl uppercase text-[10px] tracking-[0.3em] shadow-xl hover:scale-105 transition-all">Acknowledge</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Scholarships;
