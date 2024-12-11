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

function next(number: number) {
	if (number === 0) {
		return [1];
	}
	const digits = Math.floor(Math.log10(number) + 1);
	if (digits % 2 === 0) {
		const first = Math.floor(number / (10 ** (digits / 2)));
		const second = number - first * 10 ** (digits / 2);
		return [first, second];
	}
	return [number * 2024];
}

function run(numbers: Array<number>, runs: number) {
	let state = [...numbers];
	for (let i = 0; i < runs; i++) {
		state = state.flatMap((number) => next(number));
	}
	return state;
}

export function part1(input: string): number {
	return input.split(" ").reduce(
		(total, s) => total + run([+s], 25).length,
		0,
	);
}

export function part2(input: string): number {
	let stones = input.split(" ").map((s) => +s);
	stones = stones.flatMap((s) => run([s], 37));
	const counter: { [key: number]: number } = {};
	for (const s of stones) {
		if (counter[s]) {
			counter[s] = counter[s] + 1;
		} else {
			counter[s] = 1;
		}
	}
	const newStones = Array.from(new Set(stones));
	return newStones.reduce(
		(total, s) => total + run([s], 38).length * (counter[s] || 1),
		0,
	);
	//stones = stones.flatMap((s) => run([s], 25));
	return stones.length;
}
