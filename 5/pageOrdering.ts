const parseRules = (pageOrderingRules: string[]) =>
  pageOrderingRules.map((rule) => rule.split("|").map(Number))
    .reduce(
      (result: { [number: number]: number[] | undefined }, [a, b]) => {
        result[a] = result[a] ? [...result[a], b] : [b];
        return result;
      },
      {},
    );

const getUpdates = (updates: string[], pageOrderingRules: string[]) => {
  const rules = parseRules(pageOrderingRules);
  const result = updates.map((update) => update.split(",").map(Number)).reduce(
    (result: { correct: number[][]; incorrect: number[][] }, updatePages) => {
      // Check this page is before every other in this page set
      if (
        updatePages.every((page, i) => {
          const before = updatePages.slice(0, i);
          const pageRules = rules[page];
          if (
            pageRules &&
            pageRules.some((mustBeAfter) => before.includes(mustBeAfter))
          ) {
            return false;
          }
          return true;
        })
      ) {
        result.correct.push(updatePages);
      } else {
        result.incorrect.push(updatePages);
      }
      return result;
    },
    { correct: [], incorrect: [] },
  );
  return result;
};

const getMiddlePage = (updatePages: number[]) => {
  const middleIndex = Math.floor(updatePages.length / 2);
  return updatePages[middleIndex];
};

const fixUpdate = (update: number[], pageOrderingRules: string[]) => {
  const rules = parseRules(pageOrderingRules);
  return update.sort((a, b) => {
    const pageRules = rules[a];
    return (pageRules?.includes(b)) ? -1 : 1;
  });
};

export { fixUpdate, getMiddlePage, getUpdates };
