import { assertEquals } from "@std/assert";
import { part1, part2 } from "./template.ts";

const input = `

	`.trim();

Deno.test("template_name Part 1", () => {
	assertEquals(part1(input), 0);
});

Deno.test("template_name part 2", () => {
	assertEquals(part2(input), 0);
});

const realInput = await Deno.readTextFile(`inputs/template_file`).catch(() => {
	return "";
}).then((i) => i.trim());

Deno.bench("template_name part 1", () => {
	part1(realInput);
});

Deno.bench("template_name part 2", () => {
	part2(realInput);
});
