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
	if (number == 0) {
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

function run(num: number, runs: number) {
	let state = [num];
	for (let i = 0; i < runs; i++) {
		state = state.flatMap((number) => next(number));
	}
	return state;
}
function makeCountMap(stones: Array<number>) {
	const counter: { [key: string]: number } = {};
	for (const s of stones) {
		if (counter[s]) {
			counter[s] = counter[s] + 1;
		} else {
			counter[s] = 1;
		}
	}
	return counter;
}

function makeCountMap2(stones: Array<number>) {
	const counter: Map<number, number> = new Map();
	for (const s of stones) {
		if (counter.has(s)) {
			//@ts-expect-error its fine
			counter.set(s, counter.get(s) + 1);
		} else {
			counter.set(s, 1);
		}
	}
	return counter;
}

function runIter(numbers: Array<number>, runs: number): number {
	let counter: Map<number, number> = makeCountMap2(numbers);
	for (let i = 0; i < runs; ++i) {
		const temp: Map<number, number> = new Map();
		counter.forEach((v, stone) => {
			next(stone).forEach((n) => {
				temp.set(n, (temp.get(n) || 0) + v);
			});
		});
		counter = temp;
	}
	return counter.values().reduce((t, x) => t + x, 0);
}

export function part1(input: string): number {
	return input.split(" ").reduce(
		(total, s) => total + run(+s, 25).length,
		0,
	);
}

export function part1_iter(input: string): number {
	const stones = input.split(" ").map((s) => +s);
	return runIter(stones, 25);
}

export function part2(input: string): number {
	const stones = input.split(" ").map((s) => +s);
	return runIter(stones, 75);
}
