import { initialState } from './GameContext'
import { GameActions, GameFeeback, GameState } from './GameTypes'

export const GameReducer = (state: GameState, action: GameActions): GameState => {
  console.log('action: ', action)
  const result = GameReducerInner(state, action)
  console.log('after: ', result)
  return result
}

const GameReducerInner = (state: GameState, action: GameActions): GameState => {
  switch (action.type) {
    case 'StartGame':      
      return initialState()        

    case 'FlipCard':
      // if card is flipped or guessed: return
      const targetCard = state.cards[action.cardIdx]
      if (
        state.flippedCards[0] === action.cardIdx ||
        targetCard.isGuessed ||
        state.waitForTurn
      ) {
        return state
      }

      const newFlippedCards: [number | undefined, number | undefined] = [
        ...state.flippedCards,
      ]

      // Flip card
      if (state.flippedCards[0] === undefined && state.flippedCards[1] === undefined) {
        newFlippedCards[0] = action.cardIdx
      } else if (
        state.flippedCards[0] !== undefined &&
        state.flippedCards[1] === undefined
      ) {
        newFlippedCards[1] = action.cardIdx
      }

      return {
        ...state,
        movesCounter: state.movesCounter + 1,
        flippedCards: newFlippedCards,
        waitForTurn: newFlippedCards[1] !== undefined,
        feedback: undefined,
      }

    case 'FlipCardReaction':
      if (state.flippedCards[1] === undefined) {
        return state
      }

      const newCards = [...state.cards.map((c) => ({ ...c }))]
      let isMatch = false

      // Determine if we're after 2nd move - check if 2 identical cards were found, set isGuessed
      if (
        state.flippedCards[0] !== undefined &&
        state.flippedCards[1] !== undefined &&
        newCards[state.flippedCards[0]].symbol === newCards[state.flippedCards[1]].symbol
      ) {
        newCards[state.flippedCards[0]].isGuessed = true
        newCards[state.flippedCards[1]].isGuessed = true
        isMatch = true
      }

      const isGameWon = newCards.every((c) => c.isGuessed)

      return {
        ...state,
        cards: newCards,
        flippedCards: [undefined, undefined],
        waitForTurn: isGameWon,
        feedback: GetGameFeedback(isGameWon, isMatch),
      }
    default:
      return state
  }
}

const GetGameFeedback = (isGameWon: boolean, isMatch: boolean) => {
  return isGameWon ? GameFeeback.GameWon : isMatch ? GameFeeback.Match : GameFeeback.Miss
}
