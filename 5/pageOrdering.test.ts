import { assertEquals } from "@std/assert/equals";
import { getMiddlePage, getUpdates } from "./pageOrdering.ts";
import { fixUpdate } from "./pageOrdering.ts";

const example = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

Deno.test(function exampleCorrectUpdates() {
  const pageOrderingRules = example.split("\n").filter((line) =>
    line.includes("|")
  );
  const updates = example.split("\n").filter((line) =>
    line && !line.includes("|")
  );

  assertEquals(getUpdates(updates, pageOrderingRules).correct, [
    [
      75,
      47,
      61,
      53,
      29,
    ],
    [
      97,
      61,
      53,
      29,
      13,
    ],
    [
      75,
      29,
      13,
    ],
  ]);
});

Deno.test(function exampleCorrectUpdatesMiddles() {
  const pageOrderingRules = example.split("\n").filter((line) =>
    line.includes("|")
  );
  const updates = example.split("\n").filter((line) =>
    line && !line.includes("|")
  );

  assertEquals(
    getUpdates(updates, pageOrderingRules).correct.map(getMiddlePage),
    [
      61,
      53,
      29,
    ],
  );
});

Deno.test(function exampleCorrectUpdatesMiddlesSum() {
  const pageOrderingRules = example.split("\n").filter((line) =>
    line.includes("|")
  );
  const updates = example.split("\n").filter((line) =>
    line && !line.includes("|")
  );

  assertEquals(
    getUpdates(updates, pageOrderingRules).correct.map(getMiddlePage).reduce((
      result,
      number,
    ) => result + number),
    143,
  );
});

Deno.test(async function inputCorrectUpdatesMiddlesSum() {
  const input = await Deno.readTextFile("./5/input.txt");

  const pageOrderingRules = input.split("\n").filter((line) =>
    line.includes("|")
  );
  const updates = input.split("\n").filter((line) =>
    line && !line.includes("|")
  );

  assertEquals(
    getUpdates(updates, pageOrderingRules).correct.map(getMiddlePage).reduce((
      result,
      number,
    ) => result + number),
    4689,
  );
});

Deno.test(function exampleFixIncorrectUpdates() {
  const pageOrderingRules = example.split("\n").filter((line) =>
    line.includes("|")
  );
  const updates = example.split("\n").filter((line) =>
    line && !line.includes("|")
  );

  const incorrectUpdates = getUpdates(updates, pageOrderingRules).incorrect;
  const correctedUpdates = incorrectUpdates.map((update) =>
    fixUpdate(update, pageOrderingRules)
  );

  assertEquals(correctedUpdates, [
    [
      97,
      75,
      47,
      61,
      53,
    ],
    [
      61,
      29,
      13,
    ],
    [
      97,
      75,
      47,
      29,
      13,
    ],
  ]);
});

Deno.test(async function inputFixIncorrectUpdates() {
  const input = await Deno.readTextFile("./5/input.txt");

  const pageOrderingRules = input.split("\n").filter((line) =>
    line.includes("|")
  );
  const updates = input.split("\n").filter((line) =>
    line && !line.includes("|")
  );

  const incorrectUpdates = getUpdates(updates, pageOrderingRules).incorrect;
  const correctedUpdates = incorrectUpdates.map((update) =>
    fixUpdate(update, pageOrderingRules)
  );

  assertEquals(
    correctedUpdates.map(getMiddlePage).reduce((
      result,
      number,
    ) => result + number),
    6336,
  );
});
