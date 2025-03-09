import axios from 'axios'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_MODEL = 'nvidia/llama-3.1-nemotron-70b-instruct:free'

async function callOpenRouter(
  messages: { role: string; content: string }[]
): Promise<string | null> {
  const payload = {
    model: OPENROUTER_MODEL,
    messages,
    max_tokens: 1024,
    temperature: 0.9,
  }

  try {
    const { data } = await axios.post(OPENROUTER_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
    })

    const { choices = [] } = data

    return choices[0]?.message?.content ?? ''
  } catch (error: any) {
    console.error(
      'Error calling Openrouter API:',
      error.response ? error.response.data : error.message
    )
    return null
  }
}

export { callOpenRouter }
