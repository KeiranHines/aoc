import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day7.ts";

const input = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
	`.trim();

Deno.test("Day 7 Part 1", () => {
	assertEquals(part1(input), 3749);
});

Deno.test("Day 7 part 2", () => {
	assertEquals(part2(input), 11387);
});
