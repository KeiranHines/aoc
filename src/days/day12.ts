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

class Plot {
	x: number;
	y: number;
	char: string;
	up?: Plot;
	down?: Plot;
	left?: Plot;
	right?: Plot;
	perim?: number;
	constructor(x: number, y: number, char: string) {
		this.x = x;
		this.y = y;
		this.char = char;
	}
}

function solvePrice(allPlots: Array<Plot>) {
	let total = 0;
	while (allPlots.length > 0) {
		let area = 0;
		let perim = 0;
		const connected: Array<Plot> = [];
		connected.push(allPlots[0]);
		while (connected.length > 0) {
			const point = connected.pop()!;
			allPlots.splice(allPlots.indexOf(point), 1);
			perim += point.perim!;
			area++;
			if (
				point.up && allPlots.indexOf(point.up) > -1 &&
				!connected.includes(point.up)
			) {
				connected.push(point.up);
			}
			if (
				point.down && allPlots.indexOf(point.down) > -1 &&
				!connected.includes(point.down)
			) {
				connected.push(point.down);
			}
			if (
				point.left && allPlots.indexOf(point.left) > -1 &&
				!connected.includes(point.left)
			) {
				connected.push(point.left);
			}
			if (
				point.right && allPlots.indexOf(point.right) > -1 &&
				!connected.includes(point.right)
			) {
				connected.push(point.right);
			}
		}
		total += area * perim;
	}
	return total;
}

function findGaps(
	m: Map<number, Array<number>>,
	alt: Map<number, Array<number>>,
	h: boolean,
): number {
	let walls = 0;
	const keys: Array<number> = [];
	const values: Array<Array<number>> = [];
	m.entries().forEach(([k, r]) => {
		r.sort();
		keys.push(k);
		values.push(r);
	});
	values.forEach((row, index) => {
		if (
			values[index + 1] &&
			values[index + 1][values[index + 1].length - 1] !=
				row[row.length - 1]
		) {
			// End of the lines are different wall
			walls++;
		}
		if (values[index + 1] && values[index + 1][0] != row[0]) {
			// End of the lines are different wall
			walls++;
		}
		//console.log(row);
		let i = 0;
		while (i < row.length - 1) {
			let j = 1;
			while (i + j <= row.length - 1) {
				if (row[i] + j != row[i + j]) {
					// gap break
					//console.log(keys[index], "has gap");
					const a = keys[index];
					const b = row[i] + j;
					//if (h) {
					//} else {
					//y = index;
					//x = row[i] + j;
					//}
					let connected = 0;
					if (m.get(a)?.includes(b - 1)) {
						connected++;
					}
					if (m.get(a)?.includes(b + 1)) {
						connected++;
					}
					if (m.get(a - 1)?.includes(b - 1)) {
						connected++;
					}
					if (m.get(a - 1)?.includes(b)) {
						connected++;
					}
					if (m.get(a - 1)?.includes(b + 1)) {
						connected++;
					}
					if (m.get(a + 1)?.includes(b - 1)) {
						connected++;
					}
					if (m.get(a + 1)?.includes(b)) {
						connected++;
					}
					if (m.get(a + 1)?.includes(b + 1)) {
						connected++;
					}
					if (connected == 5) {
						walls += 2;
					} else if (connected == 6) {
						walls++;
					} else if (connected >= 7) {
						walls += 2;
					} else if (connected == 4) {
						walls++;
					} else {
						console.log("connected", connected, a, b);
					}

					break;
				}
				j++;
			}
			i += j;
		}
		//console.log(index, walls);
	});
	return walls;
}

function solveDiscountPrice(allPlots: Array<Plot>, map: Array<Array<Plot>>) {
	let total = 0;
	while (allPlots.length > 0) {
		let area = 0;
		const connected: Array<Plot> = [];
		connected.push(allPlots[0]);
		const group = [];
		while (connected.length > 0) {
			const point = connected.pop()!;
			group.push(point);
			allPlots.splice(allPlots.indexOf(point), 1);
			area++;
			if (
				point.up && allPlots.indexOf(point.up) > -1 &&
				!connected.includes(point.up)
			) {
				connected.push(point.up);
			}
			if (
				point.down && allPlots.indexOf(point.down) > -1 &&
				!connected.includes(point.down)
			) {
				connected.push(point.down);
			}
			if (
				point.left && allPlots.indexOf(point.left) > -1 &&
				!connected.includes(point.left)
			) {
				connected.push(point.left);
			}
			if (
				point.right && allPlots.indexOf(point.right) > -1 &&
				!connected.includes(point.right)
			) {
				connected.push(point.right);
			}
		}
		let walls = 4;
		const yMap = new Map<number, Array<number>>();
		const xMap = new Map<number, Array<number>>();
		group.forEach((p) => {
			if (!yMap.has(p.y)) {
				yMap.set(p.y, []);
			}
			if (!xMap.has(p.x)) {
				xMap.set(p.x, []);
			}
			yMap.get(p.y)?.push(p.x);
			xMap.get(p.x)?.push(p.y);
		});

		const yWalls = findGaps(yMap, xMap, false);
		walls += yWalls;
		const xWalls = findGaps(xMap, yMap, false);
		walls += xWalls;
		if (walls % 2 != 0) {
			console.log("Monkey patch for odd number of walls");
			walls++;
		}
		total += area * walls;
		//console.log(group[0].char, area, walls);
	}
	return total;
}

export function part1(input: string): number {
	const plots: Array<Array<Plot>> = input.split("\n").map((row, rowIndex) =>
		row.split("").map((char, colIndex) =>
			new Plot(colIndex, rowIndex, char)
		)
	);
	const allPlots = plots.flatMap((x) => x);
	// Link all like plots
	allPlots.forEach((plot) => {
		let perim = 4;
		if (plot.y > 0 && plots[plot.y - 1][plot.x].char == plot.char) {
			plot.up = plots[plot.y - 1][plot.x];
			perim--;
		}
		if (
			plot.y < plots.length - 1 &&
			plots[plot.y + 1][plot.x].char == plot.char
		) {
			plot.down = plots[plot.y + 1][plot.x];
			perim--;
		}
		if (plot.x > 0 && plots[plot.y][plot.x - 1].char == plot.char) {
			plot.left = plots[plot.y][plot.x - 1];
			perim--;
		}
		if (
			plot.x < plots[plot.y].length - 1 &&
			plots[plot.y][plot.x + 1].char == plot.char
		) {
			plot.right = plots[plot.y][plot.x + 1];
			perim--;
		}
		plot.perim = perim;
	});
	return solvePrice(allPlots);
}

export function part2(input: string): number {
	const plots: Array<Array<Plot>> = input.split("\n").map((row, rowIndex) =>
		row.split("").map((char, colIndex) =>
			new Plot(colIndex, rowIndex, char)
		)
	);
	const allPlots = plots.flatMap((x) => x);
	// Link all like plots
	allPlots.forEach((plot) => {
		let perim = 4;
		if (plot.y > 0 && plots[plot.y - 1][plot.x].char == plot.char) {
			plot.up = plots[plot.y - 1][plot.x];
			perim--;
		}
		if (
			plot.y < plots.length - 1 &&
			plots[plot.y + 1][plot.x].char == plot.char
		) {
			plot.down = plots[plot.y + 1][plot.x];
			perim--;
		}
		if (plot.x > 0 && plots[plot.y][plot.x - 1].char == plot.char) {
			plot.left = plots[plot.y][plot.x - 1];
			perim--;
		}
		if (
			plot.x < plots[plot.y].length - 1 &&
			plots[plot.y][plot.x + 1].char == plot.char
		) {
			plot.right = plots[plot.y][plot.x + 1];
			perim--;
		}
		plot.perim = perim;
	});
	return solveDiscountPrice(allPlots, plots);
}
