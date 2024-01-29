import {
  render,
  fireEvent,
  within,
} from '@testing-library/react';

import App from './App';

import { Provider } from 'react-redux';
import store, { initState } from './store';

import score from './score';

const readGuess = dots => dots
  .map(dot => dot.innerHTML.match(/fill="\w+"/)[0])
  .map(fill => fill.slice(6, -1))
  .map(color => initState.colors.indexOf(color));

const readScore = dots => {
  const results = dots
    .map(dot => dot.innerHTML.match(/fill="\w+"/)[0])
    .map(fill => fill.slice(6, -1))
    .map(color => ['black', 'pink'].indexOf(color));

  return [
    results.filter(r=> r === 0).length,
    results.filter(r=> r === 1).length,
  ];
};

test('shows the user the current guess', () => {
  const element = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  
  const codeInput = element.getByTestId('CodeInput');
  expect(codeInput).toBeInTheDocument();

  const guessButton = element.getByRole('button', { name: 'Guess' });
  expect(guessButton).toBeInTheDocument();

  const guessDots = within(codeInput).getAllByRole('dot');
  expect( guessDots.length ).toEqual( initState.code.length );

});

test('allows the user to guess', async () => {
  const element = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // read the current guess using a CodeInput driver fn

  // check that it === store.initState.guess

  const guessDots = element.getAllByRole('dot');
  const userGuess = readGuess(guessDots);

  expect( userGuess ).toEqual( initState.guess );

  
  // click one of them once

  // read the guess again

  fireEvent.click(guessDots[0]);

  const newGuessDots = element.getAllByRole('dot');
  const newUserGuess = readGuess(newGuessDots);


  expect( newUserGuess ).toEqual([
    (initState.guess[0] + 1) % initState.colors.length,
    ...initState.guess.slice(1),
  ]);

  // click one of them store.initState.colors.length times

  // see that it goes back around

  for(let j=0; j<initState.colors.length-1; j++)
    fireEvent.click(newGuessDots[0]);

  const finalGuessDots = element.getAllByRole('dot');
  const finalUserGuess = readGuess(finalGuessDots);

  expect(finalUserGuess).toEqual(initState.guess);
});


test('scores the user\'s guess', () => {
  const element = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const beforeState = store.getState();
  
  expect(beforeState.guesses).toHaveLength(0);
  expect(beforeState.scores).toHaveLength(0);
  
  const guessButton = element.getByRole('button', { name: 'Guess' });
  
  fireEvent.click(guessButton);

  const afterState = store.getState();
  
  expect(afterState.guesses).toHaveLength(1);
  expect(afterState.scores).toHaveLength(1);

  expect(afterState.scores[0])
    .toEqual(
      score(afterState.code)(afterState.guesses[0])
    );
});


test('displays guesses and scores to user', ()=>{
  const element = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const codeInput = element.getByTestId('CodeInput');
  
  const guessButton = element.getByRole('button', { name: 'Guess' });

  const guessDots = within(codeInput).getAllByRole('dot');
  
  fireEvent.click(guessDots[0]); // make sure there's a cow
  fireEvent.click(guessButton);

  const guessesContainer = element.getByTestId('guesses');

  const guesses = within(guessesContainer).getAllByRole('guess');

  expect( guesses ).toHaveLength( 2 ); // one from earlier

  // select within them all the dots

  guesses.forEach((guess, gi)=> {
    const dots = within(guess).getAllByRole('dot');
    expect(dots).toHaveLength( initState.code.length );

    const guessResult = readGuess(dots);
    const currentGuess = store.getState().guesses[gi];
    
    expect(guessResult).toEqual(currentGuess);

    // also for the score

    const scoreDots = within(guess).getAllByRole('score-dot');
    expect(scoreDots).toHaveLength( initState.code.length );

    const scoreResult = readScore(scoreDots);
    const currentScore = store.getState().scores[gi];

    expect( scoreResult ).toEqual( currentScore );
  });
});
