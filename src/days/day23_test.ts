import { assertEquals } from "@std/assert";
import { part1, part2 } from "./day23.ts";

const input = `
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
	`.trim();

Deno.test("Day 23 Part 1", () => {
	assertEquals(part1(input), 7);
});

Deno.test("Day 23 Part 2", () => {
	assertEquals(part2(input), "co,de,ka,ta");
});

const realInput = await Deno.readTextFile(`inputs/day23`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("Day 23 part 1", () => {
	part1(realInput);
});

Deno.bench("Day 23 part 2", () => {
	part2(realInput);
});
