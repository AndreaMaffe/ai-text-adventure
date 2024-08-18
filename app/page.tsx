'use client'

import Spinner from '@/components/Spinner/Spinner'
import {
  getPromptForNewActions,
  getPromptForNewSituation,
  getPromptForSynthesis,
} from '@/lib/game'
import { postGenerateText } from '@/lib/generate'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Providers } from './providers'

const DEFAULT_SITUATION = 'Carrix è pronto.'

export default function Home() {
  return (
    <main>
      <Providers>
        <Game />
      </Providers>
    </main>
  )
}

const parseActionsString = (actions: string) => {
  const firstAction = actions.substring(
    actions.indexOf('1.') + 3,
    actions.indexOf('2.')
  )
  const secondAction = actions.substring(
    actions.indexOf('2.') + 3,
    actions.indexOf('3.')
  )
  const thirdAction = actions.substring(
    actions.indexOf('3.') + 3,
    actions.indexOf('4.')
  )
  const fourthAction = actions.substring(actions.indexOf('4.') + 3)

  return [firstAction, secondAction, thirdAction, fourthAction]
}

function Game() {
  const [chapter, setChapter] = useState(1)
  const [lastActionChosen, setLastActionChosen] = useState<number | undefined>()
  const [history, setHistory] = useState<string[]>([])
  const [life, setLife] = useState(3)

  const getSynthesis = async (text: string) => {
    const synthesis = await postGenerateText(getPromptForSynthesis(text))
    if (synthesis.includes('DAMAGE')) {
      setLife(life - 1)
    }
    if (synthesis.includes('LIFE')) {
      setLife(life - 1)
    }
    const cleanedSynthesis = synthesis
      .replace('[DAMAGE]', '')
      .replace('[LIFE]', '')
    setHistory((history) => history.concat(cleanedSynthesis))
    return synthesis
  }

  const { data: situation, isLoading: isLoadingSituation } = useQuery<{
    text: string
  }>({
    queryKey: ['generate', 'situation', chapter],
    queryFn: () =>
      postGenerateText(
        getPromptForNewSituation({
          actionNumber: lastActionChosen!,
          actions: actions?.text ?? '',
          history: history.join('\n'),
          life,
        })
      ),
    enabled: !!lastActionChosen,
  })

  const isGameOver = situation?.text?.includes('FINE DEL GIOCO')

  const { isLoading: isLoadingSynthesis } = useQuery({
    queryKey: ['generate', 'synthesis', situation?.text],
    queryFn: () => getSynthesis(situation?.text!),
    enabled: !!situation?.text && !isGameOver,
  })

  const { data: actions, isLoading: isLoadingActions } = useQuery<{
    text: string
  }>({
    queryKey: ['generate', 'actions', history.length],
    queryFn: () =>
      postGenerateText(
        getPromptForNewActions({
          history: history.join('\n'),
          lastSituation: situation?.text ?? '',
        })
      ),
    enabled: !isGameOver,
  })

  const onActionChosen = (actionNumber: number) => {
    setChapter((chapter) => chapter + 1)
    setLastActionChosen(actionNumber)
  }

  const renderActions = () => {
    if (isLoadingActions) return <Spinner />

    return (
      <ul className='space-y-4'>
        {isGameOver ? (
          <li>
            <button className='border-2 border-[#b34700] text-[#b34700] p-2 rounded-2xl font-semibold'>
              Torna al menu principale
            </button>
          </li>
        ) : (
          parseActionsString(actions?.text ?? '').map((action, index) => (
            <li key={index}>
              <button
                className='border-2 border-[#b34700] text-[#b34700] p-2 rounded-2xl font-semibold'
                onClick={() => onActionChosen(index + 1)}
              >
                {action}
              </button>
            </li>
          ))
        )}
      </ul>
    )
  }

  console.log({ history, life })

  return (
    <div className='flex flex-col gap-8 text-center p-8'>
      <span className='text-4xl'>{chapter}</span>
      {isLoadingSituation ? (
        <Spinner />
      ) : (
        <span>
          {situation?.text?.replace('[FINE DEL GIOCO]', '') ??
            DEFAULT_SITUATION}
        </span>
      )}
      {!isLoadingSituation && !isLoadingSynthesis && renderActions()}
    </div>
  )
}
