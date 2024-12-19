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

export function part1(input: string): number {
	const [towels, orders] = input.split("\n\n");
	const options: Map<number, Array<string>> = new Map();
	let longest = 0;
	const ts = towels.split(", ");
	ts.forEach((t) => {
		if (!options.has(t.length)) {
			options.set(t.length, []);
		}
		if (t.length > longest) {
			longest = t.length;
		}
		options.get(t.length)?.push(t);
	});
	let r: RegExp;
	const keep = [...options.get(1)!, ...options.get(2)!];
	for (let i = 3; i <= longest; i++) {
		r = new RegExp(`^(${keep.join("|")})+$`, "g");
		const l = options.get(i);
		if (l) {
			for (const option of l) {
				const m = option.matchAll(r).toArray();
				if (m.length == 0) {
					// Could not be made by one of two char options keep it
					keep.push(option);
				}
			}
		}
	}

	r = new RegExp(`^(${keep.join("|")})+$`, "g");

	const tests = orders.split("\n");
	return tests.filter((t, i) => {
		console.log(i);
		return t.matchAll(r).toArray().length > 0;
	}).length;
}

function match(options: Map<string, Array<string>>, input: string): number {
	let count = 0;
	if (options.has(input[0])) {
		for (const o of options.get(input[0])!) {
			if (input.startsWith(o)) {
				if (input == o) {
					count++;
				} else {
					count += match(options, input.slice(o.length));
				}
			}
		}
	}
	return count;
}

function findAdditionalMatches(
	check: Array<string>,
	input: string,
): number {
	return check.reduce((t2, c) => {
		let i = 0;
		let count = 0;
		while (true) {
			i = input.indexOf(c, i);
			if (i < 0) {
				break;
			}
			count++;
		}
		return t2 + count;
	}, 0);
}

export function part2(input: string): number {
	const [towels, orders] = input.split("\n\n");
	const options: Map<number, Array<string>> = new Map();
	let longest = 0;
	const ts = towels.split(", ");
	ts.forEach((t) => {
		if (!options.has(t.length)) {
			options.set(t.length, []);
		}
		if (t.length > longest) {
			longest = t.length;
		}
		options.get(t.length)?.push(t);
	});
	let r: RegExp;
	const keep = [...options.get(1)!, ...options.get(2)!];

	const check: Array<string> = [];
	for (let i = 3; i <= longest; i++) {
		r = new RegExp(`^(${keep.join("|")})+$`, "g");
		const l = options.get(i);
		if (l) {
			for (const option of l) {
				const m = option.matchAll(r).toArray();
				if (m.length == 0) {
					// Could not be made by one of two char options keep it
					keep.push(option);
				} else {
					check.push(option);
				}
			}
		}
	}

	const sorted: Map<string, Array<string>> = new Map();
	keep.forEach((k) => {
		if (!sorted.has(k[0])) {
			sorted.set(k[0], []);
		}
		sorted.get(k[0])?.push(k);
	});
	console.log(sorted);
	const tests = orders.split("\n");
	return tests.reduce((total, t, i) => {
		console.log(new Date(), `${(i * 100) / tests.length}%`);
		const count = match(sorted, t);
		if (count == 0) {
			return total;
		}
		console.log("\t", new Date(), "match");
		return total + count + findAdditionalMatches(check, t);
	}, 0);
}
