export default code => guess => {
  const bulls = guess.filter((g, i)=> g === code[i]).length;

  const remainderGuess = guess.filter((g, i)=> g !== code[i]);
  const remainderCode = code.filter((s, i)=> s !== guess[i]);

  const guessBins = remainderGuess.reduce((bins, g)=> ({
    ...bins,
    [g]: (bins[g] ?? 0) + 1,
  }), {});

  const codeBins = remainderCode.reduce((bins, c)=> ({
    ...bins,
    [c]: (bins[c] ?? 0) + 1,
  }), {});

  const cows = Object.keys(guessBins).reduce((total, g)=> (
    total + Math.min( codeBins[g] ?? 0, guessBins[g] )
  ), 0);

  return [bulls, cows];
};
