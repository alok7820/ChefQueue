import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Clock, Flame, ClipboardList } from 'lucide-react';
import Card from '../../components/ui/Card';
import { aiService } from '../../services/aiService';
import { AI_SUGGESTED_PROMPTS } from '../../data/mockData';

const EXAMPLE_CARDS = [
  { icon: Clock, title: 'Estimated prep time', desc: 'Ask how long a table or item will take right now' },
  { icon: Flame, title: 'Kitchen workload', desc: 'Check how busy each station is at a glance' },
  { icon: ClipboardList, title: 'Cooking priority', desc: 'Find out which tickets to fire next' },
  { icon: Sparkles, title: "Today's summary", desc: 'Get a quick recap of orders and revenue' },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your kitchen assistant. Ask me about prep times, workload, or today's order summary." },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  const send = async (text) => {
    const content = text ?? input;
    if (!content.trim()) return;
    setMessages((m) => [...m, { role: 'user', text: content }]);
    setInput('');
    setThinking(true);
    const { reply } = await aiService.ask(content);
    setThinking(false);
    setMessages((m) => [...m, { role: 'assistant', text: reply }]);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8.5rem)] max-w-3xl flex-col">
      <div className="mb-4">
        <h1 className="flex items-center gap-2 font-display text-xl font-bold text-secondary-900">
          <Sparkles className="text-primary-500" size={20} /> AI Assistant
        </h1>
        <p className="mt-1 text-sm text-secondary-500">Frontend-only demo — responses are generated locally, no backend connected.</p>
      </div>

      {messages.length === 1 && (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {EXAMPLE_CARDS.map((c) => (
            <Card key={c.title} hover className="cursor-pointer" padded>
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <c.icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-secondary-800">{c.title}</p>
                  <p className="text-xs text-secondary-500">{c.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="flex flex-1 flex-col overflow-hidden" padded={false}>
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === 'user' ? 'bg-primary-500 text-white' : 'bg-secondary-100 text-secondary-800'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl bg-secondary-100 px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary-400" style={{ animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-secondary-100 p-3">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {AI_SUGGESTED_PROMPTS.map((p) => (
              <button key={p} onClick={() => send(p)} className="rounded-full border border-secondary-200 px-3 py-1 text-xs text-secondary-600 hover:border-primary-300 hover:text-primary-600">
                {p}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about prep time, workload, priority..."
              className="flex-1 rounded-xl border border-secondary-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
            <button type="submit" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white hover:bg-primary-600">
              <Send size={16} />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}


