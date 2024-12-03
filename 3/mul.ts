const extractMul = (input: string) => {
  return [...input.matchAll(new RegExp("mul\\([0-9]{1,3},[0-9]{1,3}\\)", "g"))];
};

const filterDonts = (input: string) => {
  const donts = input.split(`don't()`);

  // Always do first part up to first don't
  const partsToDo = [donts.shift()];
  // Each don't section we want to do everything after first do
  donts.map((dont) => {
    const [_ignoreUpToDo, ...doRest] = dont.split("do()");
    partsToDo.push(...doRest);
  });

  return partsToDo.join("");
};

const runMul = (input: string) => {
  const [a, b] = input.replace("mul(", "").replace(")", "").split(",");
  return Number(a) * Number(b);
};

export { extractMul, filterDonts, runMul };
