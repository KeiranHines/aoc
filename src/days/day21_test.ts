import { assertEquals } from "@std/assert";
import {
	controller,
	encode,
	encodeLength,
	numpad,
	part1,
	part2,
} from "./day21.ts";

const input = `
029A
980A
179A
456A
379A
	`.trim();

Deno.test("Day 21 Part 1", () => {
	assertEquals(part1(input), 126384);
});

Deno.test("Day 21 Part 1 Numpad", () => {
	const opts = encode("029A", numpad);
	assertEquals(opts.includes("<A^A>^^AvvvA"), true);
	assertEquals(opts.includes("<A^A^>^AvvvA"), true);
	assertEquals(opts.includes("<A^A^^>AvvvA"), true);
	const len = encodeLength("029A", numpad);
	assertEquals(len, 12, `expected 12 got: ${len}`);
});

Deno.test("Day 21 Part 1 Controller", () => {
	const opts = encode("029A", numpad).flatMap((nc) => encode(nc, controller));
	const lens = encode("029A", numpad).map((nc) =>
		encodeLength(nc, controller)
	);
	const ans = "v<<A>>^A<A>AvA<^AA>A<vAAA>^A";
	assertEquals(opts.includes(ans), true);
	assertEquals(lens.includes(ans.length), true);
});

Deno.test("Day 21 Part 1 Controller2", () => {
	const opts = encode("v<<A>>^A<A>AvA<^AA>A<vAAA>^A", controller);
	const ans =
		"<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A";
	assertEquals(opts.includes(ans), true);
	assertEquals(
		encodeLength("v<<A>>^A<A>AvA<^AA>A<vAAA>^A", controller),
		ans.length,
	);
});

Deno.test("Day 21 Steps", () => {
	const inp = "029A";
	const numpd = "<A^A>^^AvvvA";
	const np = encode(inp, numpad);
	assertEquals(np.includes(numpd), true);
	const controller1 = "v<<A>>^A<A>AvA<^AA>A<vAAA>^A";
	const c1 = encode(numpd, controller);
	assertEquals(c1.includes(controller1), true);
	const controller2 =
		"<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A";
	const c2 = encode(controller1, controller);
	assertEquals(c2.includes(controller2), true);
	assertEquals(controller2.length, 68);
});

Deno.test("Day 21 980A", () => {
	console.log(encode("980A", numpad));
	const c = encode("^^A<AvvvA>A", controller).flatMap((
		x,
	) => encode(x, controller));
	assertEquals(
		c.includes(
			"<v<A>>^AAAvA^A<vA<AA>>^AvAA<^A>A<v<A>A>^AAAvA<^A>A<vA>^A<A>A",
		),
		true,
	);
});

Deno.test("Day 21 Part 2", () => {
	assertEquals(part2(input), 0);
});

const realInput = await Deno.readTextFile(`inputs/day21`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("Day 21 part 1", () => {
	part1(realInput);
});

Deno.bench("Day 21 part 2", () => {
	part2(realInput);
});
