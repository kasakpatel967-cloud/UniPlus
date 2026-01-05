
import React, { useState, useRef } from 'react';
import { StudyGroup, SharedNote } from '../types';

interface GroupStudyProps {
  groups: StudyGroup[];
  setGroups: React.Dispatch<React.SetStateAction<StudyGroup[]>>;
  activeGroupId: string | null;
  setActiveGroupId: (id: string | null) => void;
}

const GroupStudy: React.FC<GroupStudyProps> = ({ groups, setGroups, activeGroupId, setActiveGroupId }) => {
  const [joiningGroup, setJoiningGroup] = useState<StudyGroup | null>(null);
  const [sharingType, setSharingType] = useState<'pdf' | 'image' | 'video' | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [viewingNote, setViewingNote] = useState<SharedNote | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeGroup = groups.find(g => g.id === activeGroupId) || null;

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joiningGroup) return;
    
    const updatedGroups = groups.map(g => 
      g.id === joiningGroup.id ? { ...g, members: g.members + 1 } : g
    );
    setGroups(updatedGroups);
    setActiveGroupId(joiningGroup.id);
    setJoiningGroup(null);
  };

  const handleCreateGroupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('groupName') as HTMLInputElement).value;
    const subject = (form.elements.namedItem('groupSubject') as HTMLInputElement).value;
    const isPrivate = (form.elements.namedItem('groupPrivate') as HTMLInputElement).checked;

    const newGroup: StudyGroup = {
      id: 'g' + Date.now(),
      name,
      subject,
      members: 1,
      isPrivate,
      notes: []
    };

    setGroups(prev => [...prev, newGroup]);
    setActiveGroupId(newGroup.id);
    setIsCreatingGroup(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleShareSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeGroupId || !sharingType) return;
    const form = e.currentTarget;
    const titleInput = (form.elements.namedItem('noteTitle') as HTMLInputElement);
    const title = titleInput.value;
    
    const newNote: SharedNote = {
      id: 'n' + Date.now(),
      title,
      type: sharingType,
      sender: 'You',
      timestamp: 'Just now',
      size: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      url: selectedFile ? URL.createObjectURL(selectedFile) : undefined
    };
    
    const updatedGroups = groups.map(g => {
      if (g.id === activeGroupId) {
        return { ...g, notes: [newNote, ...(g.notes || [])] };
      }
      return g;
    });
    setGroups(updatedGroups);
    
    setSharingType(null);
    setSelectedFile(null);
    alert(`${sharingType === 'pdf' ? 'Handout' : sharingType === 'image' ? 'Snapshot' : 'Media'} Shared! The hub vault is updated.`);
  };

  const handleDownloadNote = (note: SharedNote) => {
    if (note.url) {
      const link = document.createElement('a');
      link.href = note.url;
      link.download = note.title;
      link.click();
    } else {
      alert(`Accessing ${note.title}... Syncing with your device via BVM Pulse.`);
    }
  };

  const leaveSession = () => {
    if (confirm("End this study session? All shared resources remain in this Hub's vault.")) {
      setActiveGroupId(null);
    }
  };

  if (activeGroup) {
    return (
      <div className="space-y-8 animate-in slide-in-from-left-6 duration-500">
         <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <button onClick={() => setActiveGroupId(null)} className="w-14 h-14 flex items-center justify-center bg-white dark:bg-slate-800 rounded-3xl shadow-xl border-2 border-purple-50 dark:border-purple-900/30 text-purple-600 hover:scale-110 transition-all group">
                 <svg className="w-7 h-7 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div>
                 <div className="flex items-center gap-4">
                   <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{activeGroup.name}</h1>
                   <span className="px-3 py-1 bg-green-500 text-white text-[9px] font-black uppercase rounded-xl animate-pulse shadow-lg">Session Live</span>
                 </div>
                 <div className="flex items-center gap-4 mt-2">
                   <span className="text-[11px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">{activeGroup.subject} Hub</span>
                   <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                   <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{activeGroup.members} Peers Connected</span>
                 </div>
              </div>
            </div>
            <button onClick={leaveSession} className="px-8 py-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-[2rem_1rem_2rem_1rem] hover:bg-red-600 hover:text-white transition-all border-2 border-red-100 dark:border-red-900/30 shadow-xl">End My Session</button>
         </header>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
               <section className="bg-white dark:bg-slate-800 p-10 card-shape border-2 border-purple-50 dark:border-purple-900/30 shadow-2xl min-h-[600px] funky-shadow relative flex flex-col">
                  <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-50 dark:border-slate-700">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Vault Feed</h3>
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-400"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                       <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  <div className="space-y-6 flex-1">
                    {(activeGroup.notes || []).length > 0 ? (
                      activeGroup.notes?.map(note => (
                        <div key={note.id} className="p-6 bg-slate-50/70 dark:bg-slate-900/70 rounded-[2rem_1rem_2rem_1rem] flex items-center gap-8 border-2 border-transparent hover:border-purple-400 hover:bg-white dark:hover:bg-slate-800 transition-all animate-in fade-in slide-in-from-top-4 group">
                          <div onClick={() => note.type === 'image' && setViewingNote(note)} className={`w-16 h-16 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xl cursor-pointer hover:scale-110 transition-transform ${
                            note.type === 'pdf' ? 'bg-red-500 text-white' : 
                            note.type === 'video' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'
                          }`}>
                            {note.type === 'pdf' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth={2.5}/></svg>}
                            {note.type === 'video' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth={2.5}/></svg>}
                            {note.type === 'image' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2.5}/></svg>}
                          </div>
                          <div className="flex-1">
                            <p className="text-lg font-black text-slate-800 dark:text-white line-clamp-1 group-hover:text-purple-600 transition-colors">{note.title}</p>
                            <div className="flex items-center gap-3 mt-2">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shared by {note.sender}</p>
                               <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{note.timestamp}</p>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                             <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{note.size}</p>
                             <div className="flex gap-2">
                               {note.type === 'image' && (
                                  <button onClick={() => setViewingNote(note)} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Inspect</button>
                               )}
                               <button onClick={() => handleDownloadNote(note)} className="px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all flex items-center gap-2">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
                                  Sync
                               </button>
                             </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-40 text-slate-400 dark:text-slate-600 opacity-30">
                         <div className="w-32 h-32 mb-8 bg-slate-100 dark:bg-slate-900 rounded-[3rem] flex items-center justify-center">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={1} /></svg>
                         </div>
                         <p className="text-sm font-black uppercase tracking-[0.3em]">No resources shared yet</p>
                      </div>
                    )}
                  </div>
               </section>
            </div>

            <div className="space-y-10">
               <section className="bg-white dark:bg-slate-800 p-10 card-shape border-2 border-purple-50 dark:border-purple-900/30 shadow-2xl funky-shadow">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 text-center">Collaborative Tools</h3>
                  <div className="grid gap-6">
                     {[
                       { type: 'pdf', label: 'PDF Handout', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', color: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-500 hover:text-white' },
                       { type: 'image', label: 'Board Snapshot', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-500 hover:text-white' },
                       { type: 'video', label: 'Lecture Clip', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-600 hover:text-white' }
                     ].map(opt => (
                        <button key={opt.type} onClick={() => setSharingType(opt.type as any)} className={`flex items-center gap-6 p-6 ${opt.color} rounded-[2rem_1rem_2rem_1rem] shadow-sm transition-all group/opt border-2 border-transparent`}>
                           <div className="w-14 h-14 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl shadow-xl group-hover/opt:scale-110 transition-transform">
                             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d={opt.icon} strokeWidth={2.5} /></svg>
                           </div>
                           <span className="text-[11px] font-black uppercase tracking-[0.2em]">{opt.label}</span>
                        </button>
                     ))}
                  </div>
               </section>
            </div>
         </div>

         {/* Note Viewer Modal */}
         {viewingNote && (
            <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6 z-[200] animate-in fade-in duration-300">
               <div className="bg-white dark:bg-slate-800 max-w-4xl w-full p-8 card-shape shadow-2xl relative border-4 border-purple-500">
                  <button onClick={() => setViewingNote(null)} className="absolute -top-12 right-0 p-3 text-white hover:text-red-400 transition-colors">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                       <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">{viewingNote.title}</h2>
                       <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em] mt-1">Shared by {viewingNote.sender} • {viewingNote.timestamp}</p>
                    </div>
                    <button onClick={() => handleDownloadNote(viewingNote)} className="px-6 py-3 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Download Original</button>
                  </div>
                  <div className="aspect-video w-full bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
                    {viewingNote.url ? (
                       <img src={viewingNote.url} className="w-full h-full object-contain" alt={viewingNote.title} />
                    ) : (
                       <div className="text-center p-10 opacity-30">
                          <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={1} /></svg>
                          <p className="text-sm font-black uppercase tracking-widest">No preview available for this item</p>
                       </div>
                    )}
                  </div>
               </div>
            </div>
         )}
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Campus Hubs</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-2">Connect, share, and solve problems with the BVM community pulse.</p>
         </div>
         <button onClick={() => setIsCreatingGroup(true)} className="px-10 py-5 bg-purple-600 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-[2rem_1rem_2rem_1rem] shadow-2xl hover:bg-purple-700 hover:scale-105 active:scale-95 transition-all funky-shadow">+ Deploy New Hub</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
         {groups.map(group => (
            <div key={group.id} className="bg-white dark:bg-slate-800 p-10 rounded-[3.5rem_1.5rem_3.5rem_1.5rem] border-2 border-slate-50 dark:border-slate-700 shadow-xl hover:border-purple-500 hover:shadow-2xl transition-all funky-shadow group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
               <div className="flex justify-between items-start mb-2 relative">
                 <h3 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter group-hover:text-purple-600 transition-colors leading-tight">{group.name}</h3>
                 {group.isPrivate && (
                    <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl text-slate-400">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    </div>
                 )}
               </div>
               <p className="text-[10px] font-black text-fuchsia-500 uppercase mt-1 mb-8 tracking-[0.3em]">{group.subject}</p>
               <div className="flex items-center gap-6 mb-10">
                  <div className="flex -space-x-4">
                     {[1,2,3,4].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${group.id}${i}`} className="w-12 h-12 rounded-[1rem] border-4 border-white dark:border-slate-800 object-cover shadow-lg" />)}
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{group.members}+ Members</span>
                    <span className="block text-[8px] font-bold text-green-500 uppercase tracking-widest mt-1">Active Now</span>
                  </div>
               </div>
               <button onClick={() => setJoiningGroup(group)} className="w-full py-5 bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent text-slate-700 dark:text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-[2rem_1rem_2rem_1rem] group-hover:bg-purple-600 group-hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95">Connect Pulse</button>
            </div>
         ))}
      </div>

      {isCreatingGroup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[100]">
          <div className="bg-white dark:bg-slate-800 max-w-xl w-full p-12 card-shape shadow-[0_40px_100px_rgba(168,85,247,0.3)] animate-in zoom-in-95 duration-300 border-4 border-fuchsia-500 dark:border-fuchsia-800 overflow-y-auto max-h-[90vh]">
            <h2 className="text-4xl font-black mb-10 dark:text-white uppercase tracking-tighter">Deploy New Hub</h2>
            <form onSubmit={handleCreateGroupSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Hub Identity (Title)</label>
                <input name="groupName" required placeholder="e.g. EC-Lab Wizards" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none dark:text-white focus:border-purple-500 transition-all font-black" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Primary Subject</label>
                  <input name="groupSubject" required placeholder="e.g. Analog Circuits" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none dark:text-white focus:border-purple-500 transition-all font-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Meeting Cadence</label>
                  <select className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none dark:text-white focus:border-purple-500 font-bold">
                    <option>Daily Pulse</option>
                    <option>Weekly Sync</option>
                    <option>Exam Marathon Only</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Mission Brief (Description)</label>
                <textarea rows={3} placeholder="What is the goal of this hub? How can others help?" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none dark:text-white focus:border-purple-500 transition-all font-medium" />
              </div>
              <div className="flex items-center gap-4 p-6 bg-fuchsia-50 dark:bg-fuchsia-900/10 rounded-3xl border border-fuchsia-100 dark:border-fuchsia-900/30">
                <input type="checkbox" name="groupPrivate" id="groupPrivate" className="w-6 h-6 rounded text-purple-600 focus:ring-purple-500" />
                <label htmlFor="groupPrivate" className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest cursor-pointer select-none">Restrict Access (Admin Invitation Required)</label>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="submit" className="flex-1 py-5 bg-fuchsia-600 text-white font-black rounded-3xl uppercase text-[11px] tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all">Launch Hub</button>
                <button type="button" onClick={() => setIsCreatingGroup(false)} className="px-10 py-5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-black rounded-3xl uppercase text-[11px] tracking-widest hover:bg-slate-200">Abort</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {sharingType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[150]">
           <div className="bg-white dark:bg-slate-800 max-w-lg w-full p-12 card-shape shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-6 mb-10">
                 <div className={`w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl ${
                    sharingType === 'pdf' ? 'bg-red-500 text-white' : 
                    sharingType === 'video' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'
                 }`}>
                    {sharingType === 'pdf' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth={2.5}/></svg>}
                    {sharingType === 'video' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth={2.5}/></svg>}
                    {sharingType === 'image' && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth={2.5}/></svg>}
                 </div>
                 <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Share {sharingType === 'pdf' ? 'Handout' : sharingType === 'image' ? 'Snapshot' : 'Media'}</h2>
              </div>
              <form onSubmit={handleShareSubmit} className="space-y-8">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Resource Title</label>
                   <input name="noteTitle" required placeholder={`Name this ${sharingType === 'pdf' ? 'handout' : 'snapshot'}...`} className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none dark:text-white focus:border-purple-500 transition-all font-black" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Pulse Source (File Selection)</label>
                   <div className="relative">
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="filePulse" accept={sharingType === 'pdf' ? '.pdf' : sharingType === 'image' ? 'image/*' : 'video/*'} />
                      <label htmlFor="filePulse" className="w-full px-8 py-5 bg-purple-50 dark:bg-slate-900/50 border-2 border-dashed border-purple-200 dark:border-purple-900/50 rounded-3xl flex items-center justify-between cursor-pointer group hover:bg-purple-100 transition-all">
                         <span className="text-[11px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">{selectedFile ? selectedFile.name : `Select ${sharingType === 'pdf' ? 'Handout PDF' : sharingType === 'image' ? 'Board Image' : 'File'}`}</span>
                         <svg className="w-6 h-6 text-purple-600 group-hover:bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth={3} /></svg>
                      </label>
                   </div>
                 </div>
                 <div className="flex gap-4 pt-6">
                    <button type="submit" className="flex-1 py-5 bg-purple-600 text-white font-black rounded-3xl uppercase text-[11px] tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all">Broadcast Vault Item</button>
                    <button type="button" onClick={() => { setSharingType(null); setSelectedFile(null); }} className="px-10 py-5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-black rounded-3xl uppercase text-[11px] tracking-widest hover:bg-slate-200">Abort</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default GroupStudy;
