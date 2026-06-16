import { useEffect, useMemo, useRef, useState } from 'react'
import { FiEdit3, FiMenu, FiMessageSquare, FiPlus, FiSend, FiSidebar, FiTrash2, FiX } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { OPENROUTER_API_KEY, AI_MODEL, AI_URL, getAIErrorMessage } from '../config'

const SUGGESTED_QUESTIONS = [
  'What should I eat today to hit my protein goal?',
  'Build me a meal plan for tomorrow',
  'What are the best exercises for building arms?',
  'Should I eat before or after my morning workout?',
  'How long should I rest between sets?',
  'What supplements actually work?',
]

const makeSession = () => ({
  id: String(Date.now()),
  title: 'New fitness chat',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  messages: [],
})

function buildTitle(text) {
  const clean = text.trim().replace(/\s+/g, ' ')
  if (!clean) return 'New fitness chat'
  return clean.length > 42 ? `${clean.slice(0, 42)}...` : clean
}

function buildSystemPrompt(user) {
  const split = user?.customSplit
    ? user.customSplit.map(d => `${d.day}: ${d.focus}`).join(', ')
    : 'Standard 7-day split'

  return `You are FitForge AI Coach, a friendly expert personal trainer and nutritionist with 30 years of experience. You know this user personally from their profile.

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

STYLE:
- Talk like a knowledgeable gym friend, not a textbook.
- Be direct and specific with exact foods, numbers, sets, reps, and form cues.
- Keep replies concise unless the user asks for a full plan.
- For Indian users, suggest Indian foods like dal, paneer, roti, dahi, eggs, chicken, rice, and sprouts.
- Give safe, evidence-based fitness guidance.`
}

function ChatBubble({ message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-full bg-brown-900 text-cream flex items-center justify-center text-sm font-bold flex-shrink-0">
          AI
        </div>
      )}
      <div className={`max-w-[min(760px,82%)] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
        isUser
          ? 'bg-brown-600 text-cream rounded-tr-md'
          : 'bg-cream border border-brown-200 text-brown-900 rounded-tl-md'
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
  const { user, updateUser } = useAuth()
  const [sessions, setSessions] = useState(() => {
    const saved = user?.aiCoachChats
    if (saved?.length) return saved
    if (user?.chatHistory?.length) {
      return [{
        id: 'legacy-chat',
        title: buildTitle(user.chatHistory.find(m => m.role === 'user')?.content || 'Previous AI coach chat'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: user.chatHistory,
      }]
    }
    return [makeSession()]
  })
  const [activeId, setActiveId] = useState(() => user?.activeCoachChatId || user?.aiCoachChats?.[0]?.id || 'legacy-chat')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const keyNotSet = !OPENROUTER_API_KEY || OPENROUTER_API_KEY.startsWith('PASTE_')
  const activeSession = useMemo(() => sessions.find(s => s.id === activeId) || sessions[0], [sessions, activeId])
  const messages = activeSession?.messages || []

  useEffect(() => {
    if (!sessions.find(s => s.id === activeId) && sessions[0]) setActiveId(sessions[0].id)
  }, [sessions, activeId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, activeId])

  const persistSessions = (nextSessions, nextActiveId = activeId) => {
    const compact = nextSessions
      .map(session => ({ ...session, messages: session.messages.slice(-60) }))
      .slice(0, 20)
    setSessions(compact)
    updateUser({ aiCoachChats: compact, activeCoachChatId: nextActiveId, chatHistory: compact.find(s => s.id === nextActiveId)?.messages || [] })
  }

  const updateActiveSession = (updater) => {
    const nextSessions = sessions.map(session => session.id === activeSession.id ? updater(session) : session)
    persistSessions(nextSessions, activeSession.id)
    return nextSessions.find(session => session.id === activeSession.id)
  }

  const startNewChat = () => {
    const session = makeSession()
    const next = [session, ...sessions]
    setActiveId(session.id)
    setInput('')
    setError('')
    setSidebarOpen(false)
    persistSessions(next, session.id)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const deleteSession = (id) => {
    const next = sessions.filter(session => session.id !== id)
    const fallback = next[0] || makeSession()
    const finalSessions = next.length ? next : [fallback]
    const nextActiveId = id === activeId ? fallback.id : activeId
    setActiveId(nextActiveId)
    persistSessions(finalSessions, nextActiveId)
  }

  const clearActiveChat = () => {
    updateActiveSession(session => ({
      ...session,
      title: 'New fitness chat',
      updatedAt: new Date().toISOString(),
      messages: [],
    }))
  }

  const sendMessage = async (text) => {
    const userText = (text || input).trim()
    if (!userText || loading) return
    if (keyNotSet) {
      setError('Set VITE_OPENROUTER_API_KEY in your local .env and in Vercel Environment Variables.')
      return
    }

    setError('')
    setInput('')
    setSidebarOpen(false)

    const userMsg = { role: 'user', content: userText, id: Date.now() }
    const baseMessages = [...messages, userMsg]
    const placeholderId = Date.now() + 1

    updateActiveSession(session => ({
      ...session,
      title: session.messages.length ? session.title : buildTitle(userText),
      updatedAt: new Date().toISOString(),
      messages: [...baseMessages, { role: 'assistant', content: '', streaming: true, id: placeholderId }],
    }))
    setLoading(true)

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
          max_tokens: 700,
          temperature: 0.75,
          messages: [
            { role: 'system', content: buildSystemPrompt(user) },
            ...baseMessages.map(m => ({ role: m.role, content: m.content })),
          ],
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(getAIErrorMessage(response.status, err?.error?.message))
      }

      const data = await response.json()
      const aiText = data?.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again."
      const words = aiText.split(' ')
      let built = ''

      for (let i = 0; i < words.length; i += 1) {
        built += (i > 0 ? ' ' : '') + words[i]
        const snapshot = built
        setSessions(prev => prev.map(session => session.id === activeSession.id
          ? {
              ...session,
              messages: session.messages.map(message => message.id === placeholderId
                ? { ...message, content: snapshot, streaming: i < words.length - 1 }
                : message
              ),
            }
          : session
        ))
        if (i < words.length - 1) await new Promise(resolve => setTimeout(resolve, 16))
      }

      const finalSessions = sessions.map(session => session.id === activeSession.id
        ? {
            ...session,
            title: session.messages.length ? session.title : buildTitle(userText),
            updatedAt: new Date().toISOString(),
            messages: [...baseMessages, { role: 'assistant', content: aiText, id: placeholderId }],
          }
        : session
      )
      persistSessions(finalSessions, activeSession.id)
    } catch (err) {
      const finalSessions = sessions.map(session => session.id === activeSession.id
        ? { ...session, messages: baseMessages }
        : session
      )
      persistSessions(finalSessions, activeSession.id)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKey = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const sortedSessions = [...sessions].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  return (
    <main className="pt-16 h-screen bg-brown-100 flex overflow-hidden">
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-16 left-0 z-40 w-80 bg-brown-950 text-cream border-r border-brown-700 flex flex-col transition-transform duration-300`}>
        <div className="p-4">
          <button onClick={startNewChat}
            className="w-full bg-cream text-brown-900 hover:bg-brown-50 rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm border border-brown-100">
            <FiPlus /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-xs uppercase tracking-widest text-brown-400 px-2 mb-2">Recent Chats</div>
          <div className="space-y-1.5">
            {sortedSessions.map(session => (
              <button key={session.id} onClick={() => { setActiveId(session.id); setSidebarOpen(false) }}
                className={`w-full group rounded-xl px-3 py-3 text-left transition-colors border ${
                  session.id === activeSession?.id
                    ? 'bg-brown-800 border-brown-700'
                    : 'border-transparent hover:bg-brown-900'
                }`}>
                <div className="flex items-start gap-2">
                  <FiMessageSquare className="mt-0.5 text-brown-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{session.title || 'New fitness chat'}</div>
                    <div className="text-xs text-brown-400 mt-0.5">
                      {session.messages?.length || 0} messages
                    </div>
                  </div>
                  {sessions.length > 1 && (
                    <span onClick={(e) => { e.stopPropagation(); deleteSession(session.id) }}
                      className="opacity-0 group-hover:opacity-100 text-brown-500 hover:text-rose-300 transition-opacity">
                      <FiTrash2 />
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-brown-800 text-xs text-brown-400 leading-relaxed">
          Your coach uses your goal, split, body stats, and history for more useful answers.
        </div>
      </aside>

      {sidebarOpen && (
        <button aria-label="Close chat list" onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 top-16 z-30 bg-brown-950/40 lg:hidden" />
      )}

      <section className="flex-1 min-w-0 flex flex-col">
        <header className="bg-brown-900 text-cream px-4 sm:px-6 py-4 flex items-center justify-between border-b border-brown-800">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-brown-800 flex items-center justify-center">
              <FiMenu />
            </button>
            <div className="w-10 h-10 rounded-xl bg-brown-700 flex items-center justify-center font-bold">AI</div>
            <div className="min-w-0">
              <div className="font-display font-semibold truncate">{activeSession?.title || 'FitForge AI Coach'}</div>
              <div className="text-xs text-brown-300">
                {keyNotSet ? 'API key needed' : 'Powered by OpenRouter - profile-aware'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button onClick={clearActiveChat}
                className="hidden sm:flex items-center gap-1.5 text-xs text-brown-300 hover:text-cream border border-brown-700 rounded-lg px-3 py-2">
                <FiEdit3 /> Clear
              </button>
            )}
            <button onClick={startNewChat}
              className="hidden sm:flex items-center gap-1.5 text-xs bg-brown-700 hover:bg-brown-600 rounded-lg px-3 py-2">
              <FiPlus /> New
            </button>
          </div>
        </header>

        {keyNotSet && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-xs text-amber-800">
            Set <code className="bg-amber-100 px-1 rounded">VITE_OPENROUTER_API_KEY</code> in local .env and Vercel Environment Variables.
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="max-w-5xl mx-auto space-y-5">
            {messages.length === 0 && (
              <div className="min-h-[55vh] flex items-center justify-center">
                <div className="max-w-2xl w-full text-center">
                  <div className="w-16 h-16 bg-brown-900 text-cream rounded-2xl flex items-center justify-center mx-auto mb-5 font-display font-bold text-xl">AI</div>
                  <h1 className="font-display text-3xl sm:text-4xl font-bold text-brown-950">
                    What are we improving today, {user?.name?.split(' ')[0] || 'there'}?
                  </h1>
                  <p className="text-brown-500 mt-3">
                    Ask about food, macros, training, form, recovery, or how to adjust your plan.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                    {SUGGESTED_QUESTIONS.slice(0, 4).map(question => (
                      <button key={question} onClick={() => sendMessage(question)} disabled={keyNotSet}
                        className="text-left bg-cream border border-brown-200 rounded-2xl px-4 py-3 text-sm text-brown-700 hover:border-brown-400 hover:bg-brown-50 transition-all disabled:opacity-40">
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <ChatBubble key={message.id || index} message={message} />
            ))}

            {error && (
              <div className="max-w-3xl mx-auto bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t border-brown-200 bg-cream px-4 sm:px-6 py-3">
          {messages.length > 0 && !loading && (
            <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto pb-3">
              {SUGGESTED_QUESTIONS.slice(2).map(question => (
                <button key={question} onClick={() => sendMessage(question)} disabled={keyNotSet}
                  className="flex-shrink-0 text-xs bg-white border border-brown-200 rounded-full px-3 py-1.5 text-brown-600 hover:border-brown-400 disabled:opacity-40">
                  {question}
                </button>
              ))}
            </div>
          )}
          <div className="max-w-5xl mx-auto flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={handleKey}
              placeholder={keyNotSet ? 'Add API key to start chatting...' : 'Ask your coach anything...'}
              disabled={loading || keyNotSet}
              rows={1}
              className="flex-1 px-4 py-3 rounded-2xl border border-brown-200 bg-brown-50 text-brown-900 placeholder-brown-300 text-sm focus:outline-none focus:border-brown-400 resize-none disabled:opacity-50"
              style={{ maxHeight: '130px', overflowY: 'auto' }}
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading || keyNotSet}
              className="w-12 h-12 bg-brown-700 hover:bg-brown-800 disabled:opacity-40 text-cream rounded-2xl flex items-center justify-center transition-all active:scale-95">
              {loading ? <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" /> : <FiSend />}
            </button>
          </div>
          <p className="text-xs text-brown-300 text-center mt-1.5">Enter to send - Shift+Enter for new line</p>
        </div>
      </section>
    </main>
  )
}
