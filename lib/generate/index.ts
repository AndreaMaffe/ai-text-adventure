import { GameState } from '@/app/types/game'
import axios from 'axios'

const postGenerateText = async (info: any) => {
  const { data } = await axios.post<GameState>('/api/generate', info)
  return data
}

export { postGenerateText }
