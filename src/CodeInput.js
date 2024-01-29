import './CodeInput.css';

const CodeInput = ({
  currentGuess=[],
  onChange,
  onGuess,
  colors=[]
})=>{
  return (
    <div className='CodeInput' data-testid='CodeInput'>
      <ul>
        { currentGuess.map((dot, i) => (
          <li key={i}>
            <svg
              onClick={()=> onChange([
                ...currentGuess.slice(0, i),
                (currentGuess[i] + 1) % colors.length,
                ...currentGuess.slice(i+1)
              ])}
              role='dot'
              viewBox='0 0 50 50'>
              
              <circle
                cx='25' cy='25' r='24'
                fill={colors[dot]} />
            </svg>
          </li>
        )) }
      </ul>
      <button onClick={onGuess}>Guess</button>
    </div>
  );
};

export default CodeInput;
