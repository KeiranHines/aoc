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

class Point {
	x: number = 0;
	y: number = 0;
	topography: number = -1;
	score: number = 0;
	seen: boolean = false;
	constructor(x: number, y: number, topography: number) {
		this.topography = topography;
		this.x = x;
		this.y = y;
	}
}

/**
 * Calculates all possible next points to travel to for a given point.
 * @param start The point to check from
 * @param map The map of points to find the next points in
 */
function* getNext(start: Point, map: Array<Array<Point>>): Generator<Point> {
	if (start.x > 0) {
		const left = map[start.y][start.x - 1];
		if (start.topography + 1 === left.topography) {
			yield left;
		}
	}
	if (start.x < map[start.y].length - 1) {
		const right = map[start.y][start.x + 1];
		if (start.topography + 1 === right.topography) {
			yield right;
		}
	}
	if (start.y > 0) {
		const up = map[start.y - 1][start.x];
		if (start.topography + 1 === up.topography) {
			yield up;
		}
	}
	if (start.y < map.length - 1) {
		const down = map[start.y + 1][start.x];
		if (start.topography + 1 === down.topography) {
			yield down;
		}
	}
}

/**
 * Calculates unique routes where each possible way to reach the same enpoint
 * counts as a unique route.
 *
 * @param start The point to check from.
 * @param map The map of points to search.
 */
function calculateUniqueRoutes(start: Point, map: Array<Array<Point>>): number {
	start.seen = true;
	if (start.topography === 9) {
		start.score++;
		return start.score;
	}

	const toCheck = getNext(start, map);
	let next;
	while (next = toCheck.next(), !next.done) {
		start.score += !next.value.seen
			? calculateUniqueRoutes(next.value, map)
			: next.value.score;
	}

	return start.score;
}

/**
 * Calculates unique endpoints where each possible way to reach the same enpoint
 * counts as a one endpoint.
 *
 * @param start The point to check from.
 * @param map The map of points to search.
 */
function calculateUninqueEndpoints(
	start: Point,
	map: Array<Array<Point>>,
): Array<Point> {
	if (start.topography === 9) {
		return [start];
	}
	const ends: Set<Point> = new Set();
	const toCheck = getNext(start, map);
	let next;
	while (next = toCheck.next(), !next.done) {
		calculateUninqueEndpoints(next.value, map).forEach((point) =>
			ends.add(point)
		);
	}

	return Array.from(ends);
}

export function part1(input: string): number {
	const trailheads: Array<Point> = [];
	const map: Array<Array<Point>> = input.split("\n").map((row, rowIndex) => {
		return row.split("").map((char, colIndex) => {
			const point = new Point(colIndex, rowIndex, +char);
			if (char === "0") {
				trailheads.push(point);
			}
			return point;
		});
	});

	const score = trailheads.reduce(
		(total, head) => total + calculateUninqueEndpoints(head, map).length,
		0,
	);
	return score;
}

export function part2(input: string): number {
	const trailheads: Array<Point> = [];
	const map: Array<Array<Point>> = input.split("\n").map((row, rowIndex) => {
		return row.split("").map((char, colIndex) => {
			const point = new Point(colIndex, rowIndex, +char);
			if (char === "0") {
				trailheads.push(point);
			}
			return point;
		});
	});

	const score = trailheads.reduce(
		(total, head) => total + calculateUniqueRoutes(head, map),
		0,
	);
	return score;
}
