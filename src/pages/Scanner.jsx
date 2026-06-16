import { useRef, useState } from 'react'
import { OPENROUTER_API_KEY, callVision } from '../config'

export default function Scanner() {
  const [preview, setPreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(100)
  const fileRef = useRef(null)

  const keyNotSet = !OPENROUTER_API_KEY || OPENROUTER_API_KEY.startsWith('PASTE_')

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file.')
      return
    }

    setError('')
    setResult(null)
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const analyseImage = async () => {
    if (!imageFile) return
    if (keyNotSet) {
      setError('Set VITE_OPENROUTER_API_KEY in your local .env and in Vercel Environment Variables.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(imageFile)
      })

      const prompt = `You are an expert nutritionist AI. Look at this food image and identify exactly what food is shown.
Return ONLY raw JSON, no markdown, no backticks, no explanation.
{
  "name": "specific food name",
  "emoji": "single relevant emoji",
  "confidence": 85,
  "estimatedPortion": "visual estimate e.g. 150g serving",
  "per100g": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "fiber": 0,
    "sugar": 0,
    "sodium": 0
  },
  "keyNutrients": ["Vitamin C", "Iron"],
  "gymVerdict": "one sentence on how this food affects gym performance",
  "tip": "one practical tip for this food in a fitness diet"
}
Use accurate per-100g nutrition. Chicken breast is about 165 kcal and 31g protein. White rice is about 130 kcal, 2.7g protein and 28g carbs. Eggs are about 155 kcal and 13g protein.`

      const raw = await callVision(base64, imageFile.type, prompt)
      const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
      let parsed

      try {
        parsed = JSON.parse(cleaned)
      } catch {
        const match = cleaned.match(/\{[\s\S]*\}/)
        if (!match) throw new Error('Could not read AI response. Try again with a clearer photo.')
        parsed = JSON.parse(match[0])
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

  return (
    <main className="pt-20 pb-16 min-h-screen">
      <section className="bg-brown-800 text-cream py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-brown-300 font-medium">Powered by OpenRouter AI</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2 mb-2">AI Food Scanner</h1>
          <p className="text-brown-300 font-body max-w-2xl">Snap any food and get nutrition data instantly.</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-5">
        {keyNotSet && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-sm text-amber-800">
            Set <code className="bg-amber-100 px-1 rounded">VITE_OPENROUTER_API_KEY</code> in your local .env and in Vercel.
          </div>
        )}

        {!result ? (
          <>
            <div
              onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
              onDragOver={e => e.preventDefault()}
              onClick={() => !preview && fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl overflow-hidden transition-all ${
                preview ? 'border-brown-300 cursor-default' : 'border-brown-300 hover:border-brown-500 cursor-pointer bg-cream hover:bg-brown-50'
              }`}
            >
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Food to scan" className="w-full max-h-80 object-contain bg-brown-50" />
                  <button onClick={e => { e.stopPropagation(); reset() }}
                    className="absolute top-3 right-3 bg-brown-900/70 text-cream rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-brown-900">x</button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="text-5xl mb-4">AI</div>
                  <p className="font-display text-xl font-semibold text-brown-700 mb-1">Drop your food photo here</p>
                  <p className="text-brown-400 text-sm">or click to browse JPG, PNG, WEBP</p>
                </div>
              )}
            </div>

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />

            <div className="flex gap-3">
              <button onClick={() => fileRef.current?.click()} className="flex-1 btn-outline py-3 text-sm">Upload Photo</button>
              <label className="flex-1 btn-outline py-3 text-sm cursor-pointer text-center">
                Take Photo
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              </label>
            </div>

            {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3">{error}</div>}

            {preview && (
              <button onClick={analyseImage} disabled={loading}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3 disabled:opacity-60">
                {loading ? 'Analysing your food...' : 'Identify Food & Get Macros'}
              </button>
            )}
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
                  <p className="text-xs text-brown-500">{result.confidence}% confidence</p>
                  {result.estimatedPortion && <p className="text-sm text-brown-400">{result.estimatedPortion}</p>}
                </div>
              </div>
            </div>

            <div className="bg-cream rounded-2xl border border-brown-200 p-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-brown-600 font-medium flex-shrink-0">Quantity:</span>
                <input type="range" min={10} max={500} step={5} value={qty} onChange={e => setQty(Number(e.target.value))} className="flex-1" />
                <input type="number" value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value)))}
                  className="w-16 px-2 py-1 border border-brown-200 rounded-lg text-center text-sm focus:outline-none" />
                <span className="text-sm text-brown-400">g</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Calories', value: Math.round((p.calories || 0) * scale), unit: 'kcal', bg: 'bg-orange-50', txt: 'text-orange-600', border: 'border-orange-100' },
                { label: 'Protein', value: Math.round((p.protein || 0) * scale) + 'g', unit: 'grams', bg: 'bg-rose-50', txt: 'text-rose-600', border: 'border-rose-100' },
                { label: 'Carbs', value: Math.round((p.carbs || 0) * scale) + 'g', unit: 'grams', bg: 'bg-yellow-50', txt: 'text-yellow-600', border: 'border-yellow-100' },
                { label: 'Fat', value: Math.round((p.fat || 0) * scale) + 'g', unit: 'grams', bg: 'bg-blue-50', txt: 'text-blue-600', border: 'border-blue-100' },
              ].map(m => (
                <div key={m.label} className={`${m.bg} border ${m.border} rounded-2xl p-4 text-center`}>
                  <div className={`font-display text-3xl font-bold ${m.txt}`}>{m.value}</div>
                  <div className="text-xs text-brown-400 mt-0.5">{m.unit}</div>
                  <div className="text-sm font-medium text-brown-600 mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            {(result.gymVerdict || result.tip) && (
              <div className="bg-brown-800 rounded-2xl p-5 text-cream space-y-3">
                {result.gymVerdict && <p className="text-sm leading-relaxed">{result.gymVerdict}</p>}
                {result.tip && <p className="text-sm text-brown-200 leading-relaxed">{result.tip}</p>}
              </div>
            )}

            <button onClick={reset} className="btn-outline w-full py-3">Scan Another Food</button>
          </div>
        )}
      </div>
    </main>
  )
}
