const toBlocks = (diskMap: string): string => {
  let id = 0;
  return diskMap.split("").map((size, i) => {
    if (i % 2 === 0) {
      const fileSize = Number(size);
      const result = `${id}`.repeat(fileSize);
      id = id + 1;
      return result;
    } else {
      const spaceSize = Number(size);
      return `.`.repeat(spaceSize);
    }
  }).join("");
};

const moveBlocks = (diskBlocks: string): string => {
  const spaceIndexes: number[] = [];
  const fileIndexes: number[] = [];
  const blocks = diskBlocks.split("").reduce(
    (result: { [key: number]: string }, block, i) => {
      if (block === ".") {
        spaceIndexes.push(Number(i));
      } else {
        fileIndexes.push(Number(i));
      }
      return { ...result, [i]: block };
    },
    {},
  );
  spaceIndexes.forEach((spaceIndex) => {
    const fileIndex = fileIndexes.pop();
    if (fileIndex && spaceIndex < fileIndex) {
      blocks[spaceIndex] = blocks[fileIndex];
      blocks[fileIndex] = ".";
    }
  });
  const result = Object.values(blocks).join("");

  // If result still has spaces separating numbers we need to repeat the process
  return (/\.[0-9]/.test(result)) ? moveBlocks(result) : result;
};

const calculateChecksum = (diskBlocks: string): number => {
  return diskBlocks.split("").reduce((result, block, i) => {
    return block === "." ? result : result + (Number(block) * i);
  }, 0);
};

export { calculateChecksum, moveBlocks, toBlocks };
