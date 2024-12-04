const matchesOnLine = (word: string, puzzleLine: string) => {
  const reverseWord = word.split("").reverse().join("");
  const matches = [
    ...puzzleLine.matchAll(
      new RegExp(word, "g"),
    ),
    ...puzzleLine.matchAll(
      new RegExp(reverseWord, "g"),
    ),
  ];
  return matches.length;
};

const columns = (puzzleLines: string[]) => {
  const width = puzzleLines[0].length;
  const height = puzzleLines.length;
  const columns = [];
  for (let col = 0; col < width; col++) {
    let column = "";
    for (let row = 0; row < height; row++) {
      column = `${column}${puzzleLines[row].charAt(col)}`;
    }
    columns.push(column);
  }
  return columns;
};

const diagonals = (puzzleLines: string[]) => {
  const width = puzzleLines[0].length;
  const height = puzzleLines.length;
  const diagonals = [];
  // Left to right
  for (let initialRow = 0; initialRow < height; initialRow++) {
    // When initial row is above 0 we don't need to increment initial column as we've done it on the first line
    const maxInitialCol = initialRow === 0 ? width : 1;
    for (let initialCol = 0; initialCol < maxInitialCol; initialCol++) {
      let diagonal = "";
      for (
        let col = initialCol, row = initialRow;
        col < width && row < height;
        col++, row++
      ) {
        diagonal = `${diagonal}${puzzleLines[row].charAt(col)}`;
      }
      diagonals.push(diagonal);
    }
  }
  // Right to left
  for (let initialRow = 0; initialRow < height; initialRow++) {
    // When initial row is above 0 we don't need to increment initial column as we've done it on the first line
    const minInitialCol = initialRow === 0 ? 0 : width;
    for (let initialCol = width; initialCol >= minInitialCol; initialCol--) {
      let diagonal = "";
      for (
        let col = initialCol, row = initialRow;
        col >= 0 && row < height;
        col--, row++
      ) {
        diagonal = `${diagonal}${puzzleLines[row].charAt(col)}`;
      }
      diagonals.push(diagonal);
    }
  }
  return diagonals;
};

const wordsearch = (word: string, puzzleLines: string[]) => {
  const totalMatches = [
    ...puzzleLines,
    ...columns(puzzleLines),
    ...diagonals(puzzleLines),
  ].map((line) => {
    return matchesOnLine(word, line);
  }).reduce((result, matches) => {
    return result + matches;
  }, 0);

  return totalMatches;
};

export { wordsearch };
