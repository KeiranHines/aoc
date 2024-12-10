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

function calculateScore(start: Point, map: Array<Array<Point>>): number {
	if (start.topography === 9) {
		start.score++;
		start.seen = true;
		return start.score;
	}
	start.seen = true;

	const toCheck: Array<Point> = [];

	if (start.x > 0) {
		const left = map[start.y][start.x - 1];
		if (start.topography + 1 === left.topography) {
			toCheck.push(left);
		}
	}
	if (start.x < map[start.y].length - 1) {
		const right = map[start.y][start.x + 1];
		if (start.topography + 1 === right.topography) {
			toCheck.push(right);
		}
	}
	if (start.y > 0) {
		const up = map[start.y - 1][start.x];
		if (start.topography + 1 === up.topography) {
			toCheck.push(up);
		}
	}
	if (start.y < map.length - 1) {
		const down = map[start.y + 1][start.x];
		if (start.topography + 1 === down.topography) {
			toCheck.push(down);
		}
	}
	console.log("\t", start, "toCheck = ", toCheck);
	while (toCheck.length > 0) {
		const next = toCheck.pop();
		if (next && !next.seen) {
			start.score += calculateScore(next, map);
		} else {
			start.score += next?.score || 0;
		}
	}

	return start.score;
}

export function part1(input: string): number {
	const trailheads: Array<Point> = [];
	const map: Array<Array<Point>> = input.split("\n").map((row, rowIndex) => {
		return row.split("").map((char, colIndex) => {
			const top = char == "." ? -1 : +char;
			const point = new Point(colIndex, rowIndex, top);
			if (char === "0") {
				trailheads.push(point);
			}
			return point;
		});
	});

	const score = trailheads.reduce(
		(total, head) => {
			console.log("before", head);
			console.log(
				map.map((row) => row.map((c) => c.score).join(",")).join("\n"),
			);
			calculateScore(head, map);
			console.log("after", head);
			console.log(
				map.map((row) => row.map((c) => c.score).join(",")).join("\n"),
			);
			return total + head.score;
		},
		0,
	);
	console.log(trailheads);
	return score;
}

export function part2(input: string): number {
	// TODO: Implement part 2 here.
	return input.length;
}
