import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day11.ts";

const input = `
125 17
	`.trim();

Deno.test("Day 11 Part 1", () => {
	assertEquals(part1(input), 55312);
});

Deno.test("Day 11 part 2", () => {
	assertEquals(part2(input), 0);
});

const realInput = await Deno.readTextFile(`inputs/day11`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("Day 11 part 1", () => {
	part1(realInput);
});

Deno.bench("Day 11 part 2", () => {
	part2(realInput);
});
