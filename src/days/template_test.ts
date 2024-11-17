import { assertEquals } from "@std/assert";
import { part1, part2 } from "./template.ts";

Deno.test("Part 1 example", () => {
	const input = `

	`.trim();
	assertEquals(part1(input), 0);
});

Deno.test("part 2 example", () => {
	const input = `
	
	`.trim();
	assertEquals(part2(input), 0);
});
