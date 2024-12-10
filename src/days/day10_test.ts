import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day10.ts";

const input = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
	`.trim();

Deno.test("Day 10 Part 1", () => {
	assertEquals(part1(input), 36);
});

Deno.test("Day 10 part 2", () => {
	assertEquals(part2(input), 0);
});

Deno.test("Day 10 simple path", () => {
	assertEquals(part1("0123456789"), 1);
});

Deno.test("Day 10 less simple path", () => {
	const input = `
0123456789
1000000000
2000000000
3000000000
4000000000
5000000000
6000000000
7000000000
8000000000
9000000000
	`.trim();
	assertEquals(part1(input), 4);
});
Deno.test("Day 10 complex path", () => {
	const input = `
0123456789
10.......8
2345678907
3........6
4........5
5........4
6........3
7........2
8........1
9........0
	`.trim();
	assertEquals(part1(input), 7);
});
