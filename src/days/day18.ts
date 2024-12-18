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
function compareNodes(a: Node, b: Node): number {
	return (b.final || 0) - (a.final || 0);
}

function heuristic(from: Node, to: Node) {
	const d1 = Math.abs(to.x - from.x);
	const d2 = Math.abs(to.y - from.y);
	return d1 + d2;
}
class Node {
	x: number;
	y: number;
	c: string;
	cost?: number; // The lowest cost to get here
	parent?: Node; // The quickest way to get to this node is from here
	heuristic?: number;
	final?: number;
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

function aStar(
	map: Array<Array<Node>>,
	start: Node,
	end: Node,
) {
	const open: Array<Node> = [];
	const closed: Array<Node> = [];
	open.push(start);
	while (open.length > 0) {
		open.sort(compareNodes);
		let cur = open.pop()!;

		if (cur == end) {
			const path: Array<Node> = [];
			while (cur.parent) {
				path.push(cur);
				cur = cur?.parent;
			}
			return path.reverse();
		}

		closed.push(cur);
		for (const n of neighbors(map, cur)) {
			if (closed.includes(n)) {
				continue;
			}
			let betterCost = false;
			const gScore = (cur.cost || 0) + 1;
			if (!open.includes(n)) {
				betterCost = true;
				n.heuristic = heuristic(n, end);
				open.push(n);
			} else if (n.cost === undefined || gScore < n.cost) {
				// Seen this before but this way is quicker
				betterCost = true;
			}

			if (betterCost) {
				n.parent = cur;
				n.cost = gScore;
				n.final = n.cost + n.heuristic!;
			}
		}
	}
	return [];
}

export function part1(
	input: string,
	bytes: number = 1024,
	x: number = 70,
	y: number = 70,
): number {
	const walls = input.split("\n").slice(0, bytes);
	const map: Array<Array<Node>> = [];
	for (let i = 0; i <= y; i++) {
		const row = [];
		for (let j = 0; j <= x; j++) {
			row.push(new Node(j, i, walls.includes(`${j},${i}`) ? "#" : "."));
		}
		map.push(row);
	}
	const start: Node = map[0][0];
	const end: Node = map[y][x];
	const path = aStar(map, start, end);
	return path.length;
}

export function part2(
	input: string,
	x: number = 70,
	y: number = 70,
): string {
	const allWalls = input.split("\n");
	for (let i = allWalls.length; i >= 0; i--) {
		const walls = allWalls.slice(0, i);
		const map: Array<Array<Node>> = [];
		for (let i = 0; i <= y; i++) {
			const row = [];
			for (let j = 0; j <= x; j++) {
				row.push(
					new Node(j, i, walls.includes(`${j},${i}`) ? "#" : "."),
				);
			}
			map.push(row);
		}
		const start: Node = map[0][0];
		const end: Node = map[y][x];
		const path = aStar(map, start, end);
		if (path.length > 0) {
			return allWalls[i];
		}
	}
	return `0,0`;
}
