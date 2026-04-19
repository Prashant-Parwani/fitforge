import { useState, useRef } from 'react'

// ============================================================
// 🔑 STEP 1: Go to https://aistudio.google.com/apikey
// 🔑 STEP 2: Create a free API key (takes 30 seconds)
// 🔑 STEP 3: Replace the text below with your key and save
// ============================================================
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
// ============================================================
// That's it! The scanner will work immediately after saving.
// ============================================================

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

export default function Scanner() {
  const [preview, setPreview]     = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState(null)
  const [error, setError]         = useState('')
  const [qty, setQty]             = useState(100)
  const fileRef                   = useRef()

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WEBP).')
      return
    }
    setError('')
    setResult(null)
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const analyseImage = async () => {
    if (!imageFile) return

    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'PASTE_YOUR_GEMINI_API_KEY_HERE') {
      setError('No API key set. Open src/pages/Scanner.jsx in VS Code, find line 8, and replace PASTE_YOUR_GEMINI_API_KEY_HERE with your actual Gemini API key from aistudio.google.com/apikey')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload  = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(imageFile)
      })

      const prompt = `You are an expert nutritionist AI. Look at this food image and identify EXACTLY what food is shown.

Return ONLY raw JSON — no markdown, no backticks, no explanation text before or after.

{
  "name": "specific food name (e.g. Grilled Chicken Breast, Masala Dosa, Rajma Curry)",
  "emoji": "single most relevant emoji",
  "confidence": <integer 70-99>,
  "estimatedPortion": "visual estimate e.g. 150g serving or 1 medium bowl",
  "per100g": {
    "calories": <integer>,
    "protein": <decimal>,
    "carbs": <decimal>,
    "fat": <decimal>,
    "fiber": <decimal>,
    "sugar": <decimal>,
    "sodium": <integer in mg>
  },
  "keyNutrients": ["Vitamin C", "Iron", "Potassium"],
  "gymVerdict": "one sentence on how this food affects gym performance",
  "tip": "one practical tip for this food in a fitness diet"
}

IMPORTANT — base all answers on what you ACTUALLY SEE:
- Chicken breast = ~165 cal, 31g protein, 0g carbs, 3.6g fat per 100g
- White rice = ~130 cal, 2.7g protein, 28g carbs, 0.3g fat per 100g
- Boiled egg = ~155 cal, 13g protein, 1.1g carbs, 11g fat per 100g
- Banana = ~89 cal, 1.1g protein, 23g carbs, 0.3g fat per 100g
- Dal/Lentils = ~116 cal, 9g protein, 20g carbs, 0.4g fat per 100g
- Paneer = ~265 cal, 18g protein, 3.4g carbs, 20g fat per 100g
Every food is different. Be accurate.`

      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: imageFile.type, data: base64 } },
              { text: prompt }
            ]
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 800 }
        })
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        const msg = err?.error?.message || `HTTP ${response.status}`
        if (response.status === 400) throw new Error('Invalid API key. Double-check your key at aistudio.google.com/apikey')
        if (response.status === 403) throw new Error('API key blocked. Enable the Gemini API in your Google Cloud Console.')
        if (response.status === 429) throw new Error('Too many requests. Wait a moment and try again.')
        throw new Error(msg)
      }

      const data = await response.json()
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
      if (!rawText) throw new Error('Empty response from Gemini. Please try again.')

      const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

      let parsed
      try {
        parsed = JSON.parse(cleaned)
      } catch {
        const match = cleaned.match(/\{[\s\S]*\}/)
        if (match) parsed = JSON.parse(match[0])
        else throw new Error('AI response was not valid JSON. Try again with a clearer photo.')
      }

      setResult(parsed)
      setQty(100)

    } catch (err) {
      setError(err.message || 'Scan failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setPreview(null)
    setImageFile(null)
    setResult(null)
    setError('')
    setQty(100)
  }

  const scale = qty / 100
  const p = result?.per100g || {}
  const keyNotSet = GEMINI_API_KEY === 'PASTE_YOUR_GEMINI_API_KEY_HERE'

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <section className="bg-brown-800 text-cream py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-brown-300 font-medium">Powered by Google Gemini Vision</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2 mb-2">AI Food Scanner</h1>
          <p className="text-brown-300 font-body max-w-2xl">
            Snap any food — desi or international. Gemini AI identifies it and gives you
            real, accurate nutrition data instantly.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-5">

        {/* Setup banner when key not set */}
        {keyNotSet && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
            <h3 className="font-semibold text-amber-800 mb-3 text-lg">⚡ One-time Setup — Add Your Gemini API Key</h3>
            <div className="space-y-2 text-sm text-amber-800 font-body">
              <div className="flex gap-2 items-start">
                <span className="w-6 h-6 bg-amber-400 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <span>Go to <strong>aistudio.google.com/apikey</strong> → click "Create API Key" (it's free)</span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="w-6 h-6 bg-amber-400 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <span>Open <strong>src/pages/Scanner.jsx</strong> in VS Code</span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="w-6 h-6 bg-amber-400 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <span>Go to <strong>line 8</strong> and replace <code className="bg-amber-100 px-1 rounded text-xs">PASTE_YOUR_GEMINI_API_KEY_HERE</code> with your key</span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="w-6 h-6 bg-amber-400 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                <span>Press <strong>Ctrl+S</strong> to save → scanner works immediately!</span>
              </div>
            </div>
          </div>
        )}

        {!result ? (
          <>
            <div
              onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
              onDragOver={e => e.preventDefault()}
              onClick={() => !preview && fileRef.current.click()}
              className={`border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-200 ${
                preview ? 'border-brown-300 cursor-default' : 'border-brown-300 hover:border-brown-500 cursor-pointer bg-cream hover:bg-brown-50'
              }`}
            >
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Food to scan" className="w-full max-h-80 object-contain bg-brown-50" />
                  <button onClick={e => { e.stopPropagation(); reset() }}
                    className="absolute top-3 right-3 bg-brown-900/70 text-cream rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-brown-900">✕</button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="text-5xl mb-4">📸</div>
                  <p className="font-display text-xl font-semibold text-brown-700 mb-1">Drop your food photo here</p>
                  <p className="text-brown-400 text-sm">or click to browse · JPG, PNG, WEBP</p>
                </div>
              )}
            </div>

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />

            <div className="flex gap-3">
              <button onClick={() => fileRef.current.click()} className="flex-1 btn-outline py-3 flex items-center justify-center gap-2 text-sm">
                🖼️ Upload Photo
              </button>
              <label className="flex-1 btn-outline py-3 flex items-center justify-center gap-2 text-sm cursor-pointer">
                📷 Take Photo
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 leading-relaxed">{error}</div>
            )}

            {preview && (
              <button onClick={analyseImage} disabled={loading}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3 disabled:opacity-60">
                {loading ? (
                  <><span className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />Gemini is analysing your food...</>
                ) : <>🤖 Identify Food &amp; Get Macros</>}
              </button>
            )}

            <div className="bg-cream rounded-2xl border border-brown-200 p-5">
              <h3 className="font-display text-lg font-semibold text-brown-800 mb-4">How it works</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { n:'1', icon:'📸', t:'Snap or upload any food photo' },
                  { n:'2', icon:'🤖', t:'Gemini Vision AI identifies the exact food' },
                  { n:'3', icon:'📊', t:'Get accurate macros, vitamins & trainer verdict' },
                ].map(s => (
                  <div key={s.n}>
                    <div className="w-8 h-8 bg-brown-500 text-cream rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">{s.n}</div>
                    <div className="text-xl mb-1">{s.icon}</div>
                    <p className="text-xs text-brown-500 leading-snug">{s.t}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4 animate-fade-up">
            <div className="bg-cream rounded-2xl border border-brown-200 p-5">
              <div className="flex items-center gap-4">
                {preview && <img src={preview} alt="Scanned food" className="w-20 h-20 object-cover rounded-xl border border-brown-200 flex-shrink-0" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl">{result.emoji}</span>
                    <h2 className="font-display text-2xl font-bold text-brown-900">{result.name}</h2>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-28 bg-brown-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${result.confidence}%` }} />
                    </div>
                    <span className="text-xs text-brown-500">{result.confidence}% confidence</span>
                  </div>
                  {result.estimatedPortion && <p className="text-sm text-brown-400">📏 {result.estimatedPortion}</p>}
                </div>
              </div>
            </div>

            <div className="bg-cream rounded-2xl border border-brown-200 p-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-brown-600 font-medium flex-shrink-0">Quantity:</span>
                <input type="range" min={10} max={500} step={5} value={qty} onChange={e => setQty(Number(e.target.value))} className="flex-1" />
                <div className="flex items-center gap-1 flex-shrink-0">
                  <input type="number" value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                    className="w-16 px-2 py-1 border border-brown-200 rounded-lg text-center text-sm focus:outline-none focus:border-brown-400" />
                  <span className="text-sm text-brown-400">g</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label:'Calories', value:Math.round((p.calories||0)*scale),       unit:'kcal', bg:'bg-orange-50', txt:'text-orange-600', border:'border-orange-100' },
                { label:'Protein',  value:Math.round((p.protein||0)*scale)+'g',    unit:'',     bg:'bg-red-50',    txt:'text-red-600',    border:'border-red-100' },
                { label:'Carbs',    value:Math.round((p.carbs||0)*scale)+'g',      unit:'',     bg:'bg-yellow-50', txt:'text-yellow-600', border:'border-yellow-100' },
                { label:'Fat',      value:Math.round((p.fat||0)*scale)+'g',        unit:'',     bg:'bg-blue-50',   txt:'text-blue-600',   border:'border-blue-100' },
              ].map(m => (
                <div key={m.label} className={`${m.bg} border ${m.border} rounded-2xl p-4 text-center`}>
                  <div className={`font-display text-3xl font-bold ${m.txt}`}>{m.value}</div>
                  <div className="text-xs text-brown-400 mt-0.5">{m.unit||'grams'}</div>
                  <div className="text-sm font-medium text-brown-600 mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-cream rounded-2xl border border-brown-200 p-5">
              <h3 className="text-xs font-semibold text-brown-500 uppercase tracking-wider mb-3">More nutrients (per {qty}g)</h3>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {[
                  { label:'Fiber',  value:Math.round((p.fiber||0)*scale)+'g' },
                  { label:'Sugar',  value:Math.round((p.sugar||0)*scale)+'g' },
                  { label:'Sodium', value:Math.round((p.sodium||0)*scale)+'mg' },
                ].map(m => (
                  <div key={m.label} className="bg-brown-50 rounded-xl p-3 text-center">
                    <div className="font-bold text-brown-800">{m.value}</div>
                    <div className="text-xs text-brown-400">{m.label}</div>
                  </div>
                ))}
              </div>
              {result.keyNutrients?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {result.keyNutrients.map((v,i) => (
                    <span key={i} className="text-xs bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-full">{v}</span>
                  ))}
                </div>
              )}
            </div>

            {(result.gymVerdict || result.tip) && (
              <div className="bg-brown-800 rounded-2xl p-5 text-cream space-y-3">
                {result.gymVerdict && (
                  <div>
                    <div className="text-xs uppercase tracking-wider text-brown-300 mb-1">Trainer's Verdict</div>
                    <p className="text-sm font-body leading-relaxed">{result.gymVerdict}</p>
                  </div>
                )}
                {result.tip && (
                  <div className="pt-3 border-t border-brown-700">
                    <div className="text-xs uppercase tracking-wider text-brown-300 mb-1">💡 Pro Tip</div>
                    <p className="text-sm text-brown-200 font-body leading-relaxed">{result.tip}</p>
                  </div>
                )}
              </div>
            )}

            <button onClick={reset} className="btn-outline w-full py-3">📸 Scan Another Food</button>
          </div>
        )}
      </div>
    </main>
  )
}