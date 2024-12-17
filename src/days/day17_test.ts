import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day17.ts";

const input = `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
	`.trim();

Deno.test("Day 17 Part 1", () => {
	assertEquals(part1(input), "4,6,3,5,6,3,5,2,1,0");
});

Deno.test("Day 17 Part 2", () => {
	const input2 = `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`.trim();
	assertEquals(part2(input2), 117440);
});

const realInput = await Deno.readTextFile(`inputs/day17`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("Day 17 part 1", () => {
	part1(realInput);
});

Deno.bench("Day 17 part 2", () => {
	part2(realInput);
});
