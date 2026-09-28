import React, { useState, useEffect } from 'react';
import { Terminal, BookOpen, PenTool, CheckSquare, Code, Trash2, Edit3, Plus, X } from 'lucide-react';

const MODULES = [
  { id: 'm1', title: 'Month 1: IT Fundamentals & Linux', days: 22, color: 'bg-[#FF90E8]' },
  { id: 'm2', title: 'Month 2: Frontend & UI Eng.', days: 22, color: 'bg-[#FFC900]' },
  { id: 'm3', title: 'Month 3: Backend & API Dev', days: 22, color: 'bg-[#00E5FF]' },
  { id: 'm4', title: 'Month 4: AI & ML Fundamentals', days: 22, color: 'bg-[#FF4911]' },
  { id: 'm5', title: 'Month 5: Full-Stack AI Integration', days: 22, color: 'bg-[#9D00FF]' },
  { id: 'm6', title: 'Month 6: Capstone & Portfolio', days: 20, color: 'bg-[#00FF00]' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('journal');
  
  // Persisted state
  const [progress, setProgress] = useState(() => JSON.parse(localStorage.getItem('wibi-progress')) || {});
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('wibi-notes')) || []);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', tags: '', content: '', codeSnippet: '' });

  useEffect(() => { localStorage.setItem('wibi-progress', JSON.stringify(progress)); }, [progress]);
  useEffect(() => { localStorage.setItem('wibi-notes', JSON.stringify(notes)); }, [notes]);

  const toggleDay = (dayId) => {
    setProgress(prev => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (editingId) {
      setNotes(notes.map(n => n.id === editingId ? { ...formData, id: n.id, date: n.date } : n));
    } else {
      setNotes([{ ...formData, id: Date.now().toString(), date: new Date().toISOString() }, ...notes]);
    }
    setShowForm(false);
    setFormData({ title: '', tags: '', content: '', codeSnippet: '' });
    setEditingId(null);
  };

  const editNote = (note) => {
    setFormData(note);
    setEditingId(note.id);
    setShowForm(true);
  };

  const deleteNote = (id) => {
    if(confirm('Delete this journal entry?')) setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
      {/* HEADER - NOT AI SLOP, Brutalist Style */}
      <header className="mb-12 neo-border bg-white p-6 md:p-10 neo-shadow">
        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
          WIBI <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-600" style={{WebkitTextStroke: '2px black'}}>BBPOM INTERN</span>
        </h1>
        <p className="text-xl font-bold bg-[#FFC900] inline-block px-3 py-1 border-2 border-black">
          BATCH 2 - 2026 / SOFTWARE & AI FOCUSED
        </p>
      </header>

      {/* NAVIGATION */}
      <nav className="flex flex-wrap gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('journal')}
          className={`flex-1 py-4 px-6 text-xl font-bold uppercase neo-border flex items-center justify-center gap-2 ${activeTab === 'journal' ? 'bg-[#00FF00] neo-shadow' : 'bg-white hover:bg-gray-100'}`}
        >
          <BookOpen size={24}/> Dev Journal
        </button>
        <button 
          onClick={() => setActiveTab('tracker')}
          className={`flex-1 py-4 px-6 text-xl font-bold uppercase neo-border flex items-center justify-center gap-2 ${activeTab === 'tracker' ? 'bg-[#FF90E8] neo-shadow' : 'bg-white hover:bg-gray-100'}`}
        >
          <CheckSquare size={24}/> 130-Day Tracker
        </button>
      </nav>

      {/* CONTENT */}
      <main>
        {activeTab === 'tracker' && (
          <div className="space-y-8">
            {MODULES.map((mod, i) => {
              let startDay = MODULES.slice(0, i).reduce((acc, curr) => acc + curr.days, 0) + 1;
              return (
                <div key={mod.id} className="bg-white neo-border p-6 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full border-4 border-black ${mod.color}`}></div>
                  <h2 className="text-3xl font-black mb-6 border-b-4 border-black pb-2 relative z-10">{mod.title}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 relative z-10">
                    {Array.from({ length: mod.days }).map((_, idx) => {
                      const dayNum = startDay + idx;
                      const dayId = `day-${dayNum}`;
                      const isDone = progress[dayId];
                      return (
                        <button
                          key={dayId}
                          onClick={() => toggleDay(dayId)}
                          className={`p-3 border-2 border-black font-bold text-center transition-colors ${
                            isDone ? 'bg-black text-white' : 'bg-white hover:bg-gray-200'
                          }`}
                        >
                          D{dayNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'journal' && (
          <div>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-4xl font-black">LOGS & NOTES</h2>
              <button 
                onClick={() => { setFormData({ title: '', tags: '', content: '', codeSnippet: '' }); setEditingId(null); setShowForm(true); }}
                className="bg-[#00E5FF] px-6 py-3 font-bold text-lg neo-border neo-shadow flex items-center gap-2"
              >
                <Plus size={24}/> NEW ENTRY
              </button>
            </div>

            {/* Note Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white neo-border w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
                  <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 border-2 border-black p-1 hover:bg-red-500 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                  <h3 className="text-3xl font-black mb-6 uppercase border-b-4 border-black pb-2">
                    {editingId ? 'Edit Entry' : 'New Log Entry'}
                  </h3>
                  
                  <form onSubmit={handleSaveNote} className="space-y-4">
                    <div>
                      <label className="block font-bold mb-2 uppercase">Subject / Title</label>
                      <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border-4 border-black p-3 text-lg focus:outline-none focus:bg-[#FFC900]/10" placeholder="e.g. Setting up Express Server..." />
                    </div>
                    <div>
                      <label className="block font-bold mb-2 uppercase">Tags (comma separated)</label>
                      <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full border-4 border-black p-3 font-mono focus:outline-none focus:bg-[#FFC900]/10" placeholder="react, api, auth" />
                    </div>
                    <div>
                      <label className="block font-bold mb-2 uppercase">Description / Findings</label>
                      <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border-4 border-black p-3 min-h-[150px] focus:outline-none focus:bg-[#FFC900]/10" placeholder="What did you learn today?"></textarea>
                    </div>
                    <div>
                      <label className="block font-bold mb-2 uppercase flex items-center gap-2"><Code size={20}/> Code Snippet</label>
                      <textarea value={formData.codeSnippet} onChange={e => setFormData({...formData, codeSnippet: e.target.value})} className="w-full border-4 border-black p-3 bg-gray-900 text-green-400 font-mono text-sm min-h-[120px] focus:outline-none" placeholder="console.log('Hello BBPOM');"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-[#00FF00] text-xl font-black p-4 neo-border neo-shadow mt-4 uppercase">
                      SAVE LOG ENTRY
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Notes List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notes.length === 0 ? (
                <div className="col-span-full border-4 border-black border-dashed p-12 text-center bg-white opacity-70">
                  <Terminal size={48} className="mx-auto mb-4" />
                  <p className="text-2xl font-bold uppercase">No entries yet.</p>
                  <p className="text-lg">Start logging your tech journey!</p>
                </div>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="bg-white neo-border p-5 flex flex-col hover:-translate-y-1 transition-transform shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-2xl font-black leading-tight uppercase">{note.title}</h4>
                      <div className="flex gap-2">
                        <button onClick={() => editNote(note)} className="border-2 border-black p-1 hover:bg-[#FFC900]"><Edit3 size={18}/></button>
                        <button onClick={() => deleteNote(note.id)} className="border-2 border-black p-1 hover:bg-[#FF4911] text-black"><Trash2 size={18}/></button>
                      </div>
                    </div>
                    <div className="text-xs font-bold font-mono border-2 border-black bg-gray-100 p-1 px-2 w-max mb-3">
                      {new Date(note.date).toLocaleDateString('en-GB')}
                    </div>
                    <p className="mb-4 flex-grow text-lg">{note.content}</p>
                    {note.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {note.tags.split(',').map((t, i) => (
                          <span key={i} className="bg-black text-white text-xs font-bold px-2 py-1 uppercase border border-black">#{t.trim()}</span>
                        ))}
                      </div>
                    )}
                    {note.codeSnippet && (
                      <pre className="bg-gray-900 text-green-400 p-3 overflow-x-auto text-sm border-2 border-black font-mono">
                        <code>{note.codeSnippet}</code>
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}