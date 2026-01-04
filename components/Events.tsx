
import React, { useState } from 'react';
import { EVENTS } from '../constants';
import { CampusEventCategory, CampusEvent, User, Notification } from '../types';

interface EventsProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onAddNotification: (notif: Omit<Notification, 'id' | 'read' | 'time'>) => void;
}

const Events: React.FC<EventsProps> = ({ user, onUpdateUser, onAddNotification }) => {
  const [filter, setFilter] = useState<CampusEventCategory | 'All'>('All');
  const [registeringFor, setRegisteringFor] = useState<CampusEvent | null>(null);

  const filteredEvents = filter === 'All' 
    ? EVENTS 
    : EVENTS.filter(e => e.category === filter);

  const categories: (CampusEventCategory | 'All')[] = ['All', 'Technical', 'Cultural', 'Academic', 'Club', 'Sports'];

  const isRegistered = (eventId: string) => {
    return user.registeredEventIds?.includes(eventId);
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeringFor) return;

    const updatedUser = {
      ...user,
      registeredEventIds: [...(user.registeredEventIds || []), registeringFor.id]
    };
    onUpdateUser(updatedUser);
    localStorage.setItem('uniplus_user', JSON.stringify(updatedUser));
    alert(`Successfully registered for ${registeringFor.title}! Your digital ticket is ready in History.`);
    setRegisteringFor(null);
  };

  const handleSetReminder = (event: CampusEvent) => {
    onAddNotification({
      title: `Reminder: ${event.title}`,
      message: `Your registered event "${event.title}" is coming up on ${event.date} at ${event.time} in ${event.venue}. Don't miss out!`,
      type: 'reminder'
    });
    alert(`Reminder pulse set for "${event.title}"! Check your Dashboard bulletins.`);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Campus Pulse</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Discover and register for upcoming activities at BVM.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all ${
                filter === cat 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:border-purple-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white dark:bg-slate-800 rounded-[3rem_1rem_3rem_1rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-xl hover:shadow-2xl transition-all flex flex-col group funky-shadow">
            <div className="relative h-60">
              <img src={event.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/95 backdrop-blur rounded-2xl shadow-xl">
                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{event.category}</span>
              </div>
              {isRegistered(event.id) && (
                <div className="absolute top-6 right-6 px-4 py-1.5 bg-green-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                  Attending
                </div>
              )}
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-purple-600 transition-colors tracking-tight">{event.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8 line-clamp-2">{event.description}</p>
              
              <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">{event.venue}</span>
                </div>
                
                <div className="flex gap-2">
                  {isRegistered(event.id) && (
                    <button 
                      onClick={() => handleSetReminder(event)}
                      className="p-3 bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-300 rounded-2xl hover:bg-fuchsia-600 hover:text-white transition-all shadow-sm"
                      title="Set Pulse Reminder"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </button>
                  )}
                  <button 
                    disabled={isRegistered(event.id)}
                    onClick={() => setRegisteringFor(event)}
                    className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${
                      isRegistered(event.id) 
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xl hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isRegistered(event.id) ? 'Confirmed' : 'Secure Spot'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {registeringFor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[100]">
          <div className="bg-white dark:bg-slate-800 max-w-2xl w-full p-10 card-shape shadow-[0_30px_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 border-4 border-purple-200 dark:border-purple-800 overflow-y-auto max-h-[90vh]">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">Event Registration</h2>
            <p className="text-sm font-black text-purple-600 mb-8 tracking-widest">{registeringFor.title} • {registeringFor.venue}</p>
            
            <form onSubmit={handleRegistrationSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Full Name</label>
                  <input defaultValue={user.name} required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:border-purple-500 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">ID Number</label>
                  <input defaultValue={user.studentId} required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:border-purple-500 dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Interest/Skill Level</label>
                  <select className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:border-purple-500 dark:text-white">
                    <option>Beginner (Learning Phase)</option>
                    <option>Intermediate (Experienced)</option>
                    <option>Expert (Pro Active)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Phone Pulse</label>
                  <input defaultValue={user.phone} required type="tel" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:border-purple-500 dark:text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Why are you joining this mission?</label>
                <textarea 
                  required 
                  rows={3}
                  placeholder="Describe your expectation or goal for this event..."
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-700 rounded-3xl outline-none focus:border-purple-500 dark:text-white"
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-4 bg-purple-600 text-white font-black rounded-3xl uppercase text-[10px] tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all">Join the Hub</button>
                <button 
                  type="button" 
                  onClick={() => setRegisteringFor(null)} 
                  className="px-10 py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-black rounded-3xl uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
