import React, { useState } from 'react';
import { BookOpen, Sparkles, ClipboardList, HelpCircle, Loader2, GraduationCap, CheckCircle2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { generateStudyNotes, StudyNotes } from './services/gemini';
import { cn } from './lib/utils';

export default function App() {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StudyNotes | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!notes.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await generateStudyNotes(notes);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate study notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">LectureAI</h1>
          </div>
          <div className="text-sm font-medium text-slate-500 hidden sm:block">
            AI-Powered Study Assistant
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-8">
          {/* Input Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">Lecture Notes</h2>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your lecture notes here..."
              className="w-full min-h-[200px] p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-y text-slate-700 leading-relaxed"
            />
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={loading || !notes.trim()}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all",
                  "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-indigo-200"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Study Notes
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-6"
              >
                {/* Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-indigo-50/50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="markdown-body text-slate-700 leading-relaxed text-lg">
                      <Markdown>{result.summary}</Markdown>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Key Points */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-amber-50/50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-slate-900">Key Points</h3>
                    </div>
                    <div className="p-6 md:p-8">
                      <ul className="space-y-4">
                        {result.keyPoints.map((point, i) => (
                          <li key={i} className="flex gap-4 text-slate-700 group">
                            <div className="flex-shrink-0 mt-1">
                              <CheckCircle2 className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="text-base leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Exam Questions */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-emerald-50/50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-lg font-semibold text-slate-900">Exam Questions</h3>
                    </div>
                    <div className="p-6 md:p-8">
                      <ul className="space-y-4">
                        {result.examQuestions.map((question, i) => (
                          <li key={i} className="flex gap-4 text-slate-700 group">
                            <div className="flex-shrink-0 mt-1">
                              <HelpCircle className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                            </div>
                            <span className="text-base leading-relaxed italic">{question}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} LectureAI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
}
