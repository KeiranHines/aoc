import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day20.ts";

const input = `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
	`.trim();

Deno.test("Day 20 Part 1", () => {
	assertEquals(part1(input), 0);
});

Deno.test("Day 20 Part 2", () => {
	assertEquals(part2(input, 50), 285);
});

const realInput = await Deno.readTextFile(`inputs/day20`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("Day 20 part 1", () => {
	part1(realInput);
});

Deno.bench("Day 20 part 2", () => {
	part2(realInput);
});
