import axios from 'axios'

const postGenerateText = async (prompt: string) => {
  const { data } = await axios.post<{ text: string }>('/api/generate', {
    prompt,
  })
  return data
}

export { postGenerateText }
