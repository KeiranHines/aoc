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

class Node {
	x: number;
	y: number;
	c: string;
	constructor(x: number, y: number, c: string) {
		this.x = x;
		this.y = y;
		this.c = c;
	}
}

function neighbors(map: Array<Array<Node>>, node: Node): Array<Node> {
	const n = [];
	if (node.y > 0 && map[node.y - 1][node.x].c !== "#") {
		n.push(map[node.y - 1][node.x]);
	}
	if (node.y < map.length - 1 && map[node.y + 1][node.x].c !== "#") {
		n.push(map[node.y + 1][node.x]);
	}
	if (node.x > 0 && map[node.y][node.x - 1].c !== "#") {
		n.push(map[node.y][node.x - 1]);
	}
	if (node.x < map[node.y].length - 1 && map[node.y][node.x + 1].c !== "#") {
		n.push(map[node.y][node.x + 1]);
	}
	return n;
}

function getPath(map: Array<Array<Node>>, start: Node, end: Node) {
	let n = start;
	const path: Array<Node> = [];
	while (n != end) {
		path.push(n);
		let next = neighbors(map, n);
		next = next.filter((x) => !path.includes(x));
		n = next[0];
	}
	path.push(end);
	return path;
}

function solve(path: Array<Node>, check = 50, cheat = 20) {
	const savings: Map<number, number> = new Map();
	path.forEach((p, i) => {
		path.slice(i + check + 2).forEach((p2) => {
			const dist = Math.abs(p2.y - p.y) + Math.abs(p2.x - p.x);
			if (dist <= cheat) {
				const s = path.indexOf(p2) - i - dist;
				if (s >= check) {
					const c = savings.get(s) || 0;
					savings.set(s, c + 1);
				}
			}
		});
	});

	return savings.entries().reduce((t, [k, v]) => {
		if (k < check) {
			return t;
		}
		return t + v;
	}, 0);
}

export function part1(input: string): number {
	const map = input.split("\n").map((row, ri) =>
		row.split("").map((c, ci) => new Node(ci, ri, c))
	);
	let start: Node;
	let end: Node;
	map.forEach((r) =>
		r.forEach((n) => {
			if (n.c === "S") {
				start = n;
			}
			if (n.c === "E") {
				end = n;
			}
		})
	);
	//@ts-expect-error its fine
	const path = getPath(map, start, end);
	return solve(path, 100, 2);
}

export function part2(input: string, check = 100): number {
	const map = input.split("\n").map((row, ri) =>
		row.split("").map((c, ci) => new Node(ci, ri, c))
	);
	let start: Node;
	let end: Node;
	map.forEach((r) =>
		r.forEach((n) => {
			if (n.c === "S") {
				start = n;
			}
			if (n.c === "E") {
				end = n;
			}
		})
	);
	//@ts-expect-error its fine
	const path = getPath(map, start, end);
	return solve(path, check, 20);
}
