import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

// ─────────────────────────────────────────────────────────────────────────────
// API key: edit src/config.js to set your OpenRouter key (one file, all AI features)
// ─────────────────────────────────────────────────────────────────────────────
import { OPENROUTER_API_KEY, AI_MODEL, AI_URL, getAIErrorMessage } from '../config'

const SUGGESTED_QUESTIONS = [
  'What should I eat today to hit my protein goal?',
  'Is my chest sore from overtraining?',
  'Build me a meal plan for tomorrow',
  'How much water should I drink on gym days?',
  'What are the best exercises for building arms?',
  'Should I eat before or after my morning workout?',
  'How long should I rest between sets?',
  'What supplements actually work?',
]

function buildSystemPrompt(user) {
  const split = user?.customSplit
    ? user.customSplit.map(d => `${d.day}: ${d.focus}`).join(', ')
    : 'Standard 7-day split'

  return `You are FitForge AI Coach — a friendly, expert personal trainer and nutritionist with 30 years of experience. You know this user personally from their profile.

USER PROFILE:
- Name: ${user?.name || 'the user'}
- Goal: ${user?.goal || 'Not set'}
- Experience: ${user?.level || 'Not specified'}
- Current weight: ${user?.weight ? user.weight + 'kg' : 'Not provided'}
- Target weight: ${user?.targetWeight ? user.targetWeight + 'kg' : 'Not set'}
- Height: ${user?.height ? user.height + 'cm' : 'Not provided'}
- Diet preference: ${user?.diet || 'No preference'}
- Training days: ${user?.daysPerWeek || '5 days/week'}
- Workout split: ${split}
- Member since: ${user?.startDate || 'Recently joined'}
- Workouts logged: ${user?.workoutLog?.length || 0}

YOUR PERSONALITY AND STYLE:
- Talk like a knowledgeable friend, not a textbook
- Be direct and specific — give exact numbers, foods, and exercises
- Use the user's name occasionally to make it personal
- Keep responses concise — 3-5 sentences max unless they ask for a full plan
- Be encouraging but honest — don't sugarcoat if they're doing something wrong
- Reference their profile data naturally (their goal, weight, split)
- For Indian users: suggest Indian foods (dal, paneer, roti, dahi) as default options
- Never recommend dangerous practices — always safe, evidence-based advice

WHAT YOU KNOW:
- Nutrition: macros, meal timing, calorie targets, Indian and international foods
- Training: exercise form, progressive overload, recovery, muscle groups
- Supplements: creatine, whey, vitamins — what works and what doesn't
- Injury prevention and recovery
- Sleep, hydration, and lifestyle factors

Respond in plain text without markdown formatting. No bullet points unless the user explicitly asks for a list.`
}

function ChatBubble({ message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 ${
        isUser ? 'bg-brown-500 text-cream' : 'bg-brown-800 text-cream'
      }`}>
        {isUser ? '👤' : '🤖'}
      </div>
      {/* Bubble */}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-brown-500 text-cream rounded-tr-sm'
          : 'bg-cream border border-brown-200 text-brown-800 rounded-tl-sm'
      }`}>
        {message.content}
        {message.streaming && (
          <span className="inline-block w-2 h-4 bg-brown-400 ml-1 animate-pulse rounded-sm align-middle" />
        )}
      </div>
    </div>
  )
}

export default function Coach() {
  const { user, updateUser }    = useAuth()
  const [messages, setMessages] = useState(() => {
    // Load persisted chat (capped at 50)
    try {
      const saved = user?.chatHistory
      return saved?.length ? saved : []
    } catch { return [] }
  })
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const bottomRef             = useRef(null)
  const inputRef              = useRef(null)

  const keyNotSet = !OPENROUTER_API_KEY || OPENROUTER_API_KEY.startsWith('PASTE_')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const saveHistory = (msgs) => {
    const capped = msgs.slice(-50) // keep last 50 messages
    updateUser({ chatHistory: capped })
  }

  const sendMessage = async (text) => {
    const userText = (text || input).trim()
    if (!userText || loading) return
    if (keyNotSet) { setError('Add your OpenRouter API key in src/config.js to use the AI Coach.'); return }

    setError('')
    setInput('')

    const userMsg  = { role: 'user', content: userText }
    const newMsgs  = [...messages, userMsg]
    setMessages(newMsgs)
    setLoading(true)

    // Add empty AI message to stream into
    const aiMsgId  = Date.now()
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true, id: aiMsgId }])

    try {
      const response = await fetch(AI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://fitforge.app',
          'X-Title': 'FitForge',
        },
        body: JSON.stringify({
          model: AI_MODEL,
          max_tokens: 600,
          temperature: 0.8,
          messages: [
            { role: 'system', content: buildSystemPrompt(user) },
            ...newMsgs.map(m => ({ role: m.role, content: m.content })),
          ],
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(getAIErrorMessage(response.status, err?.error?.message))
      }

      const data    = await response.json()
      const aiText  = data?.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again."

      // Simulate streaming by revealing text progressively
      const words = aiText.split(' ')
      let built   = ''
      for (let i = 0; i < words.length; i++) {
        built += (i > 0 ? ' ' : '') + words[i]
        const snapshot = built
        setMessages(prev => prev.map(m =>
          m.id === aiMsgId ? { ...m, content: snapshot, streaming: i < words.length - 1 } : m
        ))
        if (i < words.length - 1) await new Promise(r => setTimeout(r, 18))
      }

      // Finalise and save
      const finalMsgs = [...newMsgs, { role: 'assistant', content: aiText }]
      setMessages(finalMsgs)
      saveHistory(finalMsgs)

    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== aiMsgId))
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const clearChat = () => {
    setMessages([])
    updateUser({ chatHistory: [] })
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const isFirstVisit = messages.length === 0

  return (
    <main className="pt-16 h-screen flex flex-col bg-brown-100">

      {/* ── Header ── */}
      <div className="bg-brown-800 text-cream px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brown-600 rounded-full flex items-center justify-center text-xl">🤖</div>
          <div>
            <div className="font-display font-semibold text-base">FitForge AI Coach</div>
            <div className="text-xs text-brown-300">
              {keyNotSet ? 'API key needed' : `Powered by OpenRouter - knows your profile`}
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="text-xs text-brown-400 hover:text-brown-200 transition-colors">
            Clear chat
          </button>
        )}
      </div>

      {/* ── API key banner ── */}
      {keyNotSet && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex-shrink-0">
          <p className="text-xs text-amber-800 font-medium">Setup: Open <code className="bg-amber-100 px-1 rounded">src/config.js</code> and paste your OpenRouter API key.</p>
        </div>
      )}

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4">

        {/* Welcome / first visit */}
        {isFirstVisit && (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">🤖</div>
            <h2 className="font-display text-xl font-bold text-brown-900 mb-1">
              Hey {user?.name?.split(' ')[0] || 'there'}!
            </h2>
            <p className="text-sm text-brown-500 mb-6 max-w-xs mx-auto">
              I'm your personal AI coach. I know your goal ({user?.goal || 'not set yet'}), 
              your split, and your stats. Ask me anything.
            </p>

            {/* Suggested questions */}
            <div className="flex flex-col gap-2 max-w-sm mx-auto">
              <p className="text-xs text-brown-400 uppercase tracking-wider mb-1">Try asking:</p>
              {SUGGESTED_QUESTIONS.slice(0, 4).map(q => (
                <button key={q} onClick={() => sendMessage(q)} disabled={keyNotSet}
                  className="text-left text-sm bg-cream border border-brown-200 rounded-xl px-4 py-2.5 text-brown-700 hover:border-brown-400 hover:bg-brown-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg, i) => (
          <ChatBubble key={msg.id || i} message={msg} />
        ))}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* ── Suggested quick questions (after first message) ── */}
      {messages.length > 0 && !loading && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0">
          {SUGGESTED_QUESTIONS.slice(4).map(q => (
            <button key={q} onClick={() => sendMessage(q)} disabled={keyNotSet}
              className="flex-shrink-0 text-xs bg-cream border border-brown-200 rounded-full px-3 py-1.5 text-brown-600 hover:border-brown-400 transition-all disabled:opacity-40">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="bg-cream border-t border-brown-200 px-4 sm:px-6 py-3 flex-shrink-0">
        <div className="flex gap-3 items-end max-w-3xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={keyNotSet ? 'Add API key to start chatting...' : 'Ask your coach anything...'}
            disabled={loading || keyNotSet}
            rows={1}
            className="flex-1 px-4 py-3 rounded-2xl border border-brown-200 bg-brown-50 text-brown-800 placeholder-brown-300 text-sm focus:outline-none focus:border-brown-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ maxHeight: '120px', overflowY: 'auto' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading || keyNotSet}
            className="w-11 h-11 bg-brown-500 hover:bg-brown-600 disabled:opacity-40 disabled:cursor-not-allowed text-cream rounded-full flex items-center justify-center text-lg transition-all active:scale-95 flex-shrink-0"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
            ) : '↑'}
          </button>
        </div>
        <p className="text-xs text-brown-300 text-center mt-1.5">
          Press Enter to send - Shift+Enter for new line
        </p>
      </div>
    </main>
  )
}
