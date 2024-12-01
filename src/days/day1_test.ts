import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day1.ts";

Deno.test("Part 1 example", () => {
	const input = `
3   4
4   3
2   5
1   3
3   9
3   3
	`.trim();
	assertEquals(part1(input), 11);
});

Deno.test("part 2 example", () => {
	const input = `
	
	`.trim();
	assertEquals(part2(input), 0);
});
