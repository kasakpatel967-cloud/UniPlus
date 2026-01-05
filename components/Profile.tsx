
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<User>(user);
  const [hasProKey, setHasProKey] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  }, []);

  const handleConnectKey = async () => {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasProKey(true);
    }
  };

  const handleSave = () => {
    onUpdate(formData);
    setEditing(false);
  };

  const handlePhotoClick = () => {
    if (editing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
         <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Your Profile</h1>
         <button 
           onClick={() => editing ? handleSave() : setEditing(true)}
           className={`px-6 py-3 font-black text-[10px] uppercase rounded-xl transition-all ${
             editing ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-white dark:bg-slate-800 border-2 border-purple-50 dark:border-purple-900/30 text-slate-800 dark:text-white shadow-sm'
           }`}
         >
           {editing ? 'Save Profile' : 'Edit Pulse'}
         </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-8 card-shape border-2 border-purple-50 dark:border-purple-900/30 shadow-xl flex flex-col items-center funky-shadow">
               <div 
                 onClick={handlePhotoClick}
                 className={`relative group w-40 h-40 rounded-full overflow-hidden border-4 border-purple-100 dark:border-purple-900/30 mb-6 shadow-xl ${editing ? 'cursor-pointer' : ''}`}
               >
                  <img src={formData.photo || `https://ui-avatars.com/api/?name=${formData.name}&background=A855F7&color=fff&size=512`} className="w-full h-full object-cover" />
                  {editing && (
                    <div className="absolute inset-0 bg-purple-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">New Lens</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
               </div>
               <h2 className="text-xl font-black dark:text-white text-center">
                  {editing ? (
                    <input 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full text-center bg-purple-50 dark:bg-purple-900/20 border-b-2 border-purple-200 dark:border-purple-700 outline-none focus:border-purple-500 rounded px-2"
                    />
                  ) : formData.name}
               </h2>
               <p className="text-xs font-bold text-fuchsia-500 uppercase mt-2 tracking-widest">{formData.studentId}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 card-shape border-2 border-fuchsia-50 dark:border-fuchsia-900/30 shadow-xl funky-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
               <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full ${hasProKey ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">AI Tier: {hasProKey ? 'Pro' : 'Standard'}</h3>
               </div>
               <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                 {hasProKey 
                   ? "Premium features enabled. High-quality image generation is active." 
                   : "Standard intelligence active. Connect a paid key to unlock advanced Visual Brain features."}
               </p>
               <button 
                onClick={handleConnectKey}
                className="w-full py-4 bg-fuchsia-50 dark:bg-fuchsia-900/30 text-[10px] font-black uppercase text-fuchsia-600 dark:text-fuchsia-400 rounded-2xl hover:bg-fuchsia-600 hover:text-white transition-all shadow-inner border border-fuchsia-100 dark:border-fuchsia-900/30"
               >
                 {hasProKey ? 'Manage AI Key' : 'Connect Paid Key'}
               </button>
               {!hasProKey && (
                 <a 
                   href="https://ai.google.dev/gemini-api/docs/billing" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="block text-[8px] text-center font-black text-slate-400 uppercase tracking-widest mt-4 hover:text-fuchsia-500 transition-colors"
                 >
                   Setup Paid Project ↗
                 </a>
               )}
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 card-shape border-2 border-green-50 dark:border-green-900/30 shadow-xl funky-shadow">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Session Pulse</h3>
               <div className="flex items-center gap-3 py-3 border-b border-slate-50 dark:border-slate-700">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">Encrypted Connection</span>
               </div>
               <div className="flex items-center gap-3 py-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">Rotated JWT Active</span>
               </div>
            </div>
         </div>

         <div className="md:col-span-2 bg-white dark:bg-slate-800 p-8 card-shape border-2 border-purple-50 dark:border-purple-900/30 shadow-xl space-y-8 funky-shadow">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Email Address</label>
                  <input 
                    readOnly={!editing}
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className={`w-full px-6 py-3 rounded-2xl outline-none font-bold dark:text-white transition-all ${
                      editing ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-700' : 'bg-transparent border-2 border-transparent cursor-default'
                    }`}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Phone Number</label>
                  <input 
                    readOnly={!editing}
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className={`w-full px-6 py-3 rounded-2xl outline-none font-bold dark:text-white transition-all ${
                      editing ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-700' : 'bg-transparent border-2 border-transparent cursor-default'
                    }`}
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Department</label>
                  {editing ? (
                    <select 
                      value={formData.department}
                      onChange={e => setFormData({...formData, department: e.target.value as any})}
                      className="w-full px-6 py-3 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-2xl font-bold dark:text-white outline-none focus:border-purple-500"
                    >
                      <option>Computer Science</option>
                      <option>EC</option>
                      <option>EL</option>
                      <option>IT</option>
                      <option>Mech</option>
                    </select>
                  ) : (
                    <div className="w-full px-6 py-3 bg-slate-50 dark:bg-slate-900/40 border-2 border-transparent rounded-2xl font-bold dark:text-white opacity-60">
                      {formData.department}
                    </div>
                  )}
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Year of Study</label>
                  {editing ? (
                    <select 
                      value={formData.year}
                      onChange={e => setFormData({...formData, year: e.target.value})}
                      className="w-full px-6 py-3 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-2xl font-bold dark:text-white outline-none focus:border-purple-500"
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                    </select>
                  ) : (
                    <div className="w-full px-6 py-3 bg-slate-50 dark:bg-slate-900/40 border-2 border-transparent rounded-2xl font-bold dark:text-white opacity-60">
                      {formData.year}
                    </div>
                  )}
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2">Academic Batch</label>
               {editing ? (
                  <input 
                    value={formData.batch}
                    onChange={e => setFormData({...formData, batch: e.target.value})}
                    className="w-full px-6 py-3 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-2xl font-bold dark:text-white outline-none focus:border-purple-500"
                    placeholder="e.g. 2023-27"
                  />
               ) : (
                  <div className="w-full px-6 py-3 bg-slate-50 dark:bg-slate-900/40 border-2 border-transparent rounded-2xl font-bold dark:text-white opacity-60">
                    {formData.batch}
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
