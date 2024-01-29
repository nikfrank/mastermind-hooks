import './GameBoard.css';

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
