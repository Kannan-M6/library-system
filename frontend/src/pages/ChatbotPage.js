import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { MessageSquare, Send, Bot, User, Sparkles, BookOpen, IndianRupee, Clock } from 'lucide-react';
import { MOCK_BOOKS, MOCK_TRANSACTIONS, getBookById, getStudentById } from '../data/mockData';

const QUICK_PROMPTS = [
  { icon: BookOpen,    label:'Available AI/ML books',     query:'Show me available AI and Machine Learning books' },
  { icon: Clock,       label:'My overdue books',           query:'What books are overdue right now?' },
  { icon: IndianRupee, label:'Fine information',           query:'How is the fine calculated?' },
  { icon: Sparkles,    label:'Recommend a book',           query:'Recommend a book for a Data Science student' },
];

function buildBotReply(msg) {
  const m = msg.toLowerCase();

  if (m.includes('available') && (m.includes('ai') || m.includes('ml') || m.includes('machine'))) {
    const books = MOCK_BOOKS.filter(b => b.category === 'AI & ML' && b.availableCopies > 0);
    return `Found **${books.length} AI & ML books** currently available:\n\n` +
      books.map(b => `📚 **${b.title}** by ${b.author} — Shelf ${b.shelf} (${b.availableCopies} free)`).join('\n');
  }

  if (m.includes('overdue')) {
    const od = MOCK_TRANSACTIONS.filter(t => !t.returned && new Date(t.dueDate) < new Date());
    if (od.length === 0) return '✅ Great news — no books are currently overdue!';
    return `⚠️ **${od.length} overdue book(s)** in the system:\n\n` +
      od.map(t => {
        const b = getBookById(t.bookId);
        const s = getStudentById(t.studentId);
        const d = Math.floor((new Date() - new Date(t.dueDate)) / 86400000);
        return `📕 ${b?.title} — borrowed by ${s?.name} (${s?.rollNo}) · **${d} days overdue · ₹${d*5} fine**`;
      }).join('\n');
  }

  if (m.includes('fine') || m.includes('penalty')) {
    return `💰 **Fine Policy:**\n\nFine rate: **₹5 per day** after the due date.\nDefault borrow window: **14 days**.\n\nFines are calculated automatically. Please return books on time to avoid charges!`;
  }

  if (m.includes('recommend') || m.includes('suggestion')) {
    const picks = MOCK_BOOKS.filter(b => b.availableCopies > 0).sort(() => Math.random() - 0.5).slice(0, 3);
    return `✨ **Recommended books for you:**\n\n` +
      picks.map(b => `📖 **${b.title}** by ${b.author}\n   → Category: ${b.category} · Shelf: ${b.shelf}`).join('\n\n');
  }

  if (m.includes('hello') || m.includes('hi') || m.includes('hey')) {
    return `Hello! 👋 I'm **LibrarIQ Assistant**. I can help you with:\n\n• Finding available books\n• Checking overdue status\n• Fine calculations\n• Book recommendations\n\nWhat would you like to know?`;
  }

  if (m.includes('borrow') || m.includes('issue')) {
    return `📋 **How to Borrow a Book:**\n\n1. Find the book in the **Books Catalog**\n2. Note the shelf location (e.g. A-01)\n3. Visit the library counter\n4. Librarian scans the barcode — or uses **Manual Entry** if scanner is down\n5. Return within **14 days** to avoid fines`;
  }

  if (m.includes('total') && m.includes('book')) {
    const total = MOCK_BOOKS.reduce((s,b) => s+b.totalCopies, 0);
    const avail = MOCK_BOOKS.reduce((s,b) => s+b.availableCopies, 0);
    return `📚 **Library Statistics:**\n\n• Total titles: **${MOCK_BOOKS.length}**\n• Total copies: **${total}**\n• Available now: **${avail}**\n• Currently borrowed: **${total - avail}**`;
  }

  return `I'm not sure about that specific query. Try asking me about:\n\n• "Show available Python books"\n• "What are the overdue books?"\n• "How is the fine calculated?"\n• "Recommend a book for AI students"`;
}

function ChatBubble({ msg }) {
  const isBot = msg.role === 'bot';
  const lines = msg.text.split('\n');

  return (
    <div style={{
      display:'flex', gap:'0.75rem', alignItems:'flex-start',
      flexDirection: isBot ? 'row' : 'row-reverse',
      marginBottom:'1.25rem', animation:'fadeIn .3s ease-out',
    }}>
      <div style={{
        width:34, height:34, borderRadius:'50%', flexShrink:0,
        background: isBot
          ? 'linear-gradient(135deg,#c084fc,#818cf8)'
          : 'linear-gradient(135deg,#86efac,#7dd3fc)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        {isBot ? <Bot size={16} color="#fff"/> : <User size={16} color="#042f2e"/>}
      </div>
      <div style={{
        maxWidth:'72%', padding:'0.85rem 1.1rem', borderRadius: isBot ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
        background: isBot ? 'rgba(192,132,252,.12)' : 'rgba(134,239,172,.10)',
        border: `1px solid ${isBot ? 'rgba(192,132,252,.25)' : 'rgba(134,239,172,.25)'}`,
        fontSize:'0.875rem', color:'#e2e8f0', lineHeight:1.65,
      }}>
        {lines.map((line, i) => {
          // Bold markdown
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={i} style={{ margin: i < lines.length - 1 ? '0 0 0.35rem' : 0 }}>
              {parts.map((part, j) => j % 2 === 1 ? <strong key={j} style={{ color:'#f1f5f9' }}>{part}</strong> : part)}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { id:1, role:'bot', text:'Hello! 👋 I\'m **LibrarIQ Assistant**. Ask me anything about books, availability, fines, or borrowing.\n\nOr pick a quick prompt below to get started!' },
  ]);
  const [input,  setInput]  = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, typing]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role:'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    await new Promise(r => setTimeout(r, 700 + Math.random() * 500));

    const reply = buildBotReply(text);
    setTyping(false);
    setMessages(prev => [...prev, { id: Date.now() + 1, role:'bot', text: reply }]);
  };

  return (
    <Layout>
      <div style={{ marginBottom:'1.5rem' }}>
        <p className="section-eyebrow">AI Assistant</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', color:'#f1f5f9' }}>
          Library Chatbot
        </h1>
        <p style={{ color:'#64748b', fontSize:'0.875rem', marginTop:'0.25rem' }}>
          Ask about books, availability, fines, recommendations…
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', gap:'1.5rem', height:'calc(100vh - 220px)', minHeight:450 }}>
        {/* Chat window */}
        <div className="card" style={{
          padding:0, display:'flex', flexDirection:'column', overflow:'hidden',
        }}>
          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'1.5rem' }}>
            {messages.map(m => <ChatBubble key={m.id} msg={m}/>)}
            {typing && (
              <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
                <div style={{
                  width:34, height:34, borderRadius:'50%',
                  background:'linear-gradient(135deg,#c084fc,#818cf8)',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>
                  <Bot size={16} color="#fff"/>
                </div>
                <div style={{
                  padding:'0.75rem 1rem', borderRadius:'4px 14px 14px 14px',
                  background:'rgba(192,132,252,.12)', border:'1px solid rgba(192,132,252,.25)',
                  display:'flex', gap:'5px', alignItems:'center',
                }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width:7, height:7, borderRadius:'50%', background:'#c084fc',
                      animation:`bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{
            padding:'1rem 1.5rem',
            borderTop:'1px solid rgba(196,181,253,.12)',
            display:'flex', gap:'0.75rem',
          }}>
            <input
              className="input-field"
              placeholder="Ask something…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              disabled={typing}
            />
            <button
              className="btn-primary"
              style={{ padding:'0.6rem 1rem', flexShrink:0 }}
              onClick={() => sendMessage(input)}
              disabled={typing || !input.trim()}
            >
              <Send size={16}/>
            </button>
          </div>
        </div>

        {/* Quick prompts */}
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', color:'#f1f5f9' }}>
            Quick Prompts
          </h2>
          {QUICK_PROMPTS.map(p => {
            const Icon = p.icon;
            return (
              <button key={p.label} onClick={() => sendMessage(p.query)}
                className="card"
                style={{
                  padding:'0.9rem 1rem', textAlign:'left', cursor:'pointer',
                  display:'flex', alignItems:'center', gap:'0.75rem',
                  border:'1px solid rgba(196,181,253,.15)', background:'none',
                  width:'100%',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(192,132,252,.45)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='rgba(196,181,253,.15)'}
              >
                <Icon size={16} color="#c084fc"/>
                <span style={{ fontSize:'0.85rem', color:'#94a3b8' }}>{p.label}</span>
              </button>
            );
          })}

          <div style={{
            marginTop:'1rem', padding:'1rem', borderRadius:12,
            background:'rgba(192,132,252,.08)', border:'1px solid rgba(192,132,252,.18)',
          }}>
            <Sparkles size={16} color="#c084fc" style={{ marginBottom:'0.5rem' }}/>
            <p style={{ fontSize:'0.78rem', color:'#64748b', lineHeight:1.5 }}>
              Try: <em style={{ color:'#94a3b8' }}>"Show me books on computer networks"</em> or <em style={{ color:'#94a3b8' }}>"How do I borrow a book?"</em>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%,60%,100%{ transform:translateY(0); }
          30%         { transform:translateY(-6px); }
        }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </Layout>
  );
}