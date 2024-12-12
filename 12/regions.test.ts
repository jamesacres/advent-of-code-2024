import { assertEquals } from "@std/assert/equals";
import { stringToRegions } from "./regions.ts";

const example = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

Deno.test(function exampleRegionCost() {
  assertEquals(
    stringToRegions(example).reduce(
      (result, region) => result + (region.area! * region.perimeter!),
      0,
    ),
    1930,
  );
});

Deno.test(async function inputRegionCost() {
  const input = await Deno.readTextFile("./12/input.txt");
  assertEquals(
    stringToRegions(input).reduce(
      (result, region) => result + (region.area! * region.perimeter!),
      0,
    ),
    1431316,
  );
});
