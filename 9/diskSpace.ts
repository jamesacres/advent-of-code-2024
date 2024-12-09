const toBlocks = (diskMap: string, delimeters = false): string => {
  let id = 0;
  return diskMap.split("").map((size, i) => {
    if (i % 2 === 0) {
      const fileSize = Number(size);
      const idString = delimeters ? `[${id}]` : `${id}`;
      const result = idString.repeat(fileSize);
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
  let i = 0;
  const blocks = diskBlocks.split(/\[|\]/).filter((value) => value).reduce(
    (result: { [key: number]: string }, block) => {
      if (block.includes(".")) {
        block.split("").forEach((space) => {
          spaceIndexes.push(Number(i));
          result[i] = space;
          i = i + 1;
        });
      } else {
        fileIndexes.push(Number(i));
        result[i] = block;
        i = i + 1;
      }
      return result;
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
  const result = Object.values(blocks).join(",");

  // If result still has spaces separating numbers we need to repeat the process
  return (/\.[0-9]/.test(result)) ? moveBlocks(result) : result;
};

const calculateChecksum = (diskBlocks: string): number => {
  const adjustedInput = diskBlocks.replaceAll("..", ".,.").replaceAll(
    "..",
    ".,.",
  );
  return adjustedInput
    .split(",").reduce((result, block, i) => {
      return block === "." ? result : result + (Number(block) * i);
    }, 0);
};

const moveBlocksV2 = (diskBlocks: string): string => {
  const spaceIndexes: number[] = [];
  const files: {
    [id: number]: {
      indexes: number[];
    };
  } = {};
  let i = 0;
  const blocks = diskBlocks.split(/\[|\]/).filter((value) => value).reduce(
    (result: { [key: number]: string }, block) => {
      if (block.includes(".")) {
        spaceIndexes.push(Number(i));
        result[i] = block;
        i = i + block.length;
      } else {
        if (!files[Number(block)]) {
          files[Number(block)] = { indexes: [] };
        }
        files[Number(block)].indexes.push(Number(i));
        result[i] = block;
        i = i + 1;
      }
      return result;
    },
    {},
  );

  Object.keys(files).map(Number).sort((a, b) => b - a).forEach((fileId) => {
    const fileLength = files[fileId].indexes.length;
    const spaceIndexesIndex = spaceIndexes.findIndex((spaceIndex) =>
      spaceIndex < files[fileId].indexes[0] &&
      blocks[spaceIndex].length >= fileLength
    );
    if (spaceIndexesIndex !== -1) {
      const spaceIndex = spaceIndexes[spaceIndexesIndex];
      const remainingSpaces = blocks[spaceIndex].length - fileLength;

      if (remainingSpaces) {
        const remainingSpaceString = ".".repeat(remainingSpaces);
        const remainingSpaceIndex = spaceIndex + fileLength;
        const neighbourIndex = remainingSpaceIndex + remainingSpaces;
        if (spaceIndexes.includes(neighbourIndex)) {
          // Combine with existing space index
          blocks[neighbourIndex] = `${
            blocks[neighbourIndex]
          }${remainingSpaceString}`;
          spaceIndexes.splice(spaceIndexesIndex, 1);
        } else {
          // Replace with new space index
          blocks[remainingSpaceIndex] = remainingSpaceString;
          spaceIndexes.splice(spaceIndexesIndex, 1, remainingSpaceIndex);
        }
      } else {
        spaceIndexes.splice(spaceIndexesIndex, 1);
      }

      blocks[files[fileId].indexes[0]] = ".".repeat(fileLength);
      [...new Array(fileLength - 1)].forEach((_, i) => {
        delete blocks[files[fileId].indexes[i + 1]];
      });

      // files[fileId].indexes.forEach((fileIndex) => {
      //   blocks[fileIndex] = ".";
      // });

      files[fileId].indexes = [];
      [...new Array(fileLength)].forEach((_, i) => {
        const index = spaceIndex + i;
        blocks[index] = `${fileId}`;
        files[fileId].indexes.push(index);
      });
    }
  });
  return Object.values(blocks).join(",");
};

export { calculateChecksum, moveBlocks, moveBlocksV2, toBlocks };
