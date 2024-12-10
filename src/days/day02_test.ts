import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day02.ts";

const input = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
	`.trim();

Deno.test("Day 2 Part 1", () => {
	assertEquals(part1(input), 2);
});

Deno.test("Day 2 part 2", () => {
	assertEquals(part2(input), 4);
});

const realInput = await Deno.readTextFile(`inputs/day02`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("day 2 part 1", () => {
	part1(realInput);
});

Deno.bench("day 2 part 2", () => {
	part2(realInput);
});
