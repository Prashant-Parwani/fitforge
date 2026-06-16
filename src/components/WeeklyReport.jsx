import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { OPENROUTER_API_KEY, callAI } from '../config'

function ScoreRing({ score }) {
  const circ = 2 * Math.PI * 42
  const dash = (score / 100) * circ
  const color = score >= 70 ? '#639922' : score >= 45 ? '#EF9F27' : '#E24B4A'

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#f5ebe0" strokeWidth="8" />
        <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-3xl font-bold text-brown-900">{score}</div>
        <div className="text-xs text-brown-400">/ 100</div>
      </div>
    </div>
  )
}

function ReportCard({ report, onShare }) {
  return (
    <div className="bg-cream rounded-2xl border border-brown-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-brown-100 flex items-center justify-between">
        <div>
          <div className="font-display font-semibold text-brown-900">Week of {report.weekLabel}</div>
          <div className="text-xs text-brown-400 mt-0.5">
            {report.workouts} workouts - {report.avgSleep ? report.avgSleep + 'h avg sleep' : 'sleep not tracked'}
          </div>
        </div>
        <button onClick={() => onShare(report)}
          className="text-xs text-brown-500 hover:text-brown-700 border border-brown-200 px-3 py-1.5 rounded-lg transition-colors">
          Share
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-6 mb-5">
          <ScoreRing score={report.score} />
          <p className="flex-1 text-sm text-brown-700 leading-relaxed">{report.verdict}</p>
        </div>

        <div className="space-y-3">
          <div className="bg-green-50 border border-green-100 rounded-xl p-3">
            <div className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">This Week's Wins</div>
            <ul className="space-y-1">
              {report.wins?.map((win, i) => (
                <li key={i} className="text-sm text-green-800 flex items-start gap-1.5">
                  <span className="text-green-500 flex-shrink-0">-</span>{win}
                </li>
              ))}
            </ul>
          </div>

          {report.improve && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">One Thing to Improve</div>
              <p className="text-sm text-amber-800">{report.improve}</p>
            </div>
          )}

          {report.nextWeekFocus && (
            <div className="bg-brown-50 border border-brown-200 rounded-xl p-3">
              <div className="text-xs font-semibold text-brown-600 uppercase tracking-wider mb-1">Next Week's Focus</div>
              <p className="text-sm text-brown-700">{report.nextWeekFocus}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function WeeklyReport() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const reports = user?.weeklyReports || []
  const keyNotSet = !OPENROUTER_API_KEY || OPENROUTER_API_KEY.startsWith('PASTE_')

  const getWeekLabel = () => {
    const d = new Date()
    const mon = new Date(d)
    mon.setDate(d.getDate() - ((d.getDay() + 6) % 7))
    return mon.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })
  }

  const getLast7Days = () => {
    const today = new Date()
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      return d.toISOString().split('T')[0]
    })
  }

  const generateReport = async () => {
    if (keyNotSet) {
      setError('Set VITE_OPENROUTER_API_KEY in .env and Vercel.')
      return
    }

    setLoading(true)
    setError('')

    const last7 = getLast7Days()
    const workoutsThisWeek = (user?.workoutLog || []).filter(w => last7.includes(w.date))
    const weightsThisWeek = (user?.weightLog || []).filter(w => last7.includes(w.date))
    const sleepThisWeek = (user?.sleepLog || []).filter(s => last7.includes(s.date))

    const avgSleep = sleepThisWeek.length
      ? (sleepThisWeek.reduce((a, s) => a + s.hours, 0) / sleepThisWeek.length).toFixed(1)
      : null

    const weightChange = weightsThisWeek.length >= 2
      ? (weightsThisWeek[weightsThisWeek.length - 1].value - weightsThisWeek[0].value).toFixed(1)
      : null

    const prompt = `You are a personal trainer reviewing a client's week. Return ONLY valid JSON, no markdown.

CLIENT PROFILE:
- Goal: ${user?.goal || 'Not set'}
- Level: ${user?.level || 'Not specified'}
- Current weight: ${user?.weight || 'Unknown'}kg

THIS WEEK'S DATA:
- Workouts completed: ${workoutsThisWeek.length}
- Muscles trained: ${[...new Set(workoutsThisWeek.map(w => w.focus))].join(', ') || 'None'}
- Total sets logged: ${workoutsThisWeek.reduce((a, w) => a + (w.sets || 0), 0)}
- Weight change: ${weightChange !== null ? weightChange + 'kg' : 'not tracked'}
- Average sleep: ${avgSleep ? avgSleep + ' hours' : 'not tracked'}

Return this exact JSON:
{
  "score": 75,
  "verdict": "2 sentence personal summary of the week",
  "wins": ["specific win 1", "specific win 2", "specific win 3"],
  "improve": "one specific actionable thing to fix next week",
  "nextWeekFocus": "one sentence about what to prioritise next week"
}`

    try {
      const raw = (await callAI('', prompt, 600, { temperature: 0.6 })).replace(/```json|```/gi, '').trim()
      const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || raw)

      const report = {
        ...parsed,
        weekLabel: getWeekLabel(),
        generatedAt: new Date().toISOString(),
        workouts: workoutsThisWeek.length,
        avgSleep,
        weightChange,
      }

      const existing = (user?.weeklyReports || []).slice(-11)
      updateUser({ weeklyReports: [...existing, report] })
    } catch (err) {
      setError(err.message || 'Failed to generate report. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const shareReport = (report) => {
    const text = `FitForge Weekly Report - Week of ${report.weekLabel}

Score: ${report.score}/100
${report.verdict}

Wins this week:
${report.wins?.map(w => '- ' + w).join('\n')}

Improve: ${report.improve}
Next week: ${report.nextWeekFocus}

Tracked with FitForge`

    if (navigator.share) {
      navigator.share({ title: 'My FitForge Week', text })
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Report copied to clipboard!'))
    }
  }

  return (
    <div className="space-y-5">
      {keyNotSet && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
          Set <code className="bg-amber-100 px-1 rounded">VITE_OPENROUTER_API_KEY</code> in .env and Vercel to use AI reports.
        </div>
      )}

      <div className="bg-cream rounded-2xl border border-brown-200 p-5">
        <h3 className="font-display text-lg font-semibold text-brown-900 mb-1">Generate This Week's Report</h3>
        <p className="text-sm text-brown-500 mb-4">
          AI analyses your last 7 days and gives you a personalised score and feedback.
        </p>
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl px-4 py-3 mb-3">{error}</div>
        )}
        <button onClick={generateReport} disabled={loading || keyNotSet}
          className="btn-primary w-full py-3 flex items-center justify-center gap-3 disabled:opacity-50">
          {loading ? 'Generating your report...' : 'Generate Weekly Report'}
        </button>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-brown-900">Your Reports</h3>
            <span className="text-xs text-brown-400">{reports.length} saved</span>
          </div>
          {[...reports].reverse().map((report, i) => (
            <ReportCard key={i} report={report} onShare={shareReport} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-cream rounded-2xl border border-brown-200">
          <div className="text-4xl mb-3">AI</div>
          <p className="text-brown-500 text-sm">No reports yet. Generate your first one above.</p>
          <p className="text-brown-400 text-xs mt-1">You need some workouts logged first for a meaningful report.</p>
        </div>
      )}
    </div>
  )
}
