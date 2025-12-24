import { useState, useEffect } from 'react';
import { Send, Brain, History, Loader2 } from 'lucide-react';
import { supabase, Doubt } from './lib/supabase';
import { VoiceInput } from './components/VoiceInput';
import { DoubtCard } from './components/DoubtCard';

function App() {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentDoubt, setCurrentDoubt] = useState<Doubt | null>(null);

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    const { data, error } = await supabase
      .from('doubts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching doubts:', error);
    } else {
      setDoubts(data || []);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setQuestion(transcript);
  };

  const solveDoubt = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setCurrentDoubt(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/solve-doubt`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          subject: subject || 'General',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get solution');
      }

      const result = await response.json();

      const { data: newDoubt, error } = await supabase
        .from('doubts')
        .insert({
          question,
          subject: subject || 'General',
          explanation: result.explanation,
          example: result.example,
          input_method: question !== '' ? 'text' : 'voice',
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving doubt:', error);
      } else {
        setCurrentDoubt(newDoubt);
        setDoubts([newDoubt, ...doubts]);
      }

      setQuestion('');
      setSubject('');
    } catch (error) {
      console.error('Error solving doubt:', error);
      alert('Failed to solve doubt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      solveDoubt();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">AI Doubt Solver</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Ask any question via voice or text, get simple explanations with examples
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject (optional)
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Math, Physics, Programming, History..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your doubt here or use voice input..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <VoiceInput onTranscript={handleVoiceTranscript} isDisabled={loading} />

              <button
                onClick={solveDoubt}
                disabled={loading || !question.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Solving...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Solve Doubt
                  </>
                )}
              </button>

              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                <History className="w-5 h-5" />
                {showHistory ? 'Hide' : 'Show'} History
              </button>
            </div>
          </div>
        </div>

        {currentDoubt && !showHistory && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Solution</h2>
            <DoubtCard doubt={currentDoubt} />
          </div>
        )}

        {showHistory && doubts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Doubts</h2>
            <div className="space-y-6">
              {doubts.map((doubt) => (
                <DoubtCard key={doubt.id} doubt={doubt} />
              ))}
            </div>
          </div>
        )}

        {showHistory && doubts.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No doubts solved yet. Ask your first question!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
