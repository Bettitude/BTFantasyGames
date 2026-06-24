import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const ROOMS = [
  { id: 'global',  label: 'Global' },
  { id: 'wc2026',  label: 'WC 2026' },
  { id: 'general', label: 'General' },
];

export default function Chat() {
  const { user } = useAuth();
  const [room, setRoom]       = useState('global');
  const [messages, setMessages] = useState([]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Load history
  useEffect(() => {
    setLoading(true);
    setMessages([]);
    api.get(`/chat?room=${room}&limit=50`)
      .then(data => setMessages(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [room]);

  // Supabase Realtime subscription for new messages
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${room}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room=eq.${room}` },
        payload => {
          setMessages(prev => {
            // Avoid duplicates if our own optimistic update already added it
            if (prev.find(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [room]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput('');

    // Optimistic insert
    const optimistic = {
      id: `opt-${Date.now()}`,
      user_id: user.id,
      username: user.email?.split('@')[0] ?? 'you',
      room,
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      await api.post('/chat', { content: text, room });
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
    } finally {
      setSending(false);
    }
  }

  // Group messages by date
  const grouped = messages.reduce((acc, msg) => {
    const key = formatDate(msg.created_at);
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {});

  const myUsername = user?.email?.split('@')[0] ?? '';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className="w-6 h-6 text-[#0057B8]"/>
        <h1 className="text-2xl font-black" style={{ color: '#F5F7FA' }}>Chat Room</h1>
      </div>

      {/* Room tabs */}
      <div className="flex gap-2 mb-4">
        {ROOMS.map(r => (
          <button key={r.id} onClick={() => setRoom(r.id)}
            className="px-4 py-1.5 rounded-xl text-sm font-bold transition-colors"
            style={room === r.id
              ? { background: '#0057B8', color: '#fff' }
              : { background: 'rgba(255,255,255,0.03)', color: '#B0B8C8', border: '1px solid #2A3654' }}>
            {r.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto card p-4 space-y-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-[#0057B8]"/>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#4A5568]">
            <MessageSquare className="w-10 h-10 mb-2 opacity-30"/>
            <p className="text-sm">No messages yet. Be the first to say something!</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, msgs]) => (
            <div key={date}>
              <div className="flex items-center gap-2 my-3">
                <div className="flex-1 h-px" style={{ background: '#1E2A40' }}/>
                <span className="text-[10px] text-[#4A5568] font-bold uppercase tracking-widest">{date}</span>
                <div className="flex-1 h-px" style={{ background: '#1E2A40' }}/>
              </div>
              {msgs.map(msg => {
                const isMe = msg.user_id === user?.id;
                return (
                  <div key={msg.id}
                    className={`flex items-end gap-2 mb-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-white shrink-0"
                      style={{ background: isMe ? '#0057B8' : '#1E2A40' }}>
                      {(msg.username?.[0] ?? '?').toUpperCase()}
                    </div>
                    <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      {!isMe && (
                        <span className="text-[10px] text-[#4A5568] mb-0.5 ml-1">{msg.username}</span>
                      )}
                      <div className="px-3 py-2 rounded-2xl text-sm leading-snug break-words"
                        style={isMe
                          ? { background: '#0057B8', color: '#fff', borderBottomRightRadius: 4 }
                          : { background: '#1E2A40', color: '#F5F7FA', borderBottomLeftRadius: 4 }}>
                        {msg.content}
                      </div>
                      <span className="text-[9px] text-[#4A5568] mt-0.5 mx-1">{formatTime(msg.created_at)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 mt-3">
        <input
          className="input flex-1 py-2.5"
          placeholder={user ? 'Type a message…' : 'Sign in to chat'}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={!user || sending}
          maxLength={500}
        />
        <button type="submit" disabled={!input.trim() || !user || sending}
          className="px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-opacity disabled:opacity-40"
          style={{ background: '#0057B8', color: '#fff' }}>
          {sending ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4"/>}
        </button>
      </form>
    </div>
  );
}
