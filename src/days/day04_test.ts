import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day04.ts";

const input = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
	`.trim();

Deno.test("Day 4 Part 1", () => {
	assertEquals(part1(input), 18);
});

Deno.test("Day 4 part 2", () => {
	assertEquals(part2(input), 9);
});

const realInput = await Deno.readTextFile(`inputs/day04`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("day 4 part 1", () => {
	part1(realInput);
});

Deno.bench("day 4 part 2", () => {
	part2(realInput);
});
