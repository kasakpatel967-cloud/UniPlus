
import React, { useState, useRef, useEffect } from 'react';
import { getSmartCampusResponse, generateCampusVisual } from '../services/geminiService';
import { EVENTS, DEPARTMENTS } from '../constants';

// Removed redundant window.aistudio declaration to resolve conflict with existing environment types

const SmartAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'visuals'>('chat');
  const [messages, setMessages] = useState<{ role: 'bot' | 'user', text: string, image?: string }[]>([
    { role: 'bot', text: "Hello! I'm EduBot. I can help you find classes, event details, or summarize the college schedule. What's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasProKey, setHasProKey] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for existing API key selection on component mount using global aistudio
    const checkKey = async () => {
      // @ts-ignore - access globally provided aistudio object
      if (window.aistudio) {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasProKey(hasKey);
      }
    };
    checkKey();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleConnectKey = async () => {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // Assume successful selection per race condition instructions provided in guidelines
      setHasProKey(true); 
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userQuery = input;
    setInput('');
    setIsLoading(true);

    if (activeTab === 'chat') {
      setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
      const context = JSON.stringify({
        upcomingEvents: EVENTS.map(e => ({ title: e.title, date: e.date, venue: e.venue })),
        timetable: DEPARTMENTS[0].slots.map(s => ({ subject: s.subject, time: `${s.startTime}-${s.endTime}`, day: s.day }))
      });
      const response = await getSmartCampusResponse(userQuery, context);
      setMessages(prev => [...prev, { role: 'bot', text: response || "I'm sorry, I couldn't process that." }]);
    } else {
      setMessages(prev => [...prev, { role: 'user', text: `Generate image: ${userQuery}` }]);
      try {
        const imageUrl = await generateCampusVisual(userQuery);
        if (imageUrl) {
          setMessages(prev => [...prev, { role: 'bot', text: "Here is your generated campus visual:", image: imageUrl }]);
        }
      } catch (err: any) {
        if (err.message === "KEY_NOT_FOUND") {
          setHasProKey(false);
          setMessages(prev => [...prev, { role: 'bot', text: "It seems your AI Pro key has expired or is invalid. Please reconnect in the Visuals tab." }]);
        } else {
          setMessages(prev => [...prev, { role: 'bot', text: "I couldn't generate that image right now. Check your prompt or connection." }]);
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h2 className="font-bold text-lg leading-none">EduBot Assistant</h2>
            <p className="text-xs text-white/70 mt-1">Smart Campus Guide • Online</p>
          </div>
        </div>
        <div className="flex bg-white/10 p-1 rounded-xl">
           <button onClick={() => setActiveTab('chat')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'bg-white text-indigo-600 shadow-sm' : 'text-white/70 hover:text-white'}`}>Brain</button>
           <button onClick={() => setActiveTab('visuals')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'visuals' ? 'bg-white text-indigo-600 shadow-sm' : 'text-white/70 hover:text-white'}`}>
             Visuals
             {!hasProKey && <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse"></div>}
           </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/30">
        {activeTab === 'visuals' && !hasProKey ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-6 animate-in fade-in zoom-in-95">
             <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center shadow-2xl border-2 border-fuchsia-100 dark:border-fuchsia-900/30 text-fuchsia-500 mb-2 rotate-3">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
             </div>
             <div>
               <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">AI Pro Visuals Locked</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto font-medium">Connect your paid Gemini API key to unlock high-definition diagramming and campus poster generation.</p>
             </div>
             <div className="space-y-4 w-full max-w-xs">
                <button 
                  onClick={handleConnectKey}
                  className="w-full py-4 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-105 transition-all"
                >
                  Connect Paid Key
                </button>
                <a 
                  href="https://ai.google.dev/gemini-api/docs/billing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-500"
                >
                  Billing Documentation ↗
                </a>
             </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-tl-none'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  {msg.image && (
                    <div className="mt-4 rounded-xl overflow-hidden shadow-lg border-2 border-purple-100 dark:border-purple-900/30">
                      <img src={msg.image} alt="Generated" className="w-full h-auto" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none flex gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {(!activeTab || activeTab === 'chat' || hasProKey) && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={activeTab === 'chat' ? "Ask about events, timetables..." : "Describe a diagram or poster..."}
              className="w-full pl-6 pr-14 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm dark:text-white"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-widest">
            {activeTab === 'chat' ? 'Gemini 3 Flash Brain' : 'Gemini 3 Pro Visual Engine'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartAssistant;
