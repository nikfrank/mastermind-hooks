import { createStore } from 'redux';

import score from './score';

export const initState = {
  code: [0, 1, 2, 3, 4].map(()=> Math.floor(Math.random()*5)),
  guess: [0, 0, 0, 0, 0],
  colors: [
    'red',
    'green',
    'blue',
    'yellow',
    'magenta'
  ],
  guesses: [],
  scores: [],
};

export const reducers = {
  setGuess: (state, action)=> ({
    ...state,
    guess: action.payload,
  }),

  guess: (state, action)=> ({
    ...state,
    guesses: [...state.guesses, [...state.guess]],
    scores: [...state.scores, score(state.code)(state.guess)],
  }),
};

export const identity = i => i;


export const reducer = (state = initState, action)=> (
  reducers[action.type] || identity
)(state, action);


export default createStore(reducer);
