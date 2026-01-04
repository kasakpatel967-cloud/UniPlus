
import React, { useState } from 'react';
import { EVENTS } from '../constants';
import Logo from './Logo';

interface HistoryItem {
  event: typeof EVENTS[0];
  role: string;
  status: string;
  date: string;
  certId: string;
  authority: string;
}

const History: React.FC = () => {
  const [viewingCertificate, setViewingCertificate] = useState<HistoryItem | null>(null);
  
  // Mock participation history with more realistic fields
  const history: HistoryItem[] = [
    { 
      event: EVENTS[0], 
      role: 'Participant', 
      status: 'Completed', 
      date: '2024-12-10',
      certId: 'BVM-TECH-2024-0892',
      authority: 'Department of Computer Science'
    },
    { 
      event: EVENTS[1], 
      role: 'Runner Up', 
      status: 'Completed', 
      date: '2025-01-15',
      certId: 'BVM-CULT-2025-0124',
      authority: 'BVM Cultural Committee'
    }
  ];

  const handleDownload = (certId: string) => {
    alert(`Generating High-Resolution Secure PDF for Certificate ${certId}...\nDigital Signature Validated.\nDownload will begin shortly.`);
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700 pb-20">
      <header>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Academic Credentials</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Verified records of your campus engagements and achievements.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {history.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-8 card-shape shadow-xl border-2 border-slate-50 dark:border-slate-700 group hover:border-purple-500 transition-all funky-shadow flex flex-col">
             <div 
               onClick={() => setViewingCertificate(item)}
               className="w-full h-52 bg-slate-50 dark:bg-slate-900 rounded-3xl mb-6 flex items-center justify-center overflow-hidden border-2 border-slate-100 dark:border-slate-700 cursor-pointer relative group/cert shadow-inner"
             >
                {/* Miniature Preview of the Certificate */}
                <div className="w-[85%] h-[85%] bg-white dark:bg-slate-800 border-4 border-double border-slate-200 dark:border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center text-center scale-90 group-hover/cert:scale-100 transition-transform duration-500">
                   <Logo className="w-8 h-8 mb-2 opacity-40" />
                   <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest leading-none">Official Certificate</p>
                   <div className="w-12 h-0.5 bg-purple-500/30 my-2"></div>
                   <p className="text-[8px] font-black text-slate-700 dark:text-white uppercase truncate w-full">{item.event.title}</p>
                   <div className="mt-3 flex gap-2">
                      <div className="w-6 h-2 bg-slate-100 dark:bg-slate-700 rounded-sm"></div>
                      <div className="w-6 h-2 bg-slate-100 dark:bg-slate-700 rounded-sm"></div>
                   </div>
                </div>
                
                <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover/cert:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                   <span className="bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border border-purple-100 dark:border-purple-900/30">
                      Inspect Credential
                   </span>
                </div>
             </div>

             <div className="flex-1">
               <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-[9px] font-black text-green-600 uppercase rounded-full border border-green-100 dark:border-green-800">
                    {item.status}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</span>
               </div>
               
               <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-purple-600 transition-colors">{item.event.title}</h3>
               <p className="text-xs font-bold text-fuchsia-500 uppercase mt-2 tracking-tighter">{item.role}</p>
               
               <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Certificate ID</p>
                  <code className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg block truncate">
                    {item.certId}
                  </code>
               </div>
             </div>

             <button 
               onClick={() => handleDownload(item.certId)}
               className="mt-8 w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 dark:bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
               Secure Download
             </button>
          </div>
        ))}
      </div>

      {viewingCertificate && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12 z-[100] animate-in fade-in duration-300 overflow-y-auto">
           <div className="bg-[#fdfcf0] dark:bg-slate-800 max-w-4xl w-full aspect-[1.414/1] rounded-sm shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative p-8 md:p-16 flex flex-col border-[16px] border-[#d4af37] dark:border-purple-900/50 outline outline-1 outline-offset-[-10px] outline-[#d4af37] dark:outline-purple-800/30">
              
              {/* Decorative Corner Elements */}
              <div className="absolute top-0 left-0 w-32 h-32 opacity-10 pointer-events-none">
                 <svg viewBox="0 0 100 100" className="w-full h-full fill-[#d4af37]"><path d="M0 0 L100 0 L0 100 Z" /></svg>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 rotate-90 opacity-10 pointer-events-none">
                 <svg viewBox="0 0 100 100" className="w-full h-full fill-[#d4af37]"><path d="M0 0 L100 0 L0 100 Z" /></svg>
              </div>
              
              {/* Certificate Content */}
              <div className="flex-1 flex flex-col items-center justify-between text-center border-2 border-[#d4af37]/20 p-6 md:p-12 relative overflow-hidden">
                 
                 {/* Background Seal Pattern */}
                 <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
                    <Logo className="w-[60%] h-[60%] grayscale" />
                 </div>

                 <div className="space-y-4">
                    <Logo className="w-20 h-20 mx-auto" />
                    <h2 className="text-3xl md:text-5xl font-funky text-[#1e1b4b] dark:text-white tracking-tighter">Birla Vishvakarma Mahavidyalaya</h2>
                    <p className="text-[10px] md:text-xs font-black text-[#d4af37] uppercase tracking-[0.4em]">An Autonomous Institution</p>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-2xl md:text-4xl font-serif italic text-slate-800 dark:text-slate-200">Certificate of Achievement</h3>
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
                    <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                       This is to formally certify that the student associated with the profile pulse of
                    </p>
                    <p className="text-3xl md:text-5xl font-black text-indigo-900 dark:text-white uppercase tracking-tight font-funky">
                       Radhika Sharma
                    </p>
                    <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 font-medium">
                       has successfully completed and demonstrated outstanding proficiency in
                    </p>
                    <p className="text-2xl md:text-3xl font-black text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                       {viewingCertificate.event.title}
                    </p>
                 </div>

                 <div className="w-full flex justify-between items-end mt-12 px-10">
                    <div className="text-center">
                       <div className="w-40 h-px bg-slate-400 mb-2"></div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{viewingCertificate.authority}</p>
                       <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">Issuing Authority</p>
                    </div>

                    <div className="relative">
                       <div className="w-20 h-20 bg-[#d4af37] rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800 rotate-12">
                          <Logo className="w-10 h-10 brightness-0 invert" />
                       </div>
                       <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                          <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em]">{viewingCertificate.date}</p>
                       </div>
                    </div>

                    <div className="text-center">
                       <div className="w-40 h-px bg-slate-400 mb-2"></div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic font-serif">Dr. Indrajit Patel</p>
                       <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">Principal, BVM</p>
                    </div>
                 </div>

                 <div className="absolute bottom-4 left-0 right-0 text-[8px] font-bold text-slate-300 uppercase tracking-[0.5em] text-center">
                    ID: {viewingCertificate.certId} • VERIFIED BY UNIPLUS BLOCKCHAIN PULSE
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-8 right-[-80px] flex flex-col gap-4">
                 <button 
                   onClick={() => setViewingCertificate(null)}
                   className="p-4 bg-white dark:bg-slate-900 text-slate-400 hover:text-red-600 rounded-full transition-all shadow-2xl border border-slate-100 dark:border-slate-700 hover:scale-110"
                   title="Close Gallery"
                 >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
                 <button 
                   onClick={() => handleDownload(viewingCertificate.certId)}
                   className="p-4 bg-purple-600 text-white rounded-full transition-all shadow-2xl hover:bg-purple-700 hover:scale-110"
                   title="Print / Save"
                 >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default History;
