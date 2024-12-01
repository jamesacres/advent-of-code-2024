import { assertEquals, assertThrows } from "@std/assert";
import { listDistance } from "./list_distance.ts";

Deno.test(function listDistanceWithDifferentLength() {
  const listOne = [1, 2];
  const listTwo = [4, 2, 1];
  assertThrows(
    () => listDistance(listOne, listTwo),
    Error,
    "Lists must be same length",
  );
});

Deno.test(function listDistanceWithUnique() {
  const listOne = [1, 2, 3];
  const listTwo = [4, 2, 1];
  assertEquals(listDistance(listOne, listTwo), 1);
});

Deno.test(function listDistanceWithRepetition() {
  const listOne = [1, 5, 2, 3, 5];
  const listTwo = [4, 6, 2, 1, 6];
  assertEquals(listDistance(listOne, listTwo), 3);
});

Deno.test(async function listDistanceWithInput() {
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
  assertEquals(listDistance(listOne, listTwo), 1189304);
});
