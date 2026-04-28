// ============================================================
// PASTE YOUR OPENROUTER API KEY HERE
// Get your key at: https://openrouter.ai/keys
// ============================================================
export const OPENROUTER_API_KEY = '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'
// ============================================================

export const AI_MODEL = 'openai/gpt-4o-mini'
export const AI_URL = 'https://openrouter.ai/api/v1/chat/completions'

export function getAIErrorMessage(status, fallback) {
  const message = fallback || ''
  if (message.toLowerCase().includes('user not found')) {
    return 'OpenRouter API key/account not found. Create a new key at openrouter.ai/keys and paste it in src/config.js.'
  }
  if (status === 401) return 'Invalid OpenRouter API key. Check your key in src/config.js.'
  if (status === 403) return 'OpenRouter rejected this request. Check that your key is active and has access to the selected model.'
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
    throw new Error(getAIErrorMessage(response.status, err?.error?.message))
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
    throw new Error(getAIErrorMessage(response.status, err?.error?.message))
  }

  const data = await response.json()
  return data?.choices?.[0]?.message?.content || ''
}

// Legacy exports so old imports do not break while files are migrated.
export const GEMINI_API_KEY = OPENROUTER_API_KEY
export const GEMINI_URL = AI_URL
