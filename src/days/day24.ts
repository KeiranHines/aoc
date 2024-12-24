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

function process(r1: number, r2: number, cmd: string) {
	switch (cmd) {
		case "AND":
			return r1 && r2 ? 1 : 0;
		case "XOR":
			return r1 ^ r2 ? 1 : 0;
		case "OR":
			return r1 || r2 ? 1 : 0;
		default:
			console.log("unknown case", cmd);
			Deno.exit(1);
	}
}

class Command {
	r1: string;
	r2: string;
	cmd: string;
	r3: string;
	constructor(r1: string, r2: string, cmd: string, r3: string) {
		this.r1 = r1;
		this.r2 = r2;
		this.cmd = cmd;
		this.r3 = r3;
	}
}

export function part1(input: string): number {
	const [initialIn, opsIn] = input.split("\n\n");

	const registers: Map<string, number> = new Map();
	initialIn.split("\n").forEach((input) => {
		const [r, v] = input.split(": ");
		registers.set(r, +v);
	});
	const opsRegex = /(.+) (AND|XOR|OR) (.+) -> (.*)/;
	let commands = opsIn.split("\n").map((op) => {
		const [_, r1, cmd, r2, r3] = opsRegex.exec(op)!;
		return new Command(r1, r2, cmd, r3);
	});

	while (commands.length > 0) {
		const left: Array<Command> = [];
		for (const c of commands) {
			if (!registers.has(c.r1) || !registers.has(c.r2)) {
				left.push(c);
				continue;
			}
			const res = process(
				registers.get(c.r1)!,
				registers.get(c.r2)!,
				c.cmd,
			);
			registers.set(c.r3, res);
		}
		commands = left;
	}

	const zRegisters = registers.keys().toArray().filter((r) => r[0] == "z")
		.sort().reverse();
	return parseInt(zRegisters.map((k) => registers.get(k)!).join(""), 2);
}

function getZBitstring(registers: Map<string, number>) {
	const zRegisters = registers.keys().toArray().filter((r) => r[0] == "z")
		.sort().reverse();
	return zRegisters.map((k) => registers.get(k)!).join("");
}

function getTarget(registers: Map<string, number>) {
	const xRegisters = registers.keys().toArray().filter((r) => r[0] == "x")
		.sort().reverse();
	const yRegisters = registers.keys().toArray().filter((r) => r[0] == "y")
		.sort().reverse();
	const x = parseInt(xRegisters.map((k) => registers.get(k)!).join(""), 2);
	const y = parseInt(yRegisters.map((k) => registers.get(k)!).join(""), 2);
	const target = ((x + y) >>> 0).toString(2);
	return target;
}

function solve(registers: Map<string, number>, commands: Array<Command>) {
	while (commands.length > 0) {
		const left: Array<Command> = [];
		for (const c of commands) {
			if (!registers.has(c.r1) || !registers.has(c.r2)) {
				left.push(c);
				continue;
			}
			const res = process(
				registers.get(c.r1)!,
				registers.get(c.r2)!,
				c.cmd,
			);
			registers.set(c.r3, res);
		}
		commands = left;
	}
}
function getDrivers(
	registers: Map<string, number>,
	commands: Array<Command>,
) {
	const drivers: Map<string, Array<string>> = new Map();
	while (commands.length > 0) {
		const left: Array<Command> = [];
		for (const c of commands) {
			if (!registers.has(c.r1) || !registers.has(c.r2)) {
				left.push(c);
				continue;
			}
			const res = process(
				registers.get(c.r1)!,
				registers.get(c.r2)!,
				c.cmd,
			);
			const r1Drivers = drivers.get(c.r1) || [];
			const r2Drivers = drivers.get(c.r2) || [];
			const d = [...r1Drivers, ...r2Drivers];
			if (!(c.r1[0] == "x" || c.r1[0] == "y")) {
				d.push(c.r1);
			}
			if (!(c.r2[0] == "x" || c.r2[0] == "y")) {
				d.push(c.r2);
			}
			drivers.set(c.r3, d);
			registers.set(c.r3, res);
		}
		commands = left;
	}
	return drivers;
}

function* combinationN(
	array: Array<string>,
	n: number,
): Generator<Array<string>, void, void> {
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
		for (const c of combinationN(array.slice(i + 1), n - 1)) {
			yield [array[i], ...c];
		}
	}
}

export function part2(input: string): string {
	const [initialIn, opsIn] = input.split("\n\n");

	const initialRegisters: Map<string, number> = new Map();
	initialIn.split("\n").forEach((input) => {
		const [r, v] = input.split(": ");
		initialRegisters.set(r, +v);
	});
	const opsRegex = /(.+) (AND|XOR|OR) (.+) -> (.*)/;
	let initialCommands = opsIn.split("\n").map((op) => {
		const [_, r1, cmd, r2, r3] = opsRegex.exec(op)!;
		return new Command(r1, r2, cmd, r3);
	});
	const drivers = getDrivers(initialRegisters, initialCommands);

	const cp = new Map(initialRegisters);
	const ans = getZBitstring(cp);
	// All processed. Now calculate the correct bitstring for the addition.
	const target = getTarget(cp).padStart(ans.length, "0");
	console.log(target);
	console.log(ans);
	const wrong: Array<string> = [];
	target.split("").forEach((bit, i) => {
		if (bit != ans[i]) {
			wrong.push(`z${ans.length - 1 - i}`);
		}
	});
	const toCheck = drivers.entries().filter(([k, _]) => wrong.includes(k));
	const swaps: Array<string> = [];
	const swapOptions: Set<string> = new Set();
	const swapOptions2: Map<string, number> = new Map();
	toCheck.forEach(([k, v]) => {
		if (v.length == 0) {
			swaps.push(k);
		} else {
			v.forEach((r) => {
				swapOptions.add(r);
				const o = swapOptions2.get(r) || 0;
				swapOptions2.set(r, o + 1);
			});
		}
	});
	const byCount: Map<number, Array<string>> = new Map();
	swapOptions2.forEach((v, k) => {
		const l = byCount.get(v) || [];
		l.push(k);
		byCount.set(v, l);
	});
	const x = byCount.entries().filter(([_, v]) => v.length == 8).map((
		[_, v],
	) => v).toArray();

	for (const finalSwaps of x) {
		combinationN(finalSwaps, 8);
	}

	console.log(swaps);
	console.log(swapOptions);
	console.log(x);

	return "";
}

export function part2a(input: string): string {
	const [initialIn, opsIn] = input.split("\n\n");

	const initialRegisters: Map<string, number> = new Map();
	initialIn.split("\n").forEach((input) => {
		const [r, v] = input.split(": ");
		initialRegisters.set(r, +v);
	});
	const opsRegex = /(.+) (AND|XOR|OR) (.+) -> (.*)/;
	let initialCommands = opsIn.split("\n").map((op) => {
		const [_, r1, cmd, r2, r3] = opsRegex.exec(op)!;
		return new Command(r1, r2, cmd, r3);
	});
	const toZ = initialCommands.filter((c) => c.r3[0] != "z");
	const zCommands = initialCommands.filter((c) => c.r3[0] == "z");
	solve(initialRegisters, toZ);
	const cp = new Map(initialRegisters);
	const ans = getZBitstring(cp);
	// All processed. Now calculate the correct bitstring for the addition.
	const target = getTarget(cp).padStart(ans.length, "0").split("").reverse();

	console.log(target);
	const opts: Set<string> = new Set();
	for (const c of zCommands) {
		const ans = process(
			initialRegisters.get(c.r1)!,
			initialRegisters.get(c.r2)!,
			c.cmd,
		);
		const num = +c.r3.substring(1);
		if (ans != +target[num]) {
			console.log(c.r3, "needs a swap");
			opts.add(c.r1);
			opts.add(c.r2);
		}
	}
	console.log(opts);

	return "";
}
