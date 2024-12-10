import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day06.ts";

const input = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
	`.trim();

Deno.test("Day 6 Part 1", () => {
	assertEquals(part1(input), 41);
});

Deno.test("Day 6 part 2", () => {
	assertEquals(part2(input), 6);
});

const realInput = await Deno.readTextFile(`inputs/day06`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("day 6 part 1", () => {
	part1(realInput);
});

//Deno.bench("day 6 part 2", () => {
//	part2(realInput);
//});
