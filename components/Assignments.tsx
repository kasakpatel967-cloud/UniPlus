
import React, { useState } from 'react';
import { ASSIGNMENTS } from '../constants';
import { User } from '../types';

interface AssignmentsProps {
  user: User;
}

// Using standard function declaration for better TypeScript prop inference
export default function Assignments({ user }: AssignmentsProps) {
  const [submittedIds, setSubmittedIds] = useState<string[]>([]);
  const filtered = ASSIGNMENTS.filter(a => a.department === user.department || a.department === 'Common');

  const handleUpload = (id: string) => {
    alert("Pulse uploaded successfully! Validating with academic brain...");
    setSubmittedIds(prev => [...prev, id]);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Assignment Vault</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage, upload, and track your coursework for {user.department}.</p>
        </div>
        <div className="px-6 py-3 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-2xl border border-fuchsia-200 dark:border-fuchsia-800">
           <span className="text-[10px] font-black text-fuchsia-600 dark:text-fuchsia-300 uppercase tracking-widest">Next Deadline: 18 May</span>
        </div>
      </header>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(item => {
            const isSubmitted = submittedIds.includes(item.id);
            return (
              <div key={item.id} className={`bg-white dark:bg-slate-800 p-8 card-shape border-2 transition-all flex flex-col group relative overflow-hidden funky-shadow ${
                isSubmitted ? 'border-green-500' : 'border-slate-50 dark:border-slate-700 hover:border-indigo-500'
              }`}>
                {isSubmitted && (
                  <div className="absolute top-4 right-4 text-green-500 animate-bounce">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest rounded-lg">
                      {item.subject}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                  
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>
                      </div>
                      <p className="text-xs font-black text-red-500 uppercase tracking-widest">Due: {item.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Format: PDF/ZIP Max 50MB</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  disabled={isSubmitted}
                  onClick={() => handleUpload(item.id)}
                  className={`mt-10 w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl ${
                    isSubmitted 
                    ? 'bg-green-100 text-green-600 cursor-default' 
                    : 'bg-slate-900 dark:bg-indigo-600 text-white hover:bg-purple-600 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isSubmitted ? 'Submission Logged' : 'Deploy Payload'}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-[3rem_1rem_3rem_1rem] border-4 border-dashed border-slate-100 dark:border-slate-700 shadow-inner funky-shadow">
           <div className="w-20 h-20 mx-auto bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-6 text-slate-300">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
           </div>
           <p className="text-slate-400 dark:text-slate-500 font-funky text-xl tracking-tighter">Zero Tasks Pending</p>
           <p className="text-sm font-bold text-indigo-500 mt-2">You're completely up to date with your academic pulse.</p>
        </div>
      )}
    </div>
  );
}
