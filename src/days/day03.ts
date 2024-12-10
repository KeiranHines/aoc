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

export function part1(input: string): number {
	return input.matchAll(/mul\((\d+),(\d+)\)/g).reduce(
		(total, curr) => total + (+curr[1] * +curr[2]),
		0,
	);
}

export function part2(input: string): number {
	let enabled = true;
	let total = 0;
	const matches = input.matchAll(/mul\((\d+),(\d+)\)|(don't\(\))|(do\(\))/g);
	for (const match of matches) {
		if (match[0] == "do()") {
			enabled = true;
		} else if (match[0] === "don't()") {
			enabled = false;
		} else if (enabled) {
			total += +match[1] * +match[2];
		}
	}
	return total;
}
