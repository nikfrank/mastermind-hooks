import {
  render,
  within,
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
    
    expect( onChange.mock.calls[0][0] )
      .toEqual(outputs[i]);
    
    onChange.mockClear();
  });
});
