export async function main() {
	const filepath = import.meta.filename || "";
	const parts = filepath.split("/");
	let day = parts[parts.length - 1].split(".")[0];

	const input = await Deno.readTextFile(`inputs/${day}`).catch(() => {
		console.warn(`Could not read file inputs/${day}`);
		Deno.exit(1);
	}).then((i) => i.trim());
	day = day.replace("day", "");
	console.log(`Day ${day} part 1 answer is: `, part1(input));
	console.log(`Day ${day} part 2 answer is: `, part2(input));
}

if (import.meta.main) {
	await main();
}
function solveEq2(input: string, additional: number = 0) {
	const search =
		/A:.*?(\d+).*?(\d+)\n.*?B:.*?(\d+).*?(\d+)\n.*?e:.*?(\d+).*?(\d+)/g;
	let total = 0;
	let parts;
	while (parts = search.exec(input), parts) {
		const ax = +parts![1];
		const ay = +parts![2];
		const bx = +parts![3];
		const by = +parts![4];
		const px = +parts![5] + additional;
		const py = +parts![6] + additional;
		const i = (bx * py - by * px) / (ay * bx - ax * by);
		const j = (px - i * ax) / bx;
		if (
			(px - i * ax) % bx == 0 &&
			(bx * py - by * px) % (ay * bx - ax * by) == 0
		) {
			total += 3 * i + j;
		}
	}
	return total;
}

export function part1(input: string): number {
	return solveEq2(input);
}

export function part2(input: string): number {
	return solveEq2(input, 10000000000000);
}
