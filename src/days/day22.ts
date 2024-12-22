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

function mix(secret: number, n: number): number {
	return Number(BigInt(secret) ^ BigInt(n));
}

function prune(secret: number): number {
	return secret % 16777216;
}

export function nextSecret(secret: number): number {
	let next = secret * 64;
	next = mix(secret, next);
	next = prune(next);
	next = mix(next, Math.floor(next / 32));
	next = prune(next);
	next = mix(next, next * 2048);
	next = prune(next);
	return next;
}

export function part1(input: string): number {
	return input.split("\n").reduce((t, n) => {
		let num = +n;
		for (let i = 0; i < 2000; i++) {
			num = nextSecret(num);
		}
		return t + num;
	}, 0);
}

export function calcPriceAndDelta(
	numbers: Array<number>,
): Array<Array<Array<number>>> {
	const prices: Array<Array<number>> = [];
	const deltas: Array<Array<number>> = [];
	numbers.forEach((n) => {
		const p: Array<number> = [];
		const d: Array<number> = [];

		let num = n;
		for (let i = 0; i < 2000; i++) {
			const next = nextSecret(num);
			p.push(next % 10);
			d.push((next % 10) - (num % 10));
			num = next;
		}
		prices.push(p);
		deltas.push(d);
	});
	return [prices, deltas];
}

export function calcScore(
	first: number,
	sec: number,
	thi: number,
	fourth: number,
	prices: Array<Array<number>>,
	deltas: Array<Array<number>>,
): number {
	let local = 0;
	for (let list = 0; list < deltas.length; list++) {
		const l = deltas[list];
		let c = l.indexOf(first);
		while (c != -1) {
			if (
				l[c + 1] == sec && l[c + 2] == thi &&
				l[c + 3] == fourth
			) {
				local += prices[list][c + 3];
				c = -1;
			} else {
				c = l.indexOf(first, c + 1);
			}
		}
	}
	return local;
}

export function part2(input: string): number {
	const nums = input.split("\n").map((n) => +n);
	const [prices, deltas] = calcPriceAndDelta(nums);
	let max = 0;
	for (let i = 3; i < deltas[0].length; i++) {
		const local = calcScore(
			deltas[0][i - 3],
			deltas[0][i - 2],
			deltas[0][i - 1],
			deltas[0][i],
			prices,
			deltas,
		);
		if (local > max) {
			max = local;
		}
	}
	return max;
}
