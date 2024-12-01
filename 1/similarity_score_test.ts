import { assertEquals, assertThrows } from "@std/assert";
import { similarityScore } from "./similarity_score.ts";

Deno.test(function similarityScoreWithDifferentLength() {
  const listOne = [1, 2];
  const listTwo = [4, 2, 1];
  assertThrows(
    () => similarityScore(listOne, listTwo),
    Error,
    "Lists must be same length",
  );
});

Deno.test(function similarityScoreWithUnique() {
  const listOne = [1, 2, 3];
  const listTwo = [4, 2, 1];
  assertEquals(similarityScore(listOne, listTwo), 3);
});

Deno.test(function similarityScoreWithRepetition() {
  const listOne = [1, 5, 2, 3, 5, 9];
  const listTwo = [4, 6, 2, 1, 6, 2];
  assertEquals(similarityScore(listOne, listTwo), 5);
});

Deno.test(async function similarityScoreWithInput() {
  const input = await Deno.readTextFile("./1/input.txt");
  const { listOne, listTwo } = input.split("\n").map((line) =>
    line.split(/\s+/)
  ).reduce(
    (result: {
      listOne: number[];
      listTwo: number[];
    }, [one, two]) => {
      result.listOne.push(Number(one));
      result.listTwo.push(Number(two));
      return result;
    },
    {
      listOne: [],
      listTwo: [],
    },
  );
  assertEquals(similarityScore(listOne, listTwo), 24349736);
});
