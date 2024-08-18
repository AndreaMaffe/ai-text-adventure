const BASE_SCENARIO = `
  Lo scenario è il seguente: il giocatore si sta dirigendo verso il Dente dell'Abisso, un antico vulcano attivo,
  per uccidere il malvagio drago nero Verthax che ci dimora.\n\n
`

const INFO = `\n
  Queste sono le informazioni in tuo possesso sul giocatore:
  - Il giocatore si chiama Carrix
  - Il giocatore è un uomo molto agile e percettivo
  - Il giocatore è in possesso dei seguenti oggetti:
  - arco e frecce
  - corda (9m)
  - pozione curativa (una sola)
  - provviste per un mese
  \n
`

let LAST_SITUATION = `
  Carrix si trova nel bosco, a un giorno di distanza dal vulcano.
`

type NewScenarioInput = {
  baseScenario?: string
  info?: string
  history: string
  lastSituation?: string
  actions: string
  actionNumber: number
  life: number
}

const getPromptForNewSituation = ({
  baseScenario = BASE_SCENARIO,
  info = INFO,
  history,
  lastSituation = LAST_SITUATION,
  actions,
  actionNumber,
  life,
}: NewScenarioInput): string => {
  const output = getActionOutput(life)
  console.log('\nAzione andata ' + output + '\n')

  return (
    baseScenario +
    info +
    'Questo è quanto accaduto fino ad ora:' +
    history +
    'Questa è la situazione corrente:\n' +
    lastSituation +
    'Queste sono le possibili azioni che il giocatore può scegliere:\n' +
    actions +
    "il giocatore sceglie l'azione numero " +
    actionNumber +
    '\n' +
    "Se l'azione può finire bene o male, in questo caso finisce " +
    output +
    '.\n' +
    'Descrivi in modo avvincente cosa succede (max 10 righe)' +
    '\nSe il giocatore muore o Verthax viene ucciso, concludi con [FINE DEL GIOCO]'
  )
}

type NewActionsInput = {
  baseScenario?: string
  info?: string
  history: string
  lastSituation?: string
}

const getPromptForNewActions = ({
  baseScenario = BASE_SCENARIO,
  info = INFO,
  history,
  lastSituation = LAST_SITUATION,
}: NewActionsInput): string =>
  'Stai creando un videogioco ad avventura testuale. Prendi questo scenario:\n' +
  baseScenario +
  'Questo è quanto accaduto fino ad ora:' +
  history +
  info +
  'Questa è la situazione corrente:\n' +
  lastSituation +
  `
    Elabora 4 possibili azioni che il giocatore potrebbe compiere nello scenario indicato.
    Ritorna le azioni come lista numerata nel seguente formato: [fai questo]: [descrizione di cosa fai].
  `

const getActionOutput = (life: number) => {
  const randomNumberBetween1And10 = Math.random() * 10

  if (randomNumberBetween1And10 > 8) return 'bene'
  if (randomNumberBetween1And10 > 6) return 'normale'
  if (randomNumberBetween1And10 > 4) return 'normale'
  if (randomNumberBetween1And10 > 2) return 'male, ma non gravemente'
  switch (life) {
    case 3:
      return 'molto male, e Carrix viene ferito'
    case 2:
      return 'molto male, e Carrix viene ferito molto gravemente (ma non muore)'
    default:
      return 'molto male, e Carrix muore'
  }
}

const getPromptForSynthesis = (situation: string) =>
  'Sei uno scrittore. Riassumi questo racconto:\n' +
  situation +
  '\n. Usa al massimo 12 parole. Se nel racconto Felix è stato ferito, inizia con il prefisso [DAMAGE]. Se nel racconto Felix si è curato le ferite, inizia con il prefisso [LIFE]'

export {
  getPromptForNewActions,
  getPromptForNewSituation,
  getPromptForSynthesis,
}
