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
    moveBlocks(toBlocks(example, true)),
    "0,0,9,9,8,1,1,1,8,8,8,2,7,7,7,3,3,3,6,4,4,6,5,5,5,5,6,6,.,.,.,.,.,.,.,.,.,.,.,.,.,.",
  );
});

Deno.test(function exampleDiskMapMoveBlocksChecksum() {
  assertEquals(
    calculateChecksum(moveBlocks(toBlocks(example, true))),
    1928,
  );
});

Deno.test(async function inputDiskMapMoveBlocksChecksum() {
  const input = await Deno.readTextFile("./9/input.txt");
  assertEquals(
    calculateChecksum(moveBlocks(toBlocks(input, true))),
    6401092019345,
  );
});
