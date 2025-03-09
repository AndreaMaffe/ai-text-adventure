'use client'

import Spinner from '@/components/Spinner/Spinner'
import { postGenerateText } from '@/lib/generate'
import { useState } from 'react'
import { Providers } from './providers'

export default function Home() {
  return (
    <main>
      <Providers>
        <Game />
      </Providers>
    </main>
  )
}

function Game() {
  const [chapter, setChapter] = useState(0)

  const [isLoadingGameState, setIsLoadingGameState] = useState(false)

  const [currentSituation, setCurrentSituation] = useState(
    "Il giocatore è in marcia verso il Dente dell'Abisso."
  )
  const [actions, setActions] = useState<string[]>(['Guardati intorno'])
  const [history, setHistory] = useState([
    'Il giocatore si trova nel villaggio di Caelum, per indagare sul malvagio drago Anthros.',
    'Il giocatore indaga nel villaggio di Caelum per trovare informazioni sul drago.',
    "Il giocatore scopre che il drago vive nel vulcano Dente dell'Abisso.",
    "Il giocatore si dirige verso il vulcano Dente dell'Abisso.",
  ])

  const [life, setLife] = useState('5/5')
  const [inventory, setInventory] = useState([
    'Pozione di cura',
    'Mappa della zona',
  ])

  const onActionClick = (action: string) => {
    console.log({ action })
    setChapter(chapter + 1)
    setIsLoadingGameState(true)

    postGenerateText({
      current_state: currentSituation,
      action,
      history,
      life,
      inventory,
    }).then((data) => {
      setIsLoadingGameState(false)
      setHistory([...history, data.summary])
      setActions(data.actions)
      setCurrentSituation(data.outcome)
      setLife(data.life)
      setInventory(data.inventory)
    })
  }

  const renderActions = () => {
    if (isLoadingGameState) return <Spinner />

    return (
      <ul className='space-y-4'>
        {actions.map((action) => (
          <li key={action}>
            <button
              className='border-2 border-[#b34700] text-[#b34700] p-2 rounded-2xl font-semibold'
              onClick={() => onActionClick(action)}
            >
              {action}
            </button>
          </li>
        ))}
      </ul>
    )
  }

  const renderInventory = () => {
    return (
      <ul className='list-disc list-inside space-y-1'>
        {(inventory ?? []).map((item) => (
          <li key={item}>{item}</li>
        ))}
        <li>{life}</li>
      </ul>
    )
  }

  return (
    <div className='flex flex-col gap-8 text-center p-8'>
      {<span className='text-4xl'>{chapter}</span>}
      {isLoadingGameState ? (
        <Spinner />
      ) : (
        <>
          <span className='text-2xl'>{currentSituation}</span>
          {renderInventory()}
          {renderActions()}
        </>
      )}
    </div>
  )
}
