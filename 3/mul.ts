const extractMul = (input: string) => {
  return [...input.matchAll(new RegExp("mul\\([0-9]{1,3},[0-9]{1,3}\\)", "g"))];
};

const runMul = (input: string) => {
  const [a, b] = input.replace("mul(", "").replace(")", "").split(",");
  return Number(a) * Number(b);
};

export { extractMul, runMul };
