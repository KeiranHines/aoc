import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day9.ts";

const input = `2333133121414131402`.trim();

Deno.test("Day 9 Part 1", () => {
	assertEquals(part1(input), 1928);
});

Deno.test("Day 9 part 2", () => {
	assertEquals(part2(input), 2858);
});
