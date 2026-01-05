
import React, { useState } from 'react';
import { BorrowedBook, User } from '../types';
import { MOCK_BORROWED_BOOKS } from '../constants';

interface LibraryProps {
  user: User;
}

const Library: React.FC<LibraryProps> = ({ user }) => {
  const [books, setBooks] = useState<BorrowedBook[]>(MOCK_BORROWED_BOOKS);

  const handleRenew = (id: string) => {
    setBooks(prev => prev.map(book => {
      if (book.id === id) {
        // Mocking a renewal by adding 14 days and changing status
        const currentDueDate = new Date(book.dueDate);
        currentDueDate.setDate(currentDueDate.getDate() + 14);
        return {
          ...book,
          status: 'Renewed',
          dueDate: currentDueDate.toISOString().split('T')[0]
        };
      }
      return book;
    }));
    alert("Pulse Extension Success! Your library record has been synchronized.");
  };

  const overdueCount = books.filter(b => b.status === 'Overdue').length;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Library Vault</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-3 italic">Manage your borrowed academic and research pulses.</p>
        </div>
        
        <div className="flex gap-4">
           <div className={`px-6 py-3 rounded-2xl shadow-xl border-2 flex items-center gap-3 transition-colors ${overdueCount > 0 ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-900/30' : 'bg-white dark:bg-slate-800 border-purple-50 dark:border-purple-900/30'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${overdueCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-purple-500'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${overdueCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {overdueCount > 0 ? `${overdueCount} Overdue Pulse` : 'All Clear'}
              </span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {books.map(book => (
          <div key={book.id} className={`bg-white dark:bg-slate-800 rounded-[3.5rem_1rem_3.5rem_1rem] overflow-hidden border-2 transition-all group funky-shadow flex flex-col ${book.status === 'Overdue' ? 'border-red-500 shadow-red-100 dark:shadow-none' : 'border-slate-50 dark:border-slate-700 hover:border-purple-500'}`}>
            <div className="relative h-48 overflow-hidden">
              <img src={book.coverImage} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute top-6 left-6 px-3 py-1 bg-white/90 dark:bg-slate-800/90 rounded-full text-[8px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
                {book.category}
              </div>
              {book.status === 'Overdue' && (
                <div className="absolute top-6 right-6 px-3 py-1 bg-red-600 text-white rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse shadow-lg">
                  Critical Pulse
                </div>
              )}
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight mb-1 group-hover:text-purple-600 transition-colors">
                {book.title}
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{book.author}</p>
              
              <div className="space-y-3 mb-8">
                 <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    <span>Borrowed On</span>
                    <span className="text-slate-800 dark:text-slate-200">{book.borrowDate}</span>
                 </div>
                 <div className={`flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] p-3 rounded-xl ${book.status === 'Overdue' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'}`}>
                    <span>Return Pulse</span>
                    <span>{book.dueDate}</span>
                 </div>
              </div>

              <div className="mt-auto flex gap-4">
                 <button 
                  disabled={book.status === 'Renewed'}
                  onClick={() => handleRenew(book.id)}
                  className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] shadow-lg transition-all ${book.status === 'Renewed' ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.02] active:scale-95'}`}
                 >
                   {book.status === 'Renewed' ? 'Renewal Locked' : 'Renew Pulse'}
                 </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Mock Search/Catalog entry */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[3.5rem_1rem_3.5rem_1rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-10 text-center group cursor-pointer hover:border-fuchsia-400 transition-all">
           <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 text-slate-300 dark:text-slate-700 group-hover:text-fuchsia-500 transition-colors shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
           </div>
           <h3 className="text-xl font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter">New Pulse?</h3>
           <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Explore Campus Catalog</p>
        </div>
      </div>
    </div>
  );
};

export default Library;
