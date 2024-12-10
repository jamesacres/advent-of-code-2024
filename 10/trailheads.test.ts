import { assertEquals } from "@std/assert/equals";
import { findTrailheadRoutes, toTrailHeadsArray } from "./trailheads.ts";

const example = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

Deno.test(function exampleFindTrailheads() {
  const result = toTrailHeadsArray(findTrailheadRoutes(example));
  assertEquals(
    result,
    [
      {
        destinations: [
          {
            x: 4,
            y: 3,
          },
          {
            x: 4,
            y: 5,
          },
          {
            x: 5,
            y: 4,
          },
          {
            x: 1,
            y: 0,
          },
          {
            x: 0,
            y: 3,
          },
        ],
        height: 0,
        isTrailHead: true,
        trailCount: 5,
      },
      {
        destinations: [
          {
            x: 4,
            y: 3,
          },
          {
            x: 4,
            y: 5,
          },
          {
            x: 5,
            y: 4,
          },
          {
            x: 1,
            y: 0,
          },
          {
            x: 0,
            y: 3,
          },
          {
            x: 5,
            y: 2,
          },
        ],
        height: 0,
        isTrailHead: true,
        trailCount: 6,
      },
      {
        destinations: [
          {
            x: 4,
            y: 3,
          },
          {
            x: 4,
            y: 5,
          },
          {
            x: 5,
            y: 4,
          },
          {
            x: 1,
            y: 0,
          },
          {
            x: 0,
            y: 3,
          },
        ],
        height: 0,
        isTrailHead: true,
        trailCount: 5,
      },
      {
        destinations: [
          {
            x: 5,
            y: 2,
          },
          {
            x: 5,
            y: 4,
          },
          {
            x: 4,
            y: 3,
          },
        ],
        height: 0,
        isTrailHead: true,
        trailCount: 3,
      },
      {
        destinations: [
          {
            x: 4,
            y: 6,
          },
        ],
        height: 0,
        isTrailHead: true,
        trailCount: 1,
      },
      {
        destinations: [
          {
            x: 5,
            y: 2,
          },
          {
            x: 5,
            y: 4,
          },
          {
            x: 4,
            y: 3,
          },
        ],
        height: 0,
        isTrailHead: true,
        trailCount: 3,
      },
      {
        destinations: [
          {
            x: 1,
            y: 0,
          },
          {
            x: 0,
            y: 3,
          },
          {
            x: 4,
            y: 3,
          },
          {
            x: 4,
            y: 5,
          },
          {
            x: 5,
            y: 4,
          },
        ],
        height: 0,
        isTrailHead: true,
        trailCount: 5,
      },
      {
        destinations: [
          {
            x: 5,
            y: 2,
          },
          {
            x: 5,
            y: 4,
          },
          {
            x: 4,
            y: 3,
          },
        ],
        height: 0,
        isTrailHead: true,
        trailCount: 3,
      },
      {
        destinations: [
          {
            x: 1,
            y: 0,
          },
          {
            x: 0,
            y: 3,
          },
          {
            x: 4,
            y: 3,
          },
          {
            x: 4,
            y: 5,
          },
          {
            x: 5,
            y: 4,
          },
        ],
        height: 0,
        isTrailHead: true,
        trailCount: 5,
      },
    ],
  );
});

Deno.test(function exampleSumTrailheads() {
  const result = toTrailHeadsArray(findTrailheadRoutes(example)).reduce(
    (result, { trailCount }) => result + (trailCount || 0),
    0,
  );
  assertEquals(
    result,
    36,
  );
});

Deno.test(async function inputSumTrailheads() {
  const input = await Deno.readTextFile("./10/input.txt");
  const result = toTrailHeadsArray(findTrailheadRoutes(input)).reduce(
    (result, { trailCount }) => result + (trailCount || 0),
    0,
  );
  assertEquals(
    result,
    468,
  );
});
