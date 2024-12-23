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

class Computer {
	name: string;
	connections: Array<Computer> = [];
	constructor(name: string) {
		this.name = name;
	}
}

function findLongest(connections: Array<Computer>, seen: Array<Computer>) {
	let longest = seen;
	for (const c of connections) {
		let joint = true;
		if (seen.includes(c)) {
			continue;
		}
		for (const s of seen) {
			if (!c.connections.includes(s)) {
				joint = false;
				break;
			}
		}
		if (joint) {
			const next = findLongest(c.connections, [...seen, c]);
			if (next.length > longest.length) {
				longest = next;
			}
		}
	}
	return longest;
}

function makeLan(connection: Array<Array<string>>): Map<string, Computer> {
	const seen: Map<string, Computer> = new Map();
	connection.forEach((c) => {
		const from = seen.get(c[0]) || new Computer(c[0]);
		const to = seen.get(c[1]) || new Computer(c[1]);
		seen.set(c[0], from);
		seen.set(c[1], to);
		from.connections.push(to);
		to.connections.push(from);
	});
	return seen;
}

export function part1(input: string): number {
	const connections = input.split("\n").map((x) => x.split("-"));
	const computers = makeLan(connections);
	const paths: Set<string> = new Set();
	computers.forEach((computer, name) => {
		if (name.startsWith("t")) {
			computer.connections.forEach((c2) => {
				c2.connections.forEach((c3) => {
					if (computer.connections.includes(c3)) {
						paths.add(
							[computer.name, c3.name, c2.name].sort().join(","),
						);
					}
				});
			});
		}
	});
	return paths.size;
}

export function part2(input: string): string {
	const connections = input.split("\n").map((x) => x.split("-"));
	const computers = makeLan(connections);

	const seen: Array<Computer> = [];
	let longest: Array<Computer> = [];
	let long = 0;

	computers.values().toArray().forEach((c, i) => {
		console.log((i * 100) / computers.size, "%");
		if (!seen.includes(c)) {
			const lan = findLongest(c.connections, [c]);
			seen.push(...lan);
			if (lan.length > long) {
				long = lan.length;
				longest = lan;
			}
		}
	});
	return longest.map((c) => c.name).sort().join(",");
}
