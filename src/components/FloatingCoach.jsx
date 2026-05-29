import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { OPENROUTER_API_KEY, AI_MODEL, AI_URL, getAIErrorMessage } from '../config'

const QUICK_QUESTIONS = [
  'How much protein is in 4 eggs?',
  'What to eat after leg day?',
  'Best 4 exercises for chest + triceps day?',
  'How much water should I drink today?',
  'What is the correct form for deadlift?',
  'Is 6 hours of sleep enough for muscle growth?',
  'How many calories in 100g paneer?',
  'Best foods for bulking on Indian diet?',
]

function buildSystemPrompt(user) {
  const split = user?.customSplit
    ? user.customSplit.map(day => `${day.day}: ${day.focus}`).join(', ')
    : 'Standard 7-day split'

  return `You are FitForge AI Coach, a world-class personal trainer and nutritionist with 30 years experience. You are embedded as a chatbot inside the FitForge fitness app.

USER PROFILE:
- Name: ${user?.name || 'User'}
- Goal: ${user?.goal || 'Not set'}
- Level: ${user?.level || 'Not specified'}
- Weight: ${user?.weight ? user.weight + 'kg' : 'Not provided'}
- Target: ${user?.targetWeight ? user.targetWeight + 'kg' : 'Not set'}
- Diet: ${user?.diet || 'No preference'}
- Split: ${split}

YOUR PERSONALITY:
- Friendly, direct, specific, like a knowledgeable gym friend
- Give exact numbers, not vague answers
- For nutrition questions, always give calories, protein, carbs, fat
- For exercise questions, name specific exercises with sets, reps, proper form cues
- For Indian users, suggest Indian foods by default: dal, paneer, roti, dahi, eggs
- Keep answers concise: 2-4 sentences max unless user asks for a full plan
- Reference the user's name and goal naturally

WHAT YOU CAN HELP WITH:
- Exact nutrition data for any food
- Exercise recommendations with sets, reps, proper form cues
- Personalised diet advice based on their goal
- Workout planning and muscle group questions
- Supplement advice, recovery, sleep
- Calorie and macro calculations`
}

export default function FloatingCoach() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [listening, setListening] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  const keyNotSet = !OPENROUTER_API_KEY || OPENROUTER_API_KEY.startsWith('PASTE_')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, open])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Voice is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      setInput(text)
      setTimeout(() => sendMessage(text), 300)
    }
    recognition.onerror = () => {
      setListening(false)
      setError('Voice input failed. Try typing.')
    }
    recognitionRef.current = recognition
    recognition.start()
  }

  const stopVoice = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  const sendMessage = async (text) => {
    const message = (text || input).trim()
    if (!message || loading) return
    if (keyNotSet) {
      setError('Set VITE_OPENROUTER_API_KEY in your local .env and in Vercel Environment Variables.')
      return
    }

    setError('')
    setInput('')
    const userMsg = { role: 'user', content: message }
    const nextMsgs = [...msgs, userMsg]
    setMsgs(nextMsgs)
    setLoading(true)

    const placeholderId = Date.now()
    setMsgs(prev => [...prev, { role: 'assistant', content: '', id: placeholderId, streaming: true }])

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
          max_tokens: 500,
          temperature: 0.7,
          messages: [
            { role: 'system', content: buildSystemPrompt(user) },
            ...nextMsgs.map(msg => ({ role: msg.role, content: msg.content })),
          ],
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(getAIErrorMessage(response.status, err?.error?.message))
      }

      const data = await response.json()
      const aiText = data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response. Try again."
      const words = aiText.split(' ')
      let built = ''

      for (let i = 0; i < words.length; i += 1) {
        built += (i > 0 ? ' ' : '') + words[i]
        const snapshot = built
        setMsgs(prev => prev.map(msg =>
          msg.id === placeholderId ? { ...msg, content: snapshot, streaming: i < words.length - 1 } : msg
        ))
        if (i < words.length - 1) await new Promise(resolve => setTimeout(resolve, 20))
      }

      setMsgs(prev => prev.map(msg => msg.id === placeholderId ? { role: 'assistant', content: aiText } : msg))
    } catch (err) {
      setMsgs(prev => prev.filter(msg => msg.id !== placeholderId))
      setError(err.message || 'Something went wrong. Try again.')
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

  const clearChat = () => {
    setMsgs([])
    setError('')
  }

  return (
    <>
      <button
        onClick={() => setOpen(value => !value)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all duration-300 active:scale-95 ${
          open ? 'bg-brown-700 rotate-45' : 'bg-brown-500 hover:bg-brown-600'
        } text-cream`}
        aria-label="Open AI Coach"
      >
        {open ? '✕' : '🤖'}
      </button>

      <div className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-96 bg-cream rounded-2xl shadow-2xl border border-brown-200 flex flex-col transition-all duration-300 origin-bottom-right ${
        open ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
      }`} style={{ maxHeight: '75vh' }}>
        <div className="flex items-center justify-between px-4 py-3 bg-brown-800 text-cream rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brown-600 rounded-full flex items-center justify-center text-lg">🤖</div>
            <div>
              <div className="font-display font-semibold text-sm leading-tight">FitForge AI Coach</div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-brown-300">Always online</span>
              </div>
            </div>
          </div>
          {msgs.length > 0 && (
            <button onClick={clearChat} className="text-xs text-brown-400 hover:text-brown-200 transition-colors">Clear</button>
          )}
        </div>

        {keyNotSet && (
          <div className="bg-amber-50 border-b border-amber-200 px-3 py-2 flex-shrink-0">
            <p className="text-xs text-amber-800">Set <code className="bg-amber-100 px-1 rounded">VITE_OPENROUTER_API_KEY</code> in Vercel to activate</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {msgs.length === 0 && (
            <div>
              <div className="flex gap-2 mb-3">
                <div className="w-7 h-7 bg-brown-700 rounded-full flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                <div className="bg-brown-100 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-brown-800 leading-relaxed">
                  Hey {user?.name?.split(' ')[0] || 'there'}! 👋 I am your AI fitness coach. Ask me anything about nutrition, workouts, diet, or recovery.
                </div>
              </div>
              <p className="text-xs text-brown-400 text-center mb-2">Try asking:</p>
              <div className="flex flex-col gap-1.5">
                {QUICK_QUESTIONS.slice(0, 4).map(question => (
                  <button key={question} onClick={() => sendMessage(question)} disabled={keyNotSet || loading}
                    className="text-left text-xs bg-brown-50 border border-brown-200 rounded-xl px-3 py-2 text-brown-700 hover:border-brown-400 hover:bg-white transition-all disabled:opacity-40">
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {msgs.map((message, i) => (
            <div key={message.id || i} className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5 ${message.role === 'user' ? 'bg-brown-500 text-cream' : 'bg-brown-700 text-cream'}`}>
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'bg-brown-500 text-cream rounded-tr-sm'
                  : 'bg-brown-100 text-brown-800 rounded-tl-sm'
              }`}>
                {message.content}
                {message.streaming && <span className="inline-block w-1.5 h-4 bg-brown-400 ml-1 animate-pulse rounded-sm align-middle" />}
              </div>
            </div>
          ))}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2">{error}</div>
          )}

          {msgs.length > 0 && !loading && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1">
              {QUICK_QUESTIONS.slice(4).map(question => (
                <button key={question} onClick={() => sendMessage(question)} disabled={keyNotSet || loading}
                  className="flex-shrink-0 text-xs bg-brown-50 border border-brown-200 rounded-full px-2.5 py-1.5 text-brown-600 hover:border-brown-400 transition-all disabled:opacity-40">
                  {question}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="flex-shrink-0 px-3 pb-3 pt-2 border-t border-brown-100">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={handleKey}
              placeholder={keyNotSet ? 'Add API key to chat...' : 'Ask anything about fitness, food, workouts...'}
              disabled={loading || keyNotSet}
              rows={1}
              className="flex-1 px-3 py-2 rounded-xl border border-brown-200 bg-brown-50 text-brown-800 placeholder-brown-300 text-sm focus:outline-none focus:border-brown-400 resize-none disabled:opacity-50"
              style={{ maxHeight: '80px', overflowY: 'auto' }}
            />
            <button
              onClick={listening ? stopVoice : startVoice}
              disabled={loading || keyNotSet}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-40 ${
                listening ? 'bg-red-500 text-white animate-pulse' : 'bg-brown-100 text-brown-600 hover:bg-brown-200'
              }`}
              title={listening ? 'Stop listening' : 'Voice input'}
            >

              
              🎤
            </button>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading || keyNotSet}
              className="w-9 h-9 bg-brown-500 hover:bg-brown-600 disabled:opacity-40 text-cream rounded-xl flex items-center justify-center transition-all flex-shrink-0 active:scale-95"
            >
              {loading
                ? <span className="w-3.5 h-3.5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                : '↑'
              }
            </button>
          </div>
          <p className="text-xs text-brown-300 text-center mt-1.5">Enter to send - microphone for voice input</p>
        </div>
      </div>
    </>
  )
}
