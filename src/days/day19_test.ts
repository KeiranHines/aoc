import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day19.ts";

const input = `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
	`.trim();

Deno.test("Day 19 Part 1", () => {
	assertEquals(part1(input), 6);
});

Deno.test("Day 19 Part 2", () => {
	assertEquals(part2(input), 16);
});

const realInput = await Deno.readTextFile(`inputs/day19`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("Day 19 part 1", () => {
	part1(realInput);
});

Deno.bench("Day 19 part 2", () => {
	part2(realInput);
});
