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
  const [playerName, setPlayerName] = useState('')
  const [playerRace, setPlayerRace] = useState('')
  const [playerClass, setPlayerClass] = useState('')

  const [isLoadingGameState, setIsLoadingGameState] = useState(false)

  const [currentSituation, setCurrentSituation] = useState(
    'Sei in marcia. Il vento carico di cenere ti sferza il volto mentre avanzi sul sentiero di roccia nera che serpeggia verso il cuore del Dente dell’Abisso. Anthros ti attende. Il suo nome è sussurrato nei canti degli uomini e inciso nei ruderi delle città che ha incenerito. Un drago antico, un flagello, il signore del fuoco che ha trasformato le terre a valle in un deserto di cenere.'
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
    'Spada',
    'Arco e 10 frecce',
    'Provviste per un giorno',
  ])

  const onActionClick = (action: string) => {
    console.log({ action })
    setChapter(chapter + 1)
    setIsLoadingGameState(true)

    postGenerateText({
      current_state: currentSituation,
      action,
      history,
      player_info: {
        name: playerName,
        race: playerRace,
        class: playerClass,
      },
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
      <ul className='space-y-4 mt-8'>
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
      <div className='flex flex-col gap-2'>
        <span className='text-lg font-semibold'>{`Inventario:`}</span>
        <ul className='list-disc list-inside space-y-1'>
          {(inventory ?? []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    )
  }

  if (chapter === 0) {
    return (
      <PlayerEditor
        onStart={() => setChapter(1)}
        setPlayerName={setPlayerName}
        setPlayerRace={setPlayerRace}
        setPlayerClass={setPlayerClass}
      />
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
          <span className='text-lg font-semibold'>{`Salute: ${life}`}</span>
          {renderActions()}
        </>
      )}
    </div>
  )
}

const PlayerEditor = ({
  onStart,
  setPlayerName,
  setPlayerRace,
  setPlayerClass,
}: {
  onStart: () => void
  setPlayerName: (value: string) => void
  setPlayerRace: (value: string) => void
  setPlayerClass: (value: string) => void
}) => {
  return (
    <div className='flex flex-col gap-8 items-center p-8'>
      <span className='text-4xl'>Crea il tuo personaggio</span>
      <div className='grid grid-cols-2 gap-4 items-center'>
        <label htmlFor='name'>Nome</label>
        <input
          type='text'
          className='border-2 border-[#b34700] text-[#b34700] p-2 rounded-2xl font-semibold'
          placeholder='Nome'
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <label htmlFor='race'>Razza</label>
        <input
          type='text'
          className='border-2 border-[#b34700] text-[#b34700] p-2 rounded-2xl font-semibold'
          placeholder='es: "Elfo"'
          onChange={(e) => setPlayerRace(e.target.value)}
        />
        <label htmlFor='class'>Classe</label>
        <input
          type='text'
          className='border-2 border-[#b34700] text-[#b34700] p-2 rounded-2xl font-semibold'
          placeholder='es: "Guerriero"'
          onChange={(e) => setPlayerClass(e.target.value)}
        />
      </div>
      <button
        className='mt-8 w-28 bg-[#b34700] text-white p-2 rounded-2xl font-semibold'
        onClick={onStart}
      >
        Avvia
      </button>
    </div>
  )
}
