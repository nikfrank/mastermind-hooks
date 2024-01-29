import { useSelector, useDispatch } from 'react-redux';

import CodeInput from './CodeInput';
import GameBoard from './GameBoard';

function App() {

  const code = useSelector(state => state.code);
  
  const guesses = useSelector(state => state.guesses);
  const scores = useSelector(state => state.scores);

  const colors = useSelector(state => state.colors);
  const currentGuess = useSelector(state => state.guess);

  const dispatch = useDispatch();
  
  return (
    <div className='App'>

      <GameBoard
        guesses={guesses}
        scores={scores}
        colors={colors}
      />

      <CodeInput
        currentGuess={currentGuess}
        colors={colors}
        onChange={nextGuess => dispatch({
          type: 'setGuess',
          payload: nextGuess,
        })}
        onGuess={()=> dispatch({ type: 'guess' })}
      />
    </div>
  );
}

export default App;
