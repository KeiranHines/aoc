import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day08.ts";

const input = `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
	`.trim();

Deno.test("Day 8 Part 1", () => {
	assertEquals(part1(input), 14);
});

Deno.test("Day 8 part 2", () => {
	assertEquals(part2(input), 34);
});

const realInput = await Deno.readTextFile(`inputs/day08`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("day 8 part 1", () => {
	part1(realInput);
});

Deno.bench("day 8 part 2", () => {
	part2(realInput);
});
