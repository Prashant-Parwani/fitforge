// ============================================================
// PASTE YOUR OPENROUTER API KEY HERE
// Get your key at: https://openrouter.ai/keys
// ============================================================
export const OPENROUTER_API_KEY = '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'
// ============================================================

export const AI_MODEL = 'openai/gpt-4o-mini'
export const AI_URL = 'https://openrouter.ai/api/v1/chat/completions'

function getErrorMessage(status, fallback) {
  if (status === 401) return 'Invalid API key. Check your OpenRouter key in src/config.js.'
  if (status === 429) return 'Rate limit hit. Wait a moment and try again.'
  return fallback || `HTTP ${status}`
}

export async function callAI(systemPrompt, userMessage, maxTokens = 1000, options = {}) {
  const response = await fetch(AI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://fitforge.app',
      'X-Title': 'FitForge',
    },
    body: JSON.stringify({
      model: options.model || AI_MODEL,
      max_tokens: maxTokens,
      temperature: options.temperature,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: userMessage },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(getErrorMessage(response.status, err?.error?.message))
  }

  const data = await response.json()
  return data?.choices?.[0]?.message?.content || ''
}

export async function callVision(base64Image, mimeType, textPrompt) {
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
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } },
          { type: 'text', text: textPrompt },
        ],
      }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(getErrorMessage(response.status, err?.error?.message))
  }

  const data = await response.json()
  return data?.choices?.[0]?.message?.content || ''
}

// Legacy exports so old imports do not break while files are migrated.
export const GEMINI_API_KEY = OPENROUTER_API_KEY
export const GEMINI_URL = AI_URL
