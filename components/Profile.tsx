
import React, { useState, useRef } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<User>(user);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showPassToggle, setShowPassToggle] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
           {editing ? 'Save Pulse' : 'Edit Pulse'}
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

            <div className="bg-white dark:bg-slate-800 p-8 card-shape border-2 border-purple-50 dark:border-purple-900/30 shadow-xl funky-shadow">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Account Security</h3>
               <button 
                onClick={() => setShowPasswordChange(true)}
                className="w-full py-4 bg-purple-50 dark:bg-purple-900/30 text-[10px] font-black uppercase text-purple-600 dark:text-purple-300 rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-inner"
               >
                 Change Password
               </button>
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

      {showPasswordChange && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 z-[100]">
           <div className="bg-white dark:bg-slate-800 max-w-md w-full p-10 card-shape shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-purple-100 dark:border-purple-900/30 funky-shadow">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tighter">Update Pulse</h2>
              <div className="space-y-5">
                 <div className="relative">
                   <input type={showPassToggle ? "text" : "password"} placeholder="Current Pulse" className="w-full px-6 py-4 bg-purple-50 dark:bg-slate-900/50 rounded-2xl outline-none border-2 border-purple-100 dark:border-purple-900/30 focus:border-purple-500 transition-all dark:text-white" />
                 </div>
                 <div className="relative">
                   <input type={showPassToggle ? "text" : "password"} placeholder="New Pulse" className="w-full px-6 py-4 bg-purple-50 dark:bg-slate-900/50 rounded-2xl outline-none border-2 border-purple-100 dark:border-purple-900/30 focus:border-purple-500 transition-all dark:text-white" />
                   <button 
                    type="button"
                    onClick={() => setShowPassToggle(!showPassToggle)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
                  >
                    {showPassToggle ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                 </div>
                 <input type={showPassToggle ? "text" : "password"} placeholder="Confirm New Pulse" className="w-full px-6 py-4 bg-purple-50 dark:bg-slate-900/50 rounded-2xl outline-none border-2 border-purple-100 dark:border-purple-900/30 focus:border-purple-500 transition-all dark:text-white" />
              </div>
              <div className="flex gap-4 mt-10">
                 <button onClick={() => { alert('Pulse Updated!'); setShowPasswordChange(false); }} className="flex-1 py-4 bg-purple-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-lg shadow-purple-200 transition-all hover:bg-purple-700">Update</button>
                 <button onClick={() => setShowPasswordChange(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-black rounded-2xl uppercase text-[10px] tracking-widest transition-all hover:bg-slate-200">Cancel</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
