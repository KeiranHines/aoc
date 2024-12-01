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
	//TODO: Implement part 1 here.
	return input.length;
}

export function part2(input: string): number {
	// TODO: Implement part 2 here.
	return input.length;
}
