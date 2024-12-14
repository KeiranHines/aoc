import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day14.ts";

const input = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
	`.trim();

Deno.test("Day 14 Part 1", () => {
	assertEquals(part1(input, 11, 7), 12);
});

Deno.test("Day 14 part 2", () => {
	assertEquals(part2(input), 0);
});

const realInput = await Deno.readTextFile(`inputs/day14`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("Day 14 part 1", () => {
	part1(realInput);
});

Deno.bench("Day 14 part 2", () => {
	part2(realInput);
});
