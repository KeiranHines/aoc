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

enum Direction {
	UP = "UP",
	DOWN = "DOWN",
	LEFT = "LEFT",
	RIGHT = "RIGHT",
}

class Node {
	x: number;
	y: number;
	c: string;
	cost?: number; // The lowest cost to get here
	parent?: Node; // The quickest way to get to this node is from here
	heuristic?: number;
	final?: number;
	direction?: Direction; // direction we were facing for the cost?
	constructor(x: number, y: number, c: string) {
		this.x = x;
		this.y = y;
		this.c = c;
	}
}

function compareNodes(a: Node, b: Node): number {
	return (b.final || 0) - (a.final || 0);
}

function getCost(from: Node, to: Node, d: Direction) {
	const isLeft = from.x > to.x;
	const isRight = from.x < to.x;
	const isUp = from.y > to.y;
	const isDown = from.y < to.y;
	if (
		(d == Direction.LEFT && isLeft) || (d == Direction.RIGHT && isRight) ||
		(d == Direction.UP && isUp) || (d == Direction.DOWN && isDown)
	) {
		// Just step forward
		return 1;
	}
	// Turn 90 and step. I assume we wont be stepping backwards I hope
	return 1001;
}

function heuristic(from: Node, to: Node, d: Direction) {
	const d1 = Math.abs(to.x - from.x);
	const d2 = Math.abs(to.y - from.y);
	if (d1 == 0 && d2 == 0) {
		//Goal
		return 0;
	}
	if (d1 == 0 && d == Direction.DOWN && d2 > 0) {
		// Goal is below and we are facing down. Go there
		return d1 + d2;
	}
	if (d1 == 0 && d == Direction.UP && d2 < 0) {
		// Goal is above and we are facing up. Go there
		return d1 + d2;
	}
	if (d2 == 0 && d == Direction.RIGHT && d1 > 0) {
		// Goal is right and we are facing right. Go there
		return d1 + d2;
	}
	if (d2 == 0 && d == Direction.LEFT && d1 < 0) {
		// Goal is left and we are facing left. Go there
		return d1 + d2;
	}
	// May need to update this to check a direction and attempt to
	// guess if we need one turn or two
	// We need at least one turn to get to the goal
	return d1 + d2 + 1000;
}

function getDirection(from: Node, to: Node) {
	const x = from.x - to.x;
	const y = from.y - to.y;
	if (x < 0) {
		return Direction.RIGHT;
	}
	if (x > 0) {
		return Direction.LEFT;
	}
	if (y < 0) {
		return Direction.DOWN;
	}
	if (y > 0) {
		return Direction.UP;
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
			const gScore = (cur.cost || 0) + getCost(cur, n, cur.direction!);
			if (!open.includes(n)) {
				betterCost = true;
				n.heuristic = heuristic(n, end, cur.direction!);
				open.push(n);
			} else if (n.cost === undefined || gScore < n.cost) {
				// Seen this before but this way is quicker
				betterCost = true;
			}

			if (betterCost) {
				n.parent = cur;
				n.cost = gScore;
				n.direction = getDirection(cur, n);
				n.final = n.cost + n.heuristic!;
			}
		}
	}
	return [];
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
				start.cost = 0;
				start.direction = Direction.RIGHT;
			}
			if (n.c === "E") {
				end = n;
			}
		})
	);
	//@ts-expect-error this wont be undefined
	const path = aStar(map, start, end);
	return path[path.length - 1].cost!;
}

class Checker {
	path: Array<Node>;
	map: Array<Array<Node>>;
	constructor(path: Array<Node>, map: Array<Array<Node>>) {
		this.path = path;
		this.map = map;
	}
}

export function part2(input: string): number {
	const map = input.split("\n").map((row, ri) =>
		row.split("").map((c, ci) => new Node(ci, ri, c))
	);
	let start: Node;
	let end: Node;
	map.forEach((r) =>
		r.forEach((n) => {
			if (n.c === "S") {
				start = n;
				start.cost = 0;
				start.direction = Direction.RIGHT;
			}
			if (n.c === "E") {
				end = n;
			}
		})
	);
	//@ts-expect-error this wont be undefined
	const initialPath = aStar(map, start, end);
	const initialCost = initialPath[initialPath.length - 1].cost!;
	const pathsToCheck: Array<Checker> = [];
	const bestSeats: Map<number, Set<number>> = new Map();
	initialPath.forEach((n) => {
		if (!bestSeats.has(n.x)) {
			bestSeats.set(n.x, new Set());
		}
		bestSeats.get(n.x)?.add(n.y);
	});
	pathsToCheck.push(new Checker(initialPath, map));
	const checked: Map<number, Array<number>> = new Map();
	while (pathsToCheck.length > 0) {
		console.log(pathsToCheck.length);
		const check = pathsToCheck.pop()!;
		// iterate all except the first start and last end node
		for (let i = 1; i < check.path.length - 2; i++) {
			const cp = check.map.map((r) => [...r]);
			const point = check.path[i];
			//if (checked.get(point.y)?.includes(point.x)) {
			//	continue;
			//}
			if (!checked.has(point.y)) {
				checked.set(point.y, []);
			}
			checked.get(point.y)?.push(point.x);
			cp[point.y][point.x] = new Node(point.x, point.y, "#");
			//@ts-expect-error this wont be undefined
			const newPath = aStar(cp, start, end);
			if (
				newPath.length > 0 &&
				newPath[newPath.length - 1].cost == initialCost
			) {
				const c = bestSeats.values().reduce((t, s) => t + s.size, 0);
				newPath.forEach((n) => {
					if (!bestSeats.has(n.x)) {
						bestSeats.set(n.x, new Set());
					}
					bestSeats.get(n.x)?.add(n.y);
				});
				const c2 = bestSeats.values().reduce((t, s) => t + s.size, 0);
				if (c2 > c) {
					pathsToCheck.push(new Checker(newPath, map));
				}
			}
		}
	}
	return bestSeats.values().reduce((t, s) => t + s.size, 0);
}
