import { callOpenRouter } from '@/lib/openrouter'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { action, history, life, inventory, current_state, player_info } =
    await req.json()

  let jsonResponse

  do {
    try {
      const aiResponse =
        (await callOpenRouter([
          {
            role: 'system',
            content:
              "Sei il narratore di un'avventura fantasy. Riceverai dall'utente un JSON con questi campi:\n\ncurrent_state: lo stato attuale del protagonista;\n\naction: la prossima azione che il protagonista intende compiere.\n\naction_outcome: 'good' se l'azione è andata bene, 'bad' se l'azione fallisce.\n\nhistory: l'intero racconto che hai già raccontato.\n\nplayer_info: info sul giocatore\n\nRitorna un JSON con i seguenti 5 campi:\n- outcome: racconto in massimo 1000 caratteri di quello che succede nell'azione successiva, nello stile di un romanzo fantasy, con descrizioni dettagliate di luoghi, oggetti e personaggi;\nsummary: un riassunto di 100 caratteri dell'outcome;\n- actions: array di quattro stringhe, con le possibili scelte che il protagonista potrebbe compiere, in formato [fai questo per ...];\n- inventory: inventory aggiornato;\n- life: vita totale del protagonista. \n\n-Ritorna solo il JSON, senza note o considerazioni aggiuntive.",
          },
          {
            role: 'user',
            content: JSON.stringify({
              current_state,
              action,
              action_outcome: Math.random() > 0.2 ? 'good' : 'bad',
              history,
              player_info: {
                life,
                inventory,
                name: player_info.name,
                race: player_info.race,
                class: player_info.class,
              },
            }),
          },
        ])) ?? ''

      console.log({ aiResponse })

      jsonResponse = JSON.parse(
        aiResponse.slice(
          aiResponse.indexOf('{'),
          aiResponse?.lastIndexOf('}') + 1
        )
      )
    } catch (err) {
      console.log({ err })
    }
  } while (!jsonResponse)

  return NextResponse.json(jsonResponse)
}
