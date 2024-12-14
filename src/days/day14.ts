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

class Robot {
	x: number;
	y: number;
	vx: number;
	vy: number;
	constructor(x: number, y: number, vx: number, vy: number) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
	}
}

function calculateFinalPositions(robots: Array<Robot>, gx: number, gy: number) {
	robots.forEach((r) => {
		while (r.x < 0) {
			r.x += gx;
		}
		r.x = r.x % gx;
		while (r.y < 0) {
			r.y += gy;
		}
		r.y = r.y % gy;
	});
}

function calculateQuadrants(robots: Array<Robot>, gx: number, gy: number) {
	const midHoz = Math.floor(gy / 2);
	const midVert = Math.floor(gx / 2);

	const quad = [0, 0, 0, 0];
	robots.forEach((r) => {
		if (r.x < midVert && r.y < midHoz) {
			quad[0] = quad[0] + 1;
		}
		if (r.x > midVert && r.y < midHoz) {
			quad[1] = quad[1] + 1;
		}
		if (r.x < midVert && r.y > midHoz) {
			quad[2] = quad[2] + 1;
		}
		if (r.x > midVert && r.y > midHoz) {
			quad[3] = quad[3] + 1;
		}
	});
	return quad;
}

function findLine(robots: Array<Robot>, gx: number, gy: number) {
	const yMap = new Map();
	const xMap = new Map();
	robots.forEach((r) => {
		if (!yMap.has(r.y)) {
			yMap.set(r.y, 0);
		}
		yMap.set(r.y, yMap.get(r.y) + 1);
		if (!xMap.has(r.x)) {
			xMap.set(r.x, 0);
		}
		xMap.set(r.x, yMap.get(r.x) + 1);
	});
	for (const v of yMap.values()) {
		if (v >= gx / 4) {
			return true;
		}
	}
	for (const v of xMap.values()) {
		if (v >= gy / 4) {
			return true;
		}
	}
	return false;
}

function printGrid(robots: Array<Robot>, gx: number, gy: number, char = ".") {
	const midHoz = Math.floor(gy / 2);
	const midVert = Math.floor(gx / 2);
	const grid: Array<Array<number | string>> = [];
	for (let y = 0; y < gy; y++) {
		grid.push(Array(gx).fill(char));
	}
	robots.forEach((r) => {
		const pos = grid[r.y][r.x];
		if (pos == char) {
			grid[r.y][r.x] = 1;
		} else {
			//@ts-expect-error checked
			grid[r.y][r.x] = grid[r.y][r.x] + 1;
		}
	});
	grid.forEach((line) => line[midVert] = " ");
	grid.forEach((line, i) => console.log(i == midHoz ? "" : line.join("")));
}

export function part1(input: string, gx = 101, gy = 103, count = 100): number {
	const robots: Array<Robot> = [];
	input.split("\n").forEach((line) => {
		const parts = line.split(" ");
		const [x, y] = parts[0].split("=")[1].split(",");
		const [vx, vy] = parts[1].split("=")[1].split(",");
		robots.push(new Robot(+x, +y, +vx, +vy));
	});

	for (let i = 0; i < count; i++) {
		robots.forEach((r) => {
			r.x += r.vx;
			r.y += r.vy;
		});
	}

	calculateFinalPositions(robots, gx, gy);
	printGrid(robots, gx, gy);
	const quad = calculateQuadrants(robots, gx, gy);
	console.log(quad);
	return quad.reduce((t, q) => t * q, 1);
}

export function part2(
	input: string,
	gx = 101,
	gy = 103,
): number {
	const robots: Array<Robot> = [];
	input.split("\n").forEach((line) => {
		const parts = line.split(" ");
		const [x, y] = parts[0].split("=")[1].split(",");
		const [vx, vy] = parts[1].split("=")[1].split(",");
		robots.push(new Robot(+x, +y, +vx, +vy));
	});

	let i = 0;
	while (true) {
		i++;
		robots.forEach((r) => {
			r.x += r.vx;
			r.y += r.vy;
		});
		calculateFinalPositions(robots, gx, gy);
		if (findLine(robots, gx, gy)) {
			printGrid(robots, gx, gy, " ");
			prompt("Run " + i);
		}
	}

	return 0;
}
