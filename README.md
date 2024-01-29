# mastermind game with redux

a course by nik frank, based on [the board game](https://www.google.com/search?q=mastermind+game)

## game background

in the game, one player (here the computer) chooses a secret code and the other player will try to guess it

in the board game the secret code takes the form of coloured dots (we can think of them as numerical digits)

the player who made the secret "grades" or "scores" the guess with two numbers (manifest on the board game with black and white dots)

the two numbers represent:

 - the number of digits in the guess which are correct - exact matches to the secret code

 - of the remaining incorrect digits - under rearrangement - what is the maximum number that could be made correct

here, the secret creator / grader will be handled by the computer - our user will be the guesser


## agenda

our goal is to build a fully tested fully responsive fully deployed game.

we will use the following technologies:

- react
- redux
- css / flexbox
- jest

completion of the course will establish a student's completion of React fundamentals

### steps

- create a react app
- install redux
- build a component for user input of a code guess
  - test it to 100% coverage
- write callbacks and reducers for user input
  - test them as units and as part of the component
- write a function to compute a guess-score
  - test it as a unit
- write a component for displaying previous guesses / scores
  - test it with jest
- write a callback and reducer for guessing
  - test the user flow for guessing
- test the end-game logic
  - implement the end-game and loop


test types:

1) unit tests - for pure functions such as reducers; input params -> test output from function
2) unit render tests - pure components without redux; input props -> test output JSX
3) behavioural tests - combined application component tested with mock user events testing user flows

there is much discussion and debate in the industry about what we should call different types of tests, what they actually test, and what value they create.

here, we will write two different types of unit tests (unit refers to testing a pure function) - one for functions that aren't returning JSX, and one for functions which do (aka components)

both are structured the same:
 - define test case by function inputs
 - operate the function by calling it with the inputs so defined
 - expect the output of the function to be correct

1) the components will be our bottom level prop-> render components (not our App component)

2) the functions will be the reducers and selectors we define to use redux


and one type of integration test - simulated user behaviour with the view level component (App) having the two units as defined above "integrated" for user experience.

the structure here is similar:
 - define test case by initiating a store and rendering the component with such store "provided"
 - operate the application by simulating user events
 - expect the output of the application (rendered content, function callbacks) to be correct


(next steps)

- deploy the game via CI-CD pipeline
  - break a test, deployment fails
  - fix the test, deployment succeeds

(bonus features)

- allow the increase of difficulty via
  - longer secret code
  - more available colors (base digits)


## getting started

`$ npx create-react-app mastermind`

`$ cd mastermind`

`$ npm i -S redux react-redux`

`$ npm start`


[read a bit on the redux docs](https://redux.js.org/)

[and a bit from the react-redux docs](https://react-redux.js.org/introduction/quick-start)

let's focus more on writing the code to see it run than something some dude on the internet is saying

in this course, I will be following the pattern I've used since 2016 in redux, which is similar to what is accomplished nowadays by `'@reduxjs/toolkit'` slices. This is a fundamentals course, so I'd rather write everything independently as much as possible - besides, their api has the word "configure" in it, which I abhor.

The experience you gain writing it all from scratch will be applicable if you choose to use [or join a project using] slices. Plus, you'll know how it works on the inside a little bit!

```
   If you wish to make an apple pie from scratch, you must first invent the universe

        - Carl Sagan

```


### putting together react and the redux store

`$ touch src/store.js`


here we'll initialize a redux store using a POJO (not a switch)

<sub>./src/store.js</sub>
```js
import { createStore } from 'redux';

export const reducers = {
  
};

export const identity = i => i;


export const reducer = (state, action)=> (
  reducers[action.type] || identity
)(state, action);


export default createStore(reducer);
```


and here we'll use the off the shelf `react-redux` configuration


<sub>./src/index.js</sub>
```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import store from './store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```


now let's initialize our state and connect our `App` to the store

<sub>./src/store.js</sub>
```js
import { createStore } from 'redux';


export const initState = {
  code: [1, 2, 3, 4],
};


export const reducers = {
  
};

export const identity = i => i;


export const reducer = (state = initState, action)=> (
  reducers[action.type] || identity
)(state, action);


export default createStore(reducer);
```


<sub>./src/App.js</sub>
```js
import { useSelector } from 'react-redux';

function App() {

  const code = useSelector(state => state.code);
  
  return (
    <div className='App'>
      {code}
    </div>
  );
}

export default App;
```


when running the webpack dev server (`$ npm start`) we should now see our code `1234` rendered


### testing our setup

now that our state and our component are separate, we can test them separately

`$ touch src/store.test.js`


at first we'll just test that the initialization is done correctly


<sub>./src/store.test.js</sub>
```js
import store from './store';

it('has an initial state', ()=>{
  const initState = store.getState();

  expect(typeof initState).toEqual('object');

  expect(Array.isArray(initState.code)).toEqual(true);
});
```

this will be where we write our unit tests for the reducers


we can also start our "integration" test for the `<App/>` component

<sub>./src/App.test.js</sub>
```js
import { render } from '@testing-library/react';
import App from './App';

import { Provider } from 'react-redux';
import store, { initState } from './store';

test('renders a code', () => {
  const element = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const codeText = element.getByText(initState.code.join(''));
  expect(codeText).toBeInTheDocument();
});
```


check out the create-react-app default testing library for react components [here](https://testing-library.com/docs/react-testing-library/intro/)



from another command line session in the project directory:

`$ npm run test`


we should see that our tests all pass!


## the user input component


`$ touch src/CodeInput.js src/CodeInput.test.js`

<sub>./src/CodeInput.test.js</sub>
```js
import { render } from '@testing-library/react';
import CodeInput from './CodeInput';

test('renders a code input', () => {
  return;
  
  const element = render(
    <CodeInput />
  );
  
  const guessButtonByRole = element.getByRole('button');
  expect(guessButtonByRole).toBeInTheDocument();

  // we can also select by the text shown to the user

  const guessButtonByText = element.getByText('Guess');
  expect(guessButtonByText).toBeInTheDocument();

  // or better yet - by both... using the "accessibility name" here the text

  const guessButton = element.getByRole('button', { name: 'Guess' });
  expect(guessButton).toBeInTheDocument();
  
});
```

this test should fail (red)


<sub>./src/CodeInput.js</sub>
```js
const CodeInput = ()=>{

  return (
    <button>Guess</button>
  );
};

export default CodeInput;
```

now the teset passes again! (green)

now we're ready to TDD this component into existence!

TDD (Test Driven Development) is a pattern of work where all program code is written to make a failing test pass.

the flow is known as "red, green, refactor"

 - red: the test is written and it fails, as the program feature has not been written
 - green: the test now succeeds, because the program feature has been written
 - refactor: the test ensures the feature remains stable while we make our code better

often, we use this pattern to develop the complicated or algorithmic part of our applications

in this lesson, we'll write the entire game TDD as a kata


### what does this thing do again?

our `CodeInput` will need to display the current code value, and let the user click each dot in the current guess to change it (right now we'll test if the callback is called).

firstly though, that guess button should respond to clicks!


#### testing a click

here we'll use jest's spy functions to test if our prop function gets a callback

<sub>./src/CodeInput.test.js</sub>
```js
import {
  render,
  fireEvent,
} from '@testing-library/react';

import CodeInput from './CodeInput';

test('renders a code input with a guess button', () => {
  const onGuess = jest.fn();
  
  const element = render(
    <CodeInput
      onGuess={onGuess}
    />
  );

  const guessButton = element.getByRole('button', { name: 'Guess' });
  expect(guessButton).toBeInTheDocument();

  expect( onGuess ).toHaveBeenCalledTimes( 0 );
  fireEvent.click(guessButton);
  expect( onGuess ).toHaveBeenCalledTimes( 1 );
});
```

now our test should fail that the mock wasn't called (red)


we can make that pass pretty easily by adding an `onClick` callback prop for `onGuess`


<sub>./src/CodeInput.js</sub>
```js
const CodeInput = ({
  onGuess,
})=>{

  return (
    <button onClick={onGuess}>Guess</button>
  );
};

export default CodeInput;
```

(green!)

so far so good, we don't really need a refactor, so let's move on to the next feature


#### check for code dots

our user should be able to see the current guess as a series of coloured circles


<sub>./src/CodeInput.test.js</sub>
```js
import {
  render,
  within,
  fireEvent,
} from '@testing-library/react';

import CodeInput from './CodeInput';

//...

test('renders the current guess', () => {

  const initGuess = [0, 1, 2, 3, 4];

  const colors = [
    'red',
    'green',
    'blue',
    'yellow',
    'magenta'
  ];
  
  const element = render(
    <CodeInput
      currentGuess={initGuess}
      colors={colors}
    />
  );

  
  const guessDots = element.getAllByRole('listitem');
  expect( guessDots.length ).toEqual( initGuess.length );

  guessDots.forEach((guessDot, i) => {
    const dot = within(guessDot).getByRole('dot');

    const dotFillColor = dot.innerHTML.match(/fill="\w+"/)[0];

    expect(dotFillColor)
      .toEqual(`fill="${colors[initGuess[i]]}"`);
  });
});
```

now our test is failing (red)

so we'll need to program the `currentGuess` and `colors` props to do as directed by the test


<sub>./src/CodeInput.js</sub>
```js
const CodeInput = ({
  currentGuess=[],
  onGuess,
  colors=[]
})=>{
  return (
    <>
      <ul>
        { currentGuess.map((dot, i) => (
          <li key={i}>
            <svg
              role='dot'
              viewBox='0 0 50 50'>
              
              <circle
                cx='25' cy='25' r='25'
                fill={colors[dot]} />
            </svg>
          </li>
        )) }
      </ul>
      <button onClick={onGuess}>Guess</button>
    </>
  );
};

export default CodeInput;
```

great! our test passes (green)

--> we still haven't rendered a `<CodeInput />` into our browser, but we know that it works



#### change the guess


the user should be able to click the dots to change them

furthermore, when the user gets to the end of the list of colors, we should loop


<sub>./src/CodeInput.test.js</sub>
```js
//...

test('can change the guess', () => {

  const initGuess = [0, 1, 2, 3, 4];

  const outputs = [
    [1, 1, 2, 3, 4],
    [0, 2, 2, 3, 4],
    [0, 1, 3, 3, 4],
    [0, 1, 2, 4, 4],
    [0, 1, 2, 3, 0],
  ];

  const colors = [
    'red',
    'green',
    'blue',
    'yellow',
    'magenta'
  ];
  
  const onChange = jest.fn();
  
  const element = render(
    <CodeInput
      currentGuess={initGuess}
      onChange={onChange}
      colors={colors}
    />
  );

  
  const guessDots = element.getAllByRole('listitem');
  expect( guessDots.length ).toEqual( initGuess.length );

  guessDots.forEach((guessDot, i) => {
    const dot = within(guessDot).getByRole('dot');

    expect(onChange).toHaveBeenCalledTimes( 0 );
    
    fireEvent.click(dot);

    expect(onChange).toHaveBeenCalledTimes( 1 );
    
    expect( onChange.mock.calls[0][0] ).toEqual(outputs[i]);
    
    onChange.mockClear();
  });
});
```

the feature specification is simple enough - we need an onclick on the dot svg element

and it should callback `onChange` with a new guess

```js
const CodeInput = ({
  //...
  onChange,
  //...

            <svg
              onClick={()=> onChange([
                ...currentGuess.slice(0, i),
                (currentGuess[i] + 1) % colors.length,
                ...currentGuess.slice(i+1)
              ])}
              role='dot'
              viewBox='0 0 50 50'>
              
  //...
```

that'll turn our test green - now it's time to refactor

(for the sake of brevity, I've cut the iterations of the callback computation I coded and refactored)

(( NB -> here link to js-tactics exercises for arrays ))



### coverage

let's see what our testing coverage looks like

`$ npm run test -- --coverage --watchAll=false`


pretty pretty good.

this is a key output from our testing that gives us a rough idea of how thorough our tests are

(( in the cloud ci-cd section, we will use this to trigger build warnings / etc ))



### bringing the CodeInput to App


so far, we've tested, then programmed a user input, and we haven't even seen it yet!

let's write a test in our `App` integration suite that will make sure our user can see the `CodeInput` and use it



<sub>./src/App.test.js</sub>
```js
//... delete the initial test, as we don't want to show the secret code to the user

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
});
```

ok so we have a red test

now we'll need to add the `data-testid` to the root element of the `<CodeInput />`

and we also duplicate the testing logic for checking that there's a Guess button

(I am personally happy to have a small amount of duplication in tests, as it maintains a simple style)

<sub>./src/CodeInput.js</sub>
```js
//...

  return (
    <div data-testid='CodeInput'>

      //...

    </div>
  );
};

//...
```

<sub>./src/App.js</sub>
```js
//...

import CodeInput from './CodeInput';

const colors = [
  'red',
  'green',
  'blue',
  'yellow',
  'magenta'
];

function App() {

  const code = useSelector(state => state.code);
  
  return (
    <div className='App'>
      <CodeInput
        currentGuess={[0,1,2,3,4]}
        colors={colors}
      />
    </div>
  );
}

export default App;
```

that'll turn the test green, so we can take a quick break from TDD to style the component

there are some frameworks nowadays for testing that functional aspects of style work (automation frameworks like cypress / puppeteer)

that isn't really the topic in this lesson, we're really only styling the game so that we can play it!



### a little bit of CSS

`$ touch src/CodeInput.css`

<sub>./src/CodeInput.js</sub>
```js
import './CodeInput.css';

//... reduce the r to 24 to make space for a border

              <circle
                cx='25' cy='25' r='24'
                fill={colors[dot]} />

//...
```

<sub>./src/CodeInput.css</sub>
```css
.CodeInput {
  display: flex;
  flex-direction: row;

  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}


.CodeInput button {
  width: 20%;
}

.CodeInput ul {
  width: 80%;
  padding: 0 20vw;
  list-style: none;

  display: flex;
  flex-direction: row;
}

.CodeInput ul li {
  flex-grow: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 1vw;
}

.CodeInput svg {
  height: 100%;
  width: auto;
}

.CodeInput svg circle {
  stroke: black;
  stroke-width: 1px;
}
```

that'll do for now

at least we can see what we're doing!

now let's get back to feature dev, by writing reducers to allow the user to change their guess - and to connect it to the `<CodeInput />` we rendered in the previous section

but first of course, we have to write a failing test!


### now the user can guess


<sub>./src/App.test.js</sub>
```js
import {
  render,
  fireEvent,
  within,
} from '@testing-library/react';

//...


const readGuess = dots => dots
  .map(dot => dot.innerHTML.match(/fill="\w+"/)[0])
  .map(fill => fill.slice(6, -1))
  .map(color => initState.colors.indexOf(color));

test('allows the user to guess', () => {
  const element = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // read the current guess using a CodeInput driver fn

  // check that it === store.initState.guess

  const guessDots = within(codeInput).getAllByRole('dot');
  const userGuess = readGuess(guessDots);

  expect( userGuess ).toEqual( initState.guess );
});
```

we've written a "page driver" style function to read the guess from the queried `<li/>` dots

then read out the initial guess, check it (red)

so we have to read the guess (and colors) from the state

<sub>./src/store.js</sub>
```js
//...

export const initState = {
  code: [0, 1, 2, 3, 4],
  guess: [0, 0, 0, 0, 0],
  colors: [
    'red',
    'green',
    'blue',
    'yellow',
    'magenta'
  ],
};

//...
```

<sub>./src/App.js</sub>
```js
import { useSelector } from 'react-redux';

import CodeInput from './CodeInput';

function App() {

  const code = useSelector(state => state.code);

  const colors = useSelector(state => state.colors);
  const currentGuess = useSelector(state => state.guess);
  
  return (
    <div className='App'>
      <CodeInput
        currentGuess={currentGuess}
        colors={colors}
      />
    </div>
  );
}

export default App;
```

now that's green, so we can add another step in our test

<sub>./src/App.test.js</sub>
```js
//...

  // click one of them once

  // read the guess again

  fireEvent.click(guessDots[0]);

  const newGuessDots = element.getAllByRole('dot');
  const newUserGuess = readGuess(newGuessDots);

  expect( newUserGuess ).toEqual([
    (initState.guess[0] + 1) % initState.colors.length,
    ...initState.guess.slice(1),
  ]);

});
```

we click the first dot

and expect that the guess has changed - but it hasn't! (red)

now we need to program our application to change the redux state when it's clicked



<sub>./src/App.js</sub>
```js
import { useSelector, useDispatch } from 'react-redux';

import CodeInput from './CodeInput';

function App() {

  const code = useSelector(state => state.code);

  const colors = useSelector(state => state.colors);
  const currentGuess = useSelector(state => state.guess);

  const dispatch = useDispatch();
  
  return (
    <div className='App'>
      <CodeInput
        currentGuess={currentGuess}
        colors={colors}
        onChange={nextGuess => dispatch({
          type: 'setGuess',
          payload: nextGuess,
        })}
      />
    </div>
  );
}

export default App;
```

which on its own will do nothing -> we need to add a reducer to make this work!


<sub>./src/store.js</sub>
```js
//...

export const reducers = {
  setGuess: (state, action)=> ({
    ...state,
    guess: action.payload,
  }),
};

//...
```

now let's test the edge case where the user clicks all the way around back to 0

<sub>./src/App.test.js</sub>
```js
//...

  // click one of them store.initState.colors.length times

  // see that it goes back around

  for(let j=0; j<initState.colors.length-1; j++)
    fireEvent.click(newGuessDots[0]);

  const finalGuessDots = element.getAllByRole('dot');
  const finalUserGuess = readGuess(finalGuessDots);

  expect(finalUserGuess).toEqual(initState.guess);
});
```

which should be green anyhow.

we can look in the browser, and see that the `<CodeInput />` works fine, until we try to guess!

guessing should progress the game of course - so now we need to write our guess scoring logic (test first!) and the feature for adding guesses to the board along with their score




### unit testing the guess-scoring logic


`$ touch src/score.js src/score.test.js`

<sub>./src/score.js</sub>
```js
export default ()=> 0;
```

let's unit test the scoring function

we'll do that by first writing some test cases

<sub>./src/score.test.js</sub>
```js
import score from './score';

test('scoring the guess', ()=> {
  const code = [1, 2, 3, 4, 0];

  const guesses = [
    [4, 3, 2, 1, 3],
    [5, 5, 5, 5, 5],
    [2, 2, 2, 2, 2],
    [2, 2, 2, 3, 3],
    [1, 2, 3, 3, 3],
    [1, 2, 3, 4, 4],
    [1, 2, 3, 4, 0],
  ];

  const scores = [
    [0, 4],
    [0, 0],
    [1, 0],
    [1, 1],
    [3, 0],
    [4, 0],
    [5, 0],
  ];

  const output = guesses.map(score(code));

  output.forEach((o, i)=> expect( o ).toEqual( scores[i] ) )
});
```

this is a nice thoroughly red test


#### currying

let's write a curried function for getting the score

<sub>./src/score.js</sub>
```js
export default code => guess => {
  
};
```

now we get back a reasonable error as our tests fail



and now we can write a logic for the scoring


```
for every digit which is eactly the same, add one to the first score number (black dots)

from the digits remaining, find the number of colors that matched in the wrong position
  - for each digit which was matched this way, add one to the second score number (white)
```

as a callback to the traditional names, exact matches we can call bulls and out-of-place matches we can call cows... much more inclusive language.

first let's count the exact matches


<sub>./src/score.js</sub>
```js
export default code => guess => {
  const bulls = guess.filter((g, i)=> g === code[i]).length;

```


then we'll compute the remaining digits


```js
  const remainderGuess = guess.filter((g, i)=> g !== code[i]);
  const remainderCode = code.filter((s, i)=> s !== guess[i]);
  
```

then we'll count how many of each digit we have left

```js
  const guessBins = remainderGuess.reduce((bins, g)=> ({
    ...bins,
    [g]: (bins[g] ?? 0) + 1,
  }), {});

  const codeBins = remainderCode.reduce((bins, c)=> ({
    ...bins,
    [c]: (bins[c] ?? 0) + 1,
  }), {});

```

then we'll add up all the matches

```js
  const cows = Object.keys(guessBins).reduce((total, g)=> (
    total + Math.min( codeBins[g] ?? 0, guessBins[g] )
  ), 0);

  return [bulls, cows];
};

```

not too complicated - now your test should be green



#### edge cases

let's make sure we add some more test cases to cover scenarios where the secret code has duplicates in it


<sub>./src/score.test.js</sub>
```js
test('scores the guess with duplicates in the code', ()=> {
  const code = [2, 2, 3, 3];

  const guesses = [
    [4, 3, 2, 1],
    [5, 5, 5, 5],
    [2, 2, 2, 2],
    [2, 2, 2, 3],
    [1, 3, 2, 3],
    [2, 2, 3, 3],
  ];

  const scores = [
    [0, 2],
    [0, 0],
    [2, 0],
    [3, 0],
    [1, 2],
    [4, 0],
  ];

  const output = guesses.map(score(code));

  output.forEach((o, i)=> expect( o ).toEqual( scores[i] ) )
});
```


now that we have a scoring function that we're confident in, we can go ahead and work on the main game loop feature




### test to click guess button

here we'll expect the guess and score to be saved to the state when the user clicks "Guess"

and the guess to be rendered along with its score


<sub>./src/App.test.js</sub>
```js
//...

import score from './score';

//...


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
```

now we have a red test, we can code a reducer to make a guess

<sub>./src/App.js</sub>
```js
//...

      <CodeInput
        currentGuess={currentGuess}
        colors={colors}
        onChange={nextGuess => dispatch({
          type: 'setGuess',
          payload: nextGuess,
        })}
        onGuess={()=> dispatch({ type: 'guess' })}
      />


//...
```


<sub>./src/store.js</sub>
```js
//...

import score from './score';

export const initState = {
  //...
  guesses: [],
  scores: [],
};


export const reducers = {
  //...

  guess: (state, action)=> ({
    ...state,
    guesses: [...state.guesses, [...state.guess]],
    scores: [...state.scores, score(state.code)(state.guess)],
  }),
};

//...
```

now our test is green, so we'll need another test to show the guess and score to the user


### displaying the guesses

<sub>./src/App.test.js</sub>
```js
//...

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

//...


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
```

excellent - we have a failing test for displaying guesses and scores

the assumption here is that the guesses will be a list, and each of the guess items will contain the score box for that guess


`$ touch ./src/GameBoard.js ./src/GameBoard.css`

<sub>./src/GameBoard.js</sub>
```js
const GameBoard = ({
  guesses,
  scores,
  colors,
})=> (
  <div className='game-container'>
    <div data-testid='guesses' className='guesses'>
      {
        guesses.map((guess, i)=> (
          <ul key={i} role='guess'>
            {guess.map((g, gi)=> (
              <li key={gi}>
                <svg
                  role='dot'
                  viewBox='0 0 50 50'>
                  
                  <circle
                    cx='25' cy='25' r='24'
                    fill={colors[g]} />
                </svg>
              </li>
            ))}

            <li key='score' className='scorebox'>
              <ul>
                {Array(scores[i][0]).fill(0).map((o, j)=> (
                  <li key={'bull' + j} >
                    <svg
                      role='score-dot'
                      viewBox='0 0 24 24'>
                      
                      <circle
                        cx='12' cy='12' r='11'
                        fill='black' />
                    </svg>
                  </li>
                ))}
                {Array(scores[i][1]).fill(0).map((o, j)=> (
                  <li key={'cow' + j}>
                    <svg
                      role='score-dot'
                      viewBox='0 0 24 24'>
                      
                      <circle
                        cx='12' cy='12' r='11'
                        fill='pink' />
                    </svg>
                  </li>
                ))}

                {Array(
                  guess.length - 
                  scores[i][0] -
                  scores[i][1]
                ).fill(0).map((o, j)=> (
                  <li key={'empty' + j} className='empty'>
                    <svg
                      role='score-dot'
                      viewBox='0 0 24 24'>
                      
                      <circle
                        cx='12' cy='12' r='11'
                        fill='transparent' />
                    </svg>
                  </li>
                ))}
              </ul>
            </li>
            
          </ul>
        ))
      }
    </div>
  </div>
);

export default GameBoard;
```



### styling the dots

<sub>./src/GameBoard.css</sub>
```css
.game-container {
  display: flex;
  flex-direction: row;

  max-height: 80vh;
  overflow-y: auto;
}

.guesses {
  width: 100%;
}

.guesses > ul {
  padding: 0;
  margin: 0;
  list-style: none;

  display: flex;
  flex-direction: row;
}

.guesses > ul > li {
  flex-grow: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 1vw;
}

.guesses svg {
  height: 100%;
  width: auto;
}

.guesses svg circle {
  stroke: black;
  stroke-width: 1px;
}

.guesses .empty circle {
  stroke: transparent;
}

.scorebox {
  flex-grow: 1;
  max-width: 20%;
}

.scorebox ul {
  list-style: none;
  padding: 0;
  margin: 0;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.scorebox ul li {
  width: 3vw;
  height: 3vw;

  margin: 0;
  flex-basis: 50%;
}
```






(( this section left for the ci-cd section as a feature to deploy therein ))


## start game and end game


### end game

we want to test here that when the score is `[*, 0]` that the guess button is replaced


<sub>./src/App.test.js</sub>
```js

it('ends the game', ()=>{
});
```


and to pass the test we can do

<sub>./src/App.js</sub>
```js
```



now we need a test to check that the new game clears the scores and guesses and picks a new secret


<sub>./src/App.test.js</sub>
```js

```

so to pass this test, we'll need another reducer and action (which will each need tests)


<sub>./src/store.test.js</sub>
```js
it('makes a new game', ()=>{

});
```

now we can write the reducer and action to pass this test


<sub>./src/store.js</sub>
```js
//... in reducers

  newGame: (state, action)=> ({
    ...state,
    guesses: [],
    scores: [],
    code: Array(state.code.length).fill(0).map(()=> Math.floor( Math.random()*6 ) ),
  }),


//...
```

that'll pass the store test


<sub>./src/App.js</sub>
```js
       <button className='new-game' onClick={newGame}>NEW GAME</button>
```


### coverage

let's check our coverage!

100%

because we're perfect.



## deployment and styling

we may have neglected to style our app for our users during all that testing


so now that there's tests, you may style your app (as long as the tests still pass at 100%)


### deployment

