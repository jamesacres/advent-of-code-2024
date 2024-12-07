import { assertEquals } from "@std/assert/equals";
import { findValidOperations } from "./operations.ts";

const example = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

Deno.test(function exampleFindValidOperations() {
  const equations = example.split("\n").map((line) => {
    const [total, rest] = line.split(": ");
    const numbers = rest.split(" ").map(Number);
    return { numbers, total: Number(total) };
  });
  assertEquals(
    findValidOperations(equations),
    [{
      hasValidOperations: true,
      numbers: [
        10,
        19,
      ],
      total: 190,
    }, {
      hasValidOperations: true,
      numbers: [
        81,
        40,
        27,
      ],
      total: 3267,
    }, {
      hasValidOperations: false,
      numbers: [
        17,
        5,
      ],
      total: 83,
    }, {
      hasValidOperations: false,
      numbers: [
        15,
        6,
      ],
      total: 156,
    }, {
      hasValidOperations: false,
      numbers: [
        6,
        8,
        6,
        15,
      ],
      total: 7290,
    }, {
      hasValidOperations: false,
      numbers: [
        16,
        10,
        13,
      ],
      total: 161011,
    }, {
      hasValidOperations: false,
      numbers: [
        17,
        8,
        14,
      ],
      total: 192,
    }, {
      hasValidOperations: false,
      numbers: [
        9,
        7,
        18,
        13,
      ],
      total: 21037,
    }, {
      hasValidOperations: true,
      numbers: [
        11,
        6,
        16,
        20,
      ],
      total: 292,
    }],
  );
});

Deno.test(function exampleSumNumbersForValidOperations() {
  const equations = example.split("\n").map((line) => {
    const [total, rest] = line.split(": ");
    const numbers = rest.split(" ").map(Number);
    return { numbers, total: Number(total) };
  });
  assertEquals(
    findValidOperations(equations).filter(({ hasValidOperations }) =>
      hasValidOperations
    ).reduce(
      (result, { total }) => result + total,
      0,
    ),
    3749,
  );
});

Deno.test(async function inputSumNumbersForValidOperations() {
  const input = await Deno.readTextFile("./7/input.txt");
  const equations = input.split("\n").map((line) => {
    const [total, rest] = line.split(": ");
    const numbers = rest.split(" ").map(Number);
    return { numbers, total: Number(total) };
  });
  assertEquals(
    findValidOperations(equations).filter(({ hasValidOperations }) =>
      hasValidOperations
    ).reduce(
      (result, { total }) => result + total,
      0,
    ),
    10741443549536,
  );
});
