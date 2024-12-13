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

function getPerim(plot: Plot): number {
	let p = 0;
	if (!plot.up) {
		p++;
	}
	if (!plot.down) {
		p++;
	}
	if (!plot.left) {
		p++;
	}
	if (!plot.right) {
		p++;
	}
	return p;
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
			perim += getPerim(point);
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
		let walls = 0;
		const hasWalls = new Set();
		group.forEach((p) => {
			if (p.perim! < 5) {
				/*// This one has an outer edge. Work out which line.
				if (p.up === undefined && p.left === undefined) {
					walls++;
					hasWalls.add(p);
				}
				if (p.up === undefined && p.right === undefined) {
					walls++;
					hasWalls.add(p);
				}
				if (p.down === undefined && p.right === undefined) {
					walls++;
					hasWalls.add(p);
				}
				if (p.down === undefined && p.left === undefined) {
					walls++;
					hasWalls.add(p);
				}

				if (p.down === undefined && p.left === undefined) {
					walls++;
					hasWalls.add(p);
				}*/
				// Check for inside corners.
				if (
					p.y > 0 && p.x > 0 && map[p.y - 1][p.x - 1].char !== p.char
				) {
					walls++;
					hasWalls.add(p);
				}
				if (
					p.y > 0 && p.x < map[p.y - 1].length - 1 &&
					map[p.y - 1][p.x + 1].char !== p.char
				) {
					walls++;
					hasWalls.add(p);
				}
				if (
					p.y < map.length - 1 && p.x < map[p.y + 1].length - 1 &&
					map[p.y + 1][p.x + 1].char !== p.char
				) {
					walls++;
					hasWalls.add(p);
				}
				if (
					p.y < map.length - 1 && p.x > 0 &&
					map[p.y + 1][p.x - 1].char !== p.char
				) {
					walls++;
					hasWalls.add(p);
				}
			}
		});
		total += area * walls;
		console.log(group.map((p) => [p.y, p.x]));
		//@ts-expect-error testing
		console.log("has walls", Array.from(hasWalls).map((p) => [p.y, p.x]));
		console.log(group[0].char, area, walls);
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
		if (plot.y > 0 && plots[plot.y - 1][plot.x].char == plot.char) {
			plot.up = plots[plot.y - 1][plot.x];
		}
		if (
			plot.y < plots.length - 1 &&
			plots[plot.y + 1][plot.x].char == plot.char
		) {
			plot.down = plots[plot.y + 1][plot.x];
		}
		if (plot.x > 0 && plots[plot.y][plot.x - 1].char == plot.char) {
			plot.left = plots[plot.y][plot.x - 1];
		}
		if (
			plot.x < plots[plot.y].length - 1 &&
			plots[plot.y][plot.x + 1].char == plot.char
		) {
			plot.right = plots[plot.y][plot.x + 1];
		}
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
