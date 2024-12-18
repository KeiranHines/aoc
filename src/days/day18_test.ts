import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day18.ts";

const input = `
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
	`.trim();

Deno.test("Day 18 Part 1", () => {
	assertEquals(part1(input, 12, 6, 6), 22);
});

Deno.test("Day 18 Part 2", () => {
	assertEquals(part2(input, 6, 6), "6,1");
});

const realInput = await Deno.readTextFile(`inputs/day18`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("Day 18 part 1", () => {
	part1(realInput);
});

Deno.bench("Day 18 part 2", () => {
	part2(realInput);
});
