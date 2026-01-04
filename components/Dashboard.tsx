
import React, { useState } from 'react';
import { User, Notification, AttendanceRecord } from '../types';
import { EVENTS, DEPARTMENTS, QUOTES, ASSIGNMENTS } from '../constants';

interface DashboardProps {
  user: User;
  onNavigate: (view: any) => void;
  notifications: Notification[];
  onMarkRead?: (id: string) => void;
  onClearAll?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, notifications, onMarkRead, onClearAll }) => {
  const [selectedNote, setSelectedNote] = useState<Notification | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number | null>(null);
  const [showGaps, setShowGaps] = useState(false);
  const [quoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  
  const quote = QUOTES[quoteIdx];
  const deptSlots = DEPARTMENTS.find(d => d.name === user.department)?.slots || DEPARTMENTS[0].slots;
  const todayClasses = deptSlots.slice(0, 2);
  const registeredCount = user.registeredEventIds?.length || 0;

  // Real or Fallback Attendance
  const attendance = user.attendance || {
    academic: {
      attended: 32,
      total: 40,
      subjects: [
        { name: 'Data Structures', attended: 12, total: 15, missedDates: ['May 12', 'May 14', 'June 01'] },
        { name: 'Cloud Computing', attended: 10, total: 12, missedDates: ['May 10', 'May 20'] },
        { name: 'OS Concepts', attended: 10, total: 13, missedDates: ['May 15', 'May 22', 'June 02'] }
      ]
    },
    events: {
      attended: registeredCount > 0 ? registeredCount - 1 : 0,
      total: registeredCount,
      missedEventTitles: registeredCount > 0 ? ['Cultural Fest: Udaan (Planned)'] : []
    }
  };

  const academicPercent = Math.round((attendance.academic.attended / attendance.academic.total) * 100);
  const eventPercent = attendance.events.total > 0 
    ? Math.round((attendance.events.attended / attendance.events.total) * 100) 
    : 100;

  const unreadCount = notifications.filter(n => !n.read).length;

  const currentMonth = "June 2025";
  const daysInMonth = 30;
  
  const getEventsForDay = (day: number) => {
    return EVENTS.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getMonth() === 5 && eventDate.getDate() === day;
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className="z-10">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Sup, <span className="text-purple-600 font-funky italic">{user.name.split(' ')[0]}</span>!
          </h1>
          <div className="mt-4 flex items-center gap-3">
             <div className="px-4 py-1.5 bg-fuchsia-500 text-white text-[10px] font-black uppercase rounded-full shadow-lg">BVM Hub</div>
             <p className="text-sm font-bold text-slate-500 dark:text-slate-300 italic">Welcome to your central campus mission control.</p>
          </div>
        </div>
        
        <div className="hidden lg:block">
           <div className="px-6 py-4 bg-white dark:bg-slate-800 rounded-3xl border-2 border-purple-100 dark:border-purple-900/30 shadow-xl funky-shadow flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center text-purple-600">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Academic Season</p>
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase">Even Sem 2024-25</p>
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-white dark:bg-slate-800 p-8 card-shape border-2 border-purple-50 dark:border-purple-900/30 shadow-2xl funky-shadow">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                 <div className="w-2 h-8 bg-purple-600 rounded-full"></div>
                 Presence Pulse
               </h2>
               <button 
                 onClick={() => setShowGaps(true)}
                 className="px-4 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-black uppercase rounded-lg border border-red-100 dark:border-red-800 hover:bg-red-600 hover:text-white transition-all"
               >
                 Review Missed Items
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl flex items-center gap-6 border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800 transition-all group">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                    <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray={2 * Math.PI * 34}
                      strokeDashoffset={2 * Math.PI * 34 * (1 - academicPercent / 100)}
                      className="text-purple-600 transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-black text-slate-900 dark:text-white text-sm">
                    {academicPercent}%
                  </div>
                </div>
                <div>
                   <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Academic Logs</p>
                   <h3 className="text-xl font-black text-slate-800 dark:text-white">{attendance.academic.attended} <span className="text-slate-400">/ {attendance.academic.total}</span></h3>
                   <span className={`text-[9px] font-bold uppercase ${academicPercent < 75 ? 'text-red-500' : 'text-green-500'}`}>
                     {academicPercent < 75 ? 'Critical (Below 75%)' : 'Healthy Engagement'}
                   </span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl flex items-center gap-6 border-2 border-transparent hover:border-fuchsia-200 dark:hover:border-fuchsia-800 transition-all group">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                    <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray={2 * Math.PI * 34}
                      strokeDashoffset={2 * Math.PI * 34 * (1 - eventPercent / 100)}
                      className="text-fuchsia-500 transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-black text-slate-900 dark:text-white text-sm">
                    {eventPercent}%
                  </div>
                </div>
                <div>
                   <p className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest mb-1">Event Tracker</p>
                   <h3 className="text-xl font-black text-slate-800 dark:text-white">{attendance.events.attended} <span className="text-slate-400">/ {attendance.events.total}</span></h3>
                   <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 italic">Verified via QR pulse</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Registered', value: registeredCount.toString().padStart(2, '0'), color: 'bg-purple-600 text-white', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', view: 'Events' },
              { label: 'Classes', value: '04', color: 'bg-white dark:bg-slate-800 border-2 border-purple-100 dark:border-purple-900/30 text-purple-900 dark:text-purple-100', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', view: 'Timetable' },
              { label: 'Tasks', value: ASSIGNMENTS.length.toString().padStart(2, '0'), color: 'bg-fuchsia-500 text-white', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2', view: 'Assignments' },
              { label: 'Grants', value: '02', color: 'bg-white dark:bg-slate-800 border-2 border-fuchsia-100 text-fuchsia-900 dark:text-fuchsia-100', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2', view: 'Scholarships' },
            ].map((stat, i) => (
              <button key={i} onClick={() => onNavigate(stat.view)} className={`p-6 card-shape shadow-lg hover:shadow-2xl transition-all group relative text-left ${stat.color} funky-shadow`}>
                <div className="absolute top-4 right-4 opacity-20 group-hover:scale-150 transition-transform"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg></div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{stat.label}</p>
                <p className="text-4xl font-funky mt-3 tracking-tighter">{stat.value}</p>
              </button>
            ))}
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">On Deck Today</h2>
            <div className="grid gap-6">
              {todayClasses.map((slot, idx) => (
                <div key={slot.id} onClick={() => onNavigate('Timetable')} className={`glass dark:bg-slate-800/50 p-8 card-shape flex items-center gap-8 group hover:border-purple-500 transition-all cursor-pointer shadow-xl ${idx % 2 === 0 ? '' : 'md:translate-x-4'}`}>
                  <div className="text-center min-w-[100px] p-3 bg-purple-600 text-white rounded-3xl shadow-lg group-hover:bg-fuchsia-500 transition-colors">
                    <p className="text-2xl font-funky">{slot.startTime}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{slot.day}</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-purple-600 transition-colors">{slot.subject}</h3>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{slot.faculty} • {slot.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section className="bg-white dark:bg-slate-800 p-8 card-shape border-2 border-purple-50 dark:border-purple-900/30 shadow-2xl relative overflow-visible funky-shadow">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Campus Calendar</h2>
                <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase">{currentMonth}</span>
             </div>
             <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayEvents = getEventsForDay(day);
                  const hasEvent = dayEvents.length > 0;
                  const isSelected = selectedCalendarDate === day;
                  
                  return (
                    <div 
                      key={i} 
                      onClick={() => setSelectedCalendarDate(isSelected ? null : day)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[11px] font-black transition-all cursor-pointer relative group ${
                        isSelected 
                        ? 'ring-4 ring-purple-600/30 bg-purple-600 text-white z-20' 
                        : hasEvent 
                        ? 'bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-200 shadow-md border border-fuchsia-200 dark:border-fuchsia-800 hover:scale-110' 
                        : 'bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {day}
                      {hasEvent && !isSelected && <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse"></div>}
                    </div>
                  );
                })}
             </div>
          </section>

          <section className="bg-white dark:bg-slate-800 p-8 card-shape border-2 border-purple-50 dark:border-purple-900/30 shadow-2xl relative overflow-hidden funky-shadow">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Bulletins</h2>
              {unreadCount > 0 && (
                <button 
                  onClick={onClearAll}
                  className="text-[9px] font-black uppercase text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Mark All Read
                </button>
              )}
            </div>
            <div className="space-y-8">
              {notifications.length > 0 ? (
                notifications.slice(0, 4).map((note, i) => (
                  <div key={note.id} className={`relative pl-10 transition-all hover:translate-x-2 ${i !== notifications.length-1 ? 'pb-8 border-l-2 border-purple-100 dark:border-purple-900/30' : ''}`}>
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-slate-800 ${note.read ? 'bg-slate-300' : (note.type === 'urgent' ? 'bg-fuchsia-500' : 'bg-purple-400')}`} />
                    <p className={`text-sm font-black ${note.read ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-white'}`}>{note.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{note.message}</p>
                    {!note.read && (
                      <button 
                        onClick={() => { setSelectedNote(note); onMarkRead?.(note.id); }} 
                        className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 hover:underline mt-2"
                      >
                        Inspect Pulse
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-10 text-center opacity-30 italic font-bold text-slate-500 text-sm">Bulletins clear. No new pulses.</div>
              )}
            </div>
            <button onClick={() => onNavigate('History')} className="w-full mt-10 py-4 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-[10px] font-black uppercase rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-sm">View Vault History</button>
          </section>
        </div>
      </div>

      {/* Attendance Gaps Modal */}
      {showGaps && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[120] animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-800 max-w-2xl w-full p-10 card-shape shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-4 border-red-200 dark:border-red-900/40 relative">
              <button 
                onClick={() => setShowGaps(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2 flex items-center gap-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Attendance Gaps
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Detailed log of missed academic and event pulses.</p>

              <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                {/* Academic Gaps */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em] border-b border-purple-100 dark:border-purple-900/30 pb-2">Academic Misses</h3>
                  <div className="grid gap-3">
                    {attendance.academic.subjects.map((sub, i) => (
                      <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl flex justify-between items-center group hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                        <div>
                          <p className="font-black text-slate-800 dark:text-white text-sm">{sub.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Gaps: {sub.missedDates?.join(', ') || 'None recorded'}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-black ${sub.attended / sub.total < 0.75 ? 'text-red-500' : 'text-slate-500'}`}>
                            {Math.round((sub.attended / sub.total) * 100)}%
                          </p>
                          <p className="text-[8px] font-black text-slate-400 uppercase">Ratio</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Event Gaps */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-fuchsia-600 uppercase tracking-[0.3em] border-b border-fuchsia-100 dark:border-fuchsia-900/30 pb-2">Event Absences</h3>
                  <div className="grid gap-3">
                    {attendance.events.missedEventTitles.length > 0 ? (
                      attendance.events.missedEventTitles.map((title, i) => (
                        <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-l-4 border-fuchsia-500">
                          <p className="font-black text-slate-800 dark:text-white text-sm">{title}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Status: Registered but missed pulse-in</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center bg-green-50 dark:bg-green-900/20 rounded-2xl">
                         <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Zero event misses detected.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <button 
                  onClick={() => setShowGaps(false)}
                  className="w-full py-4 bg-slate-900 dark:bg-red-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Acknowledge & Close
                </button>
              </div>
           </div>
        </div>
      )}

      {selectedNote && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[150]">
          <div className="bg-white dark:bg-slate-800 max-w-lg w-full p-10 card-shape shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-purple-200 dark:border-purple-800">
            <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white uppercase tracking-tighter">{selectedNote.title}</h2>
            <p className="text-xs text-fuchsia-500 font-black mb-8 tracking-widest">{selectedNote.time}</p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-10">{selectedNote.message}</p>
            <button onClick={() => setSelectedNote(null)} className="w-full py-4 bg-purple-600 text-white font-black rounded-3xl uppercase text-[10px] tracking-[0.3em] shadow-xl">Dismiss Bulletin</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
