import { assertEquals } from "@std/assert";
import { nextSecret, part1, part2 } from "./day22.ts";

const input = `
1
10
100
2024
	`.trim();

Deno.test("Day 22 Part 1", () => {
	assertEquals(part1(input), 37327623);
});

Deno.test("Day 22 Part 1 simple", () => {
	assertEquals(nextSecret(123), 15887950);
});

Deno.test("Day 22 Part 1 long", () => {
	const t = `
123
15887950
16495136
527345
704524
1553684
12683156
11100544
12249484
7753432
5908254
`.trim().split("\n");

	for (let i = 0; i < t.length - 2; i++) {
		assertEquals(nextSecret(+t[i]), +t[i + 1]);
	}
});

Deno.test("Day 22 Part 2", () => {
	const p2 = `
1
2
3
2024
`.trim();
	assertEquals(part2(p2), 23);
});

const realInput = await Deno.readTextFile(`inputs/day22`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("Day 22 part 1", () => {
	part1(realInput);
});

Deno.bench("Day 22 part 2", () => {
	part2(realInput);
});
