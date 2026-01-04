
import React, { useState } from 'react';
import { DEPARTMENTS } from '../constants';
import { TimetableSlot } from '../types';

const Timetable: React.FC = () => {
  const [selectedDeptId, setSelectedDeptId] = useState(DEPARTMENTS[0].id);
  const currentDept = DEPARTMENTS.find(d => d.id === selectedDeptId)!;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  const getSlotForTimeAndDay = (time: string, day: string) => {
    // Normalizes time string to match slot start times
    const hour = time.split(':')[0];
    return currentDept.slots.find(s => s.day === day && s.startTime.startsWith(hour));
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Campus Planner</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Department of {currentDept.name}</p>
        </div>
        
        <div className="flex flex-wrap bg-white dark:bg-slate-800 p-2 rounded-3xl border border-purple-100 dark:border-purple-900/30 shadow-2xl self-start gap-2 funky-shadow">
          {DEPARTMENTS.map(dept => (
            <button
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedDeptId === dept.id 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                : 'text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30'
              }`}
            >
              {dept.id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-[3rem_1rem_3rem_1rem] border-4 border-purple-50 dark:border-purple-900/30 bg-white dark:bg-slate-800 shadow-[0_30px_60px_rgba(0,0,0,0.1)] funky-shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-purple-50/50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-900/30">
              <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] w-24">Time</th>
              {days.map(day => (
                <th key={day} className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] min-w-[180px]">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => (
              <tr key={time} className="border-b border-slate-50 dark:border-slate-700/30 group hover:bg-purple-50/20 dark:hover:bg-purple-900/10 transition-colors">
                <td className="p-6 align-top">
                  <span className="text-xs font-black text-slate-400 group-hover:text-purple-600 transition-colors">{time}</span>
                </td>
                {days.map(day => {
                  const slot = getSlotForTimeAndDay(time, day);
                  return (
                    <td key={`${day}-${time}`} className="p-3 align-top">
                      {slot ? (
                        <div className="bg-white dark:bg-slate-900 border-2 border-purple-100 dark:border-purple-800 p-5 rounded-3xl shadow-md group-hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden group/card">
                          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/card:scale-150 transition-transform">
                             <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth={2} /></svg>
                          </div>
                          <p className="text-sm font-black text-slate-800 dark:text-white leading-tight mb-2">{slot.subject}</p>
                          <p className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest">{slot.faculty}</p>
                          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-50 dark:border-slate-800">
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                              <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              {slot.room}
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                              <svg className="w-3.5 h-3.5 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              90m
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-24 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800 group-hover:border-purple-200 dark:group-hover:border-purple-900 transition-colors"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;
