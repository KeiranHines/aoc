import { equal } from "@std/assert/equal";

export async function main() {
	const filepath = import.meta.filename || "";
	const parts = filepath.split("/");
	let day = parts[parts.length - 1].split(".")[0];

	const input = await Deno.readTextFile(`inputs/${day}`).catch(() => {
		console.warn(`Could not read file inputs/${day}`);
		Deno.exit(1);
	}).then((i) => i.trim());
	day = day.replace("day", "");
	//console.log(`Day ${day} part 1 answer is: `, part1(input));
	console.log(`Day ${day} part 2 answer is: `, part2(input));
}

if (import.meta.main) {
	await main();
}

//@ts-expect-error i said so
function* combinationN(array: Array<number>, n: number) {
	if (n === 0) {
		yield [];
		return;
	}
	if (n === 1) {
		for (const a of array) {
			yield [a];
		}
		return;
	}

	for (let i = 0; i <= array.length - n; i++) {
		//@ts-expect-error i said so
		for (const c of combinationN(array.slice(i + 1), n - 1)) {
			yield [array[i], ...c];
		}
	}
}
function findTotal(opts: Array<number>, total: number) {
	for (let i = 0; i <= opts.length; i++) {
		const indexMap = opts.map((_, index) => index);
		for (const c of combinationN(indexMap, i)) {
			//console.log(opts, ":", c);
			const calc = opts.reduce((total, opt, index) => {
				if (index == 0) {
					return opt;
				}
				if (c.includes(index)) {
					return total * opt;
				}
				return total + opt;
			}, 0);
			if (calc == total) {
				return true;
			}
		}
	}
	return false;
}
function findTotalConcat(opts: Array<number>, total: number) {
	for (let j = 0; j <= opts.length; j++) {
		for (let i = 0; i <= opts.length; i++) {
			const indexMap = opts.map((_, index) => index);
			for (const c1 of combinationN(indexMap, j)) {
				for (const c of combinationN(indexMap, i)) {
					//console.log(opts, ":", c);
					const calc = opts.reduce((total, opt, index) => {
						if (index == 0) {
							return opt;
						}
						if (c.includes(index) && c1.includes(index)) {
							return total * opt;
						}
						if (c.includes(index)) {
							return total + opt;
						}
						return +("" + total + "" + opt);
					}, 0);
					if (calc == total) {
						return true;
					}
				}
			}
		}
	}
	return false;
}

export function part1(input: string): number {
	return input.split("\n").reduce((total, equation) => {
		const [targetString, optString] = equation.split(": ");
		const target = +targetString;
		const opts = optString.split(" ").map((opt) => +opt);
		if (findTotal(opts, target)) {
			return total + target;
		}
		return total;
	}, 0);
}

export function part2(input: string): number {
	return input.split("\n").reduce((total, equation) => {
		const [targetString, optString] = equation.split(": ");
		const target = +targetString;
		const opts = optString.split(" ").map((opt) => +opt);
		if (findTotalConcat(opts, target)) {
			return total + target;
		}
		return total;
	}, 0);
}
