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

export function numpad(from: string, to: string): Array<string> {
	switch (from) {
		case "A":
			switch (to) {
				case "A":
					return [""];
				case "0":
					return ["<"];
				case "1":
					return ["<^<", "^<<"];
				case "2":
					return ["<^", "^<"];
				case "3":
					return ["^"];
				case "4":
					return ["<^^<", "<^<^", "^^<<", "^<<^", "^<^<"];
				case "5":
					return ["^^<", "^<^", "<^^"];
				case "6":
					return ["^^"];
				case "7":
					return [
						"^^^<<",
						"^^<^<",
						"^<^^<",
						"<^^^<",
						"^^<<^",
						"^<^<^",
						"^<<^^",
						"<^^<^",
						"<^<^^",
					];
				case "8":
					return [
						"^^^<",
						"^^<^",
						"^<^^",
						"<^^^",
					];
				case "9":
					return ["^^^"];
				default:
					return [];
			}
		case "0":
			switch (to) {
				case "A":
					return [">"];
				case "0":
					return [""];
				case "1":
					return ["^<"];
				case "2":
					return ["^"];
				case "3":
					return [">^", "^>"];
				case "4":
					return ["^^<", "^<^"];
				case "5":
					return ["^^"];
				case "6":
					return ["^^>", "^>^", ">^^"];
				case "7":
					return ["^^^<", "^^<^", "^<^^"];
				case "8":
					return ["^^^"];
				case "9":
					return ["^^^>", "^^>^", "^>^^", ">^^^"];
				default:
					return [];
			}
		case "1":
			switch (to) {
				case "A":
					return [">>v", ">v>"];
				case "0":
					return [">v"];
				case "1":
					return [""];
				case "2":
					return [">"];
				case "3":
					return [">>"];
				case "4":
					return ["^"];
				case "5":
					return ["^>", ">^"];
				case "6":
					return [">>^", ">^>", "^>>"];
				case "7":
					return ["^^"];
				case "8":
					return ["^^>", "^>^", ">^^"];
				case "9":
					return ["^^>>", "^>^>", "^>>^", ">^^>", ">^>^", ">>^^"];
				default:
					return [];
			}
		case "2":
			switch (to) {
				case "A":
					return [">v", "v>"];
				case "0":
					return ["v"];
				case "1":
					return ["<"];
				case "2":
					return [""];
				case "3":
					return [">"];
				case "4":
					return ["^<", "<^"];
				case "5":
					return ["^"];
				case "6":
					return [">^", "^>"];
				case "7":
					return ["^^<", "^<^", "<^^"];
				case "8":
					return ["^^"];
				case "9":
					return ["^^>", "^>^", ">^^"];
				default:
					return [];
			}
		case "3":
			switch (to) {
				case "A":
					return ["v"];
				case "0":
					return ["<v", "v<"];
				case "1":
					return ["<<"];
				case "2":
					return ["<"];
				case "3":
					return [""];
				case "4":
					return ["<<^", "<^<", "^<<"];
				case "5":
					return ["<^", "^<"];
				case "6":
					return ["^"];
				case "7":
					return ["<<^^", "<^<^", "<^^<", "^<^<", "^^<<", "^<<^"];
				case "8":
					return ["<^^", "^<^", "^^<"];
				case "9":
					return ["^^"];
				default:
					return [];
			}
		case "4":
			switch (to) {
				case "A":
					return [">>vv", ">v>v", ">vv>", "v>v>", "v>>v"];
				case "0":
					return [">vv", "v>v"];
				case "1":
					return ["v"];
				case "2":
					return [">v", "v>"];
				case "3":
					return [">>v", ">v>", "v>>"];
				case "4":
					return [""];
				case "5":
					return [">"];
				case "6":
					return [">>"];
				case "7":
					return ["^"];
				case "8":
					return [">^", "^>"];
				case "9":
					return [">>^", ">^>", "^>>"];
				default:
					return [];
			}
		case "5":
			switch (to) {
				case "A":
					return [">vv", "v>v", "vv>"];
				case "0":
					return ["vv"];
				case "1":
					return ["<v", "v<"];
				case "2":
					return ["v"];
				case "3":
					return ["v>", ">v"];
				case "4":
					return ["<"];
				case "5":
					return [""];
				case "6":
					return [">"];
				case "7":
					return ["<^", "^<"];
				case "8":
					return ["^"];
				case "9":
					return ["^>", ">^"];
				default:
					return [];
			}
		case "6":
			switch (to) {
				case "A":
					return ["vv"];
				case "0":
					return ["vv<", "v<v", "<vv"];
				case "1":
					return ["<<v", "<v<", "v<<"];
				case "2":
					return ["<v", "v<"];
				case "3":
					return ["v"];
				case "4":
					return ["<<"];
				case "5":
					return ["<"];
				case "6":
					return [""];
				case "7":
					return ["<<^", "<^<", "^<<"];
				case "8":
					return ["<^", "^<"];
				case "9":
					return ["^"];
				default:
					return [];
			}
		case "7":
			switch (to) {
				case "A":
					return [
						">>vvv",
						">v>vv",
						">vv>v",
						">vvv>",
						"v>>vv",
						"v>v>v",
						"v>vv>",
						"vv>>v",
						"vv>v>",
					];
				case "0":
					return [">vvv", "v>vv", "vv>v"];
				case "1":
					return ["vv"];
				case "2":
					return ["vv>", "v>v", ">vv"];
				case "3":
					return ["vv>>", "v>v>", "v>>v", ">vv>", ">v>v", ">>vv"];
				case "4":
					return ["v"];
				case "5":
					return ["v>", ">v"];
				case "6":
					return ["v>>", ">v>", ">>v"];
				case "7":
					return [""];
				case "8":
					return [">"];
				case "9":
					return [">>"];
				default:
					return [];
			}
		case "8":
			switch (to) {
				case "A":
					return [">vvv", "v>vv", "vv>v", "vvv>"];
				case "0":
					return ["vvv"];
				case "1":
					return ["vv<", "v<v", "<vv"];
				case "2":
					return ["vv"];
				case "3":
					return ["vv>", "v>v", ">vv"];
				case "4":
					return ["v<", "<v"];
				case "5":
					return ["v"];
				case "6":
					return ["v>", ">v"];
				case "7":
					return ["<"];
				case "8":
					return [""];
				case "9":
					return [">"];
				default:
					return [];
			}
		case "9":
			switch (to) {
				case "A":
					return ["vvv"];
				case "0":
					return ["vvv<", "vv<v", "v<vv", "<vvv"];
				case "1":
					return ["vv<<", "v<v<", "v<<v", "<vv<", "<v<v", "<<vv"];
				case "2":
					return ["vv<", "v<v", "<vv"];
				case "3":
					return ["vv"];
				case "4":
					return ["v<<", "<v<", "<<v"];
				case "5":
					return ["<v", "v<"];
				case "6":
					return ["v"];
				case "7":
					return ["<<"];
				case "8":
					return ["<"];
				case "9":
					return [""];
				default:
					return [];
			}
		default:
			return [];
	}
}

export function controller(from: string, to: string): Array<string> {
	switch (from) {
		case "A":
			switch (to) {
				case "A":
					return [""];
				case "^":
					return ["<"];
				case "<":
					return ["v<<", "<v<"];
				case ">":
					return ["v"];
				case "v":
					return ["<v", "v<"];
				default:
					console.log("A default");
					return [];
			}
		case "^":
			switch (to) {
				case "A":
					return [">"];
				case "^":
					return [""];
				case "<":
					return ["v<"];
				case ">":
					return ["v>", ">v"];
				case "v":
					return ["v"];
				default:
					console.log("^ default");
					return [];
			}
		case "<":
			switch (to) {
				case "A":
					return [">>^", ">^>"];
				case "^":
					return [">^"];
				case "<":
					return [""];
				case ">":
					return [">>"];
				case "v":
					return [">"];
				default:
					console.log("< default");
					return [];
			}
		case ">":
			switch (to) {
				case "A":
					return ["^"];
				case "^":
					return ["^<", "<^"];
				case "<":
					return ["<<"];
				case ">":
					return [""];
				case "v":
					return ["<"];
				default:
					console.log("> default");
					return [];
			}
		case "v":
			switch (to) {
				case "A":
					return ["^>", ">^"];
				case "^":
					return ["^"];
				case "<":
					return ["<"];
				case ">":
					return [">"];
				case "v":
					return [""];
				default:
					console.log("v default");
					return [];
			}
		default:
			console.log("controller default");
			return [];
	}
}

export function encode(
	code: string,
	encoder: (from: string, to: string) => Array<string>,
): Array<string> {
	let options = encoder("A", code[0]).map((o) => o + "A");
	for (let i = 1; i < code.length; i++) {
		const branches = encoder(code[i - 1], code[i]);
		const newOps: Array<string> = [];
		options.forEach((o) => {
			branches.forEach((b) => {
				newOps.push(o + b + "A");
			});
		});
		options = newOps;
	}
	return options;
}

export function encodeLength(
	code: string,
	encoder: (from: string, to: string) => Array<string>,
): number {
	let total = encoder("A", code[0])[0].length + 1;
	for (let i = 1; i < code.length; i++) {
		const branches = encoder(code[i - 1], code[i]);
		total += branches[0].length + 1; //+1 for A
	}
	return total;
}

function shortestString(
	input: Array<string>,
	inital = Number.MAX_VALUE,
): string {
	let ans: string = "";
	let length = inital;
	input.forEach((i) => {
		if (i.length < length) {
			ans = i;
			length = i.length;
		}
	});
	return ans;
}

export function part1(input: string): number {
	const inputs = input.split("\n");
	let total = 0;
	inputs.forEach((i) => {
		// First numpad
		let curr = encode(i, numpad);
		//let s = shortestString(curr);
		//curr = curr.filter((n) => n.length == s.length);

		// first controller
		curr = curr.flatMap((c) => encode(c, controller));
		//s = shortestString(curr);
		//curr = curr.filter((n) => n.length == s.length);

		// second controller
		//curr = curr.flatMap((c) => encode(c, controller));
		//s = shortestString(curr);
		//console.log("second controller done");
		//curr = curr.filter((n) => n.length == s.length);
		// third controller
		//
		//console.log(i, ":", s);
		let shortest = Number.MAX_VALUE;
		let j = 0;
		for (const c2 of curr) {
			const temp = encodeLength(c2, controller);
			if (temp < shortest) {
				shortest = temp;
			}
			j++;
		}

		const n = parseInt(i.slice(0, -1));
		console.log(i, shortest, "*", n);
		total += shortest * n;
	});

	return total;
}

export function part2(input: string): number {
	// TODO: Implement part 2 here.
	return input.length;
}
