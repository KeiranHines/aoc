export async function main() {
	const filepath = import.meta.filename || "";
	const parts = filepath.split("/");
	const DAY = parts[parts.length - 1].split(".")[0];

	const input = await Deno.readTextFile(`inputs/${DAY}`).catch(() => {
		console.warn(`Could not read file inputs/${DAY}`);
		Deno.exit(1);
	}).then((i) => i.trim());
	console.log(`Day ${DAY} part 1 answer is: `, part1(input));
	console.log(`Day ${DAY} part 2 answer is: `, part2(input));
}

if (import.meta.main) {
	await main();
}

export function part1(input: string): number {
	const firstList: Array<number> = [];
	const secondList: Array<number> = [];
	input.split("\n").forEach((line) => {
		const parts = line.split(" ");
		firstList.push(parseInt(parts[0]));
		secondList.push(parseInt(parts[parts.length - 1]));
	});

	const firstSorted = firstList.sort();
	const secondSorted = secondList.sort();
	console.log("f", firstList, "s", secondList);
	return firstSorted.reduce(
		(prev, first, index) => prev + Math.abs(first - secondSorted[index]),
		0,
	);
}

export function part2(input: string): number {
	const firstList: Array<number> = [];
	const secondList: Array<number> = [];
	input.split("\n").forEach((line) => {
		const parts = line.split(" ");
		firstList.push(parseInt(parts[0]));
		secondList.push(parseInt(parts[parts.length - 1]));
	});

	return firstList.reduce(
		(prev, first) =>
			prev + (first * secondList.filter((s) => s == first).length),
		0,
	);
}
