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

function findCorners(group: Array<Plot>, map: Array<Array<Plot>>): number {
	return group.reduce((c, p) => {
		// Outside easy corners
		// E.g.
		// BBB
		// BAA
		// BAA
		// Check for top left a if it is not connected to something left and up
		// its a corner not a continuation in that direction.
		c += (!p.left && !p.up) ? 1 : 0;
		c += (!p.right && !p.up) ? 1 : 0;
		c += (!p.left && !p.down) ? 1 : 0;
		c += (!p.right && !p.down) ? 1 : 0;
		// Inside harder corners
		// check diagonals in the map but not in the group when the two two
		// 'L' adjacent ones exist.
		// E.g.
		//AA
		//BA
		// Check for B not being in this group.
		c += p.left && p.up && !group.includes(map[p.y - 1][p.x - 1]) ? 1 : 0;
		c += p.right && p.up && !group.includes(map[p.y - 1][p.x + 1]) ? 1 : 0;
		c += p.left && p.down && !group.includes(map[p.y + 1][p.x - 1]) ? 1 : 0;
		c += p.right && p.down && !group.includes(map[p.y + 1][p.x + 1])
			? 1
			: 0;
		return c;
	}, 0);
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
		total += area * findCorners(group, map);
	}
	return total;
}

function connectPlots(plots: Array<Array<Plot>>) {
	const allPlots = plots.flatMap((x) => x);
	allPlots.forEach((plot) => {
		plot.perim = 4; // Initial case. Remove for every join
		if (plot.y > 0 && plots[plot.y - 1][plot.x].char == plot.char) {
			plot.up = plots[plot.y - 1][plot.x];
			plot.perim--;
		}
		if (
			plot.y < plots.length - 1 &&
			plots[plot.y + 1][plot.x].char == plot.char
		) {
			plot.down = plots[plot.y + 1][plot.x];
			plot.perim--;
		}
		if (plot.x > 0 && plots[plot.y][plot.x - 1].char == plot.char) {
			plot.left = plots[plot.y][plot.x - 1];
			plot.perim--;
		}
		if (
			plot.x < plots[plot.y].length - 1 &&
			plots[plot.y][plot.x + 1].char == plot.char
		) {
			plot.right = plots[plot.y][plot.x + 1];
			plot.perim--;
		}
	});
	return allPlots;
}

export function part1(input: string): number {
	const plots: Array<Array<Plot>> = input.split("\n").map((row, rowIndex) =>
		row.split("").map((char, colIndex) =>
			new Plot(colIndex, rowIndex, char)
		)
	);
	// Link all like plots
	const allPlots = connectPlots(plots);
	return solvePrice(allPlots);
}

export function part2(input: string): number {
	const plots: Array<Array<Plot>> = input.split("\n").map((row, rowIndex) =>
		row.split("").map((char, colIndex) =>
			new Plot(colIndex, rowIndex, char)
		)
	);
	const allPlots = connectPlots(plots);
	return solveDiscountPrice(allPlots, plots);
}
