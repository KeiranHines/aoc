import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day3.ts";

Deno.test("Day 3 Part 1", () => {
	const input = `
xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))
	`.trim();
	assertEquals(part1(input), 161);
});

Deno.test("Day 3 part 2", () => {
	const input = `
xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
	`.trim();
	assertEquals(part2(input), 48);
});
