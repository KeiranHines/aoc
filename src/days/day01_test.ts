import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day01.ts";

const input = `
3   4
4   3
2   5
1   3
3   9
3   3
	`.trim();

Deno.test("Day 1 part 1", () => {
	assertEquals(part1(input), 11);
});

Deno.test("Day 1 part 2", () => {
	assertEquals(part2(input), 31);
});

const realInput = await Deno.readTextFile(`inputs/day01`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("day 1 part 1", () => {
	part1(realInput);
});

Deno.bench("day 1 part 2", () => {
	part2(realInput);
});
