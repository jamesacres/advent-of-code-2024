import { assertEquals } from "@std/assert/equals";
import { calculateChecksum, moveBlocks, toBlocks } from "./diskSpace.ts";

const example = "2333133121414131402";

Deno.test(function exampleDiskMapToBlocks() {
  assertEquals(
    toBlocks(example),
    "00...111...2...333.44.5555.6666.777.888899",
  );
});

Deno.test(function exampleDiskMapMoveBlocks() {
  assertEquals(
    moveBlocks(toBlocks(example)),
    "0099811188827773336446555566..............",
  );
});

Deno.test(function exampleDiskMapMoveBlocksChecksum() {
  assertEquals(
    calculateChecksum(moveBlocks(toBlocks(example))),
    1928,
  );
});

Deno.test(async function inputDiskMapMoveBlocksChecksum() {
  const input = await Deno.readTextFile("./9/input.txt");
  assertEquals(
    calculateChecksum(moveBlocks(toBlocks(input))),
    1928,
  );
});
