import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day13.ts";

const input = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400
	`.trim();

Deno.test("Day 13 Part 1", () => {
	assertEquals(part1(input), 280);
});

Deno.test("Day 13 part 2", () => {
	assertEquals(part2(input), 0);
});

const realInput = await Deno.readTextFile(`inputs/day13`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("Day 13 part 1", () => {
	part1(realInput);
});

Deno.bench("Day 13 part 2", () => {
	part2(realInput);
});
