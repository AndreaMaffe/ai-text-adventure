import axios from 'axios'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_MODEL = 'claude-3-5-sonnet-20240620'
const ANTHROPIC_VERSION = '2023-06-01'

async function callAnthropic(prompt: string) {
  const payload = {
    model: ANTHROPIC_MODEL,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1024,
  }

  try {
    const { data } = await axios.post(ANTHROPIC_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY,
        'anthropic-version': ANTHROPIC_VERSION,
      },
    })

    const { content = [] } = data
    return content[0]?.text
  } catch (error: any) {
    console.error(
      'Error calling Anthropic API:',
      error.response ? error.response.data : error.message
    )
    return null
  }
}

export { callAnthropic }
