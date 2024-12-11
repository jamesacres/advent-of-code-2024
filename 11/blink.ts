const blink = (input: string): string => {
  return input.split(" ").reduce((result, part) => {
    if (part === "0") {
      return `${result.length ? `${result} ` : ""}1`;
    }
    if (part.length % 2 === 0) {
      const [a, b] = [
        Number(part.slice(0, part.length / 2)),
        Number(part.slice(part.length / 2, part.length)),
      ];
      return `${result.length ? `${result} ` : ""}${a} ${b}`;
    }
    return `${result.length ? `${result} ` : ""}${Number(part) * 2024}`;
  }, "");
};

export { blink };
