const parseRules = (pageOrderingRules: string[]) =>
  pageOrderingRules.map((rule) => rule.split("|").map(Number))
    .reduce(
      (result: { [number: number]: number[] | undefined }, [a, b]) => {
        result[a] = result[a] ? [...result[a], b] : [b];
        return result;
      },
      {},
    );

const getCorrectUpdates = (updates: string[], pageOrderingRules: string[]) => {
  const rules = parseRules(pageOrderingRules);
  const result = updates.map((update) => update.split(",").map(Number)).filter(
    (updatePages) => {
      // Check this page is before every other in this page set
      return updatePages.every((page, i) => {
        const before = updatePages.slice(0, i);
        const pageRules = rules[page];
        if (
          pageRules &&
          pageRules.some((mustBeAfter) => before.includes(mustBeAfter))
        ) {
          return false;
        }
        return true;
      });
    },
  );
  return result;
};

const getMiddlePage = (updatePages: number[]) => {
  const middleIndex = Math.floor(updatePages.length / 2);
  return updatePages[middleIndex];
};

export { getCorrectUpdates, getMiddlePage };
