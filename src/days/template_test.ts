import { assertEquals } from "@std/assert";
import { part1, part2 } from "./template.ts";

const input = `

	`.trim();

Deno.test("example Part 1", () => {
	assertEquals(part1(input), 0);
});

Deno.test("example part 2", () => {
	assertEquals(part2(input), 0);
});
