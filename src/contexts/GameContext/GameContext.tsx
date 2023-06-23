import { FC, ReactElement, createContext, useReducer } from 'react'
import { GameActions, GameState } from './GameTypes'
import { GameReducer } from './GameReducer'


export const initialState : () => GameState = () => { return {
  cards: [
    '🍺',
    '🍻',
    '🥂',
    '🍷',
    '🥃',
    '🍸',
    '🍹',
    '🧉',
    '🍺',
    '🍻',
    '🥂',
    '🍷',
    '🥃',
    '🍸',
    '🍹',
    '🧉',
  ].map((symbol) => ({
    symbol: symbol,
    isGuessed: false,
  }))
  .map((c) => ({ val: c, order: Math.random() }))
  .sort((a, b) => a.order - b.order)
  .map((o) => ({ ...o.val })),
  flippedCards: [undefined, undefined],
  waitForTurn: false,
  startTime: new Date(),
  movesCounter: 0,
}};

export const GameContext = createContext<
  GameState & { dispatch: React.Dispatch<GameActions> }
>({
  cards: [],
  flippedCards: [undefined, undefined],
  startTime: new Date(),
  movesCounter: 0,
  waitForTurn: false,
  dispatch: () => undefined,
})

type Props = {
  children?: ReactElement
}
export const GameContextProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(GameReducer, initialState())

  const gameContext: GameState & { dispatch: React.Dispatch<GameActions> } = {
    ...state,
    dispatch,
  }

  return <GameContext.Provider value={gameContext}>{children}</GameContext.Provider>
}
