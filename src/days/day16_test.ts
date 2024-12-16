import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day16.ts";

const input = `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
	`.trim();

Deno.test("Day 16 Part 1", () => {
	assertEquals(part1(input), 7036);
});

Deno.test("Day 16 Part 1 2", () => {
	const input2 = `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
`.trim();
	assertEquals(part1(input2), 11048);
});

Deno.test("Day 16 Part 2", () => {
	assertEquals(part2(input), 44);
});

const realInput = await Deno.readTextFile(`inputs/day16`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("Day 16 part 1", () => {
	part1(realInput);
});

Deno.bench("Day 16 part 2", () => {
	part2(realInput);
});
