import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day12.ts";

const input = `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
	`.trim();

Deno.test("Day 12 Part 1", () => {
	assertEquals(part1(input), 1930);
});

Deno.test("Day 12 part 2", () => {
	assertEquals(part2(input), 1206);
});

const realInput = await Deno.readTextFile(`inputs/day12`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("Day 12 part 1", () => {
	part1(realInput);
});

Deno.bench("Day 12 part 2", () => {
	part2(realInput);
});
