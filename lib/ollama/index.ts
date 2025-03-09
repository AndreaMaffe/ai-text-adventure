import axios from 'axios'

const OLLAMA_API_URL = 'http://localhost:11434/api/chat'
const OLLAMA_MODEL = 'llama3.1'

async function callOllama(prompt: string) {
  const payload = {
    model: OLLAMA_MODEL,
    messages: [{ role: 'user', content: prompt }],
  }

  try {
    const { data } = await axios.post(OLLAMA_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const { content = [] } = data
    return content[0]?.text
  } catch (error: any) {
    console.error(
      'Error calling Ollama API:',
      error.response ? error.response.data : error.message
    )
    return null
  }
}

export { callOllama }
