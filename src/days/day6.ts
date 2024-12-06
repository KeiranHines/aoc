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
const up = [-1, 0];
const down = [1, 0];
const right = [0, 1];
const left = [0, -1];

function turnRight(dir: Array<number>) {
	switch (dir) {
		case up:
			return right;
		case right:
			return down;
		case down:
			return left;
		case left:
			return up;
	}
	return dir;
}

export function part1(input: string): number {
	let dir = up;
	let pos = [0, 0];
	let total = 0;

	const map = input.split("\n").map((row, rowIndex) => {
		const start = row.indexOf("^");
		if (start != -1) {
			pos = [rowIndex, start];
		}
		return row.split("");
	});
	try {
		while (true) {
			const next = pos.map((a, i) => a + dir[i]);
			const square = map[next[0]][next[1]];
			if (square == "." || square == "^" || square == "X") {
				// Step
				if (square != "X") {
					total++;
				}
				map[pos[0]][pos[1]] = "X";
				pos = next;
			}
			if (square == "#") {
				dir = turnRight(dir);
			}
		}
	} catch (e) {
		map[pos[0]][pos[1]] = "X";
		return total + 1;
	}
}

function checkHittingRight(
	start: Array<number>,
	rowIndex: number,
	colIndex: number,
	map: Array<Array<string>>,
) {
	let obsUp: Array<number> | undefined = undefined;
	let obsRight: Array<number> | undefined = undefined;
	if (rowIndex + 1 >= map.length) {
		return false;
	}
	const row = map[rowIndex + 1];
	for (let i = colIndex + 1; i < row.length; i++) {
		if (row[i] === "#") {
			obsRight = [rowIndex, i];
		}
	}
	for (let i = rowIndex - 1; i >= 0; i--) {
		if (map[i][colIndex + 1] === "#") {
			obsUp = [i, colIndex + 1];
			break;
		}
	}
	if (!obsUp && !obsRight) {
		// Need at least one of these corners
		return false;
	}
	if (obsUp && obsRight) {
		// Have both upper and right corner
		// validate top right corner can be placed
		if (obsUp[0] - 1 === start[0] && obsRight[1] - 1 === start[1]) {
			// Cannot place obs on start spot
			return false;
		}
		const lastRow = map[obsUp[0] + 1];
		for (let i = colIndex; i <= obsRight[1]; i++) {
			if (lastRow[i] === "#") {
				// There is another obs in our way.
				return false;
			}
		}
		return true;
	}
	if (obsUp) {
		// Find top right and fill bottom right
		const row2 = map[obsUp[0] + 1];
		for (let i = colIndex + 1; i < map.length; i++) {
			if (row2[i] === "#") {
				const lastCol = i - 1;
				for (let j = obsUp[0] + 1; j <= rowIndex; j++) {
					if (map[j][i] === "#") {
						return false;
					}
				}
				if (rowIndex == start[0] && lastCol == start[1]) {
					return false;
				}
			}
		}
		return true;
	}
	if (obsRight) {
		for (let i = rowIndex; i >= 0; i--) {
			if (map[i][obsRight[1]] === "#") {
				const lastRow = i + 1;
				for (let j = obsRight[1]; i >= colIndex + 2; j--) {
					if (map[lastRow][j] === "#") {
						return false;
					}
				}
				if (lastRow == start[0] && colIndex + 1 == start[1]) {
					return false;
				}
				return true;
			}
		}
	}
}

function checkHittingLeft(
	start: Array<number>,
	rowIndex: number,
	colIndex: number,
	map: Array<Array<string>>,
) {
	let obsDown: Array<number> | undefined = undefined;
	let obsLeft: Array<number> | undefined = undefined;
	const row = map[rowIndex];
	for (let i = colIndex - 1; i >= 0; i--) {
		if (row[i] === "#") {
			obsLeft = [rowIndex, i];
		}
	}
	for (let i = rowIndex + 1; i < map.length; i++) {
		if (map[i][colIndex - 1] === "#") {
			obsDown = [i, colIndex - 1];
			break;
		}
	}
	if (!obsDown && !obsLeft) {
		// Need at least one of these corners
		return false;
	}
	if (obsDown && obsLeft) {
		// I am top right, have bottom right and top left
		// validate bottom left corner can be placed
		if (obsDown[0] - 1 === start[0] && obsLeft[1] + 1 === start[1]) {
			// Cannot place obs on start spot
			return false;
		}
		const lastRow = map[obsDown[0] - 1];
		for (let i = colIndex; i >= 0; i--) {
			if (lastRow[i] === "#") {
				// There is another obs in our way.
				return false;
			}
		}
		return true;
	}
}

export function part2(input: string): number {
	let startPos = [0, 0];
	const originalMap = input.split("\n").map((row, rowIndex) => {
		const start = row.indexOf("^");
		if (start != -1) {
			startPos = [rowIndex, start];
		}
		return row.split("");
	});
	let totalOptions = 0;
	originalMap.forEach((row, rowIndex) => {
		row.forEach((point, pointIndex) => {
			const map = originalMap.map((r) => [...r]);
			map[rowIndex][pointIndex] = "#";
			if (point !== "^" && point !== "#") {
				// Added an obs to the new position. Run the map until a cycle is
				// detected
				let dir = up;
				let pos = startPos;
				let cycle = true;

				try {
					while (true) {
						const next = pos.map((a, i) => a + dir[i]);
						const square = map[next[0]][next[1]];
						if (square == undefined) {
							break;
						}
						if (square == "." || square == "^" || square == "X") {
							// Step
							if (square != "X") {
								cycle = false;
								map[pos[0]][pos[1]] = "X";
							}
							pos = next;
						}
						if (square == "#") {
							dir = turnRight(dir);
							if (dir == up) {
								if (cycle) {
									totalOptions++;
									console.log(
										rowIndex,
										pointIndex,
										"is a cycle",
									);
									break;
								} else {
									cycle = true;
								}
							}
						}
					}
				} catch (e) {
					map[pos[0]][pos[1]] = "X";
				}
			}
			// Reset to what the point was
			map[rowIndex][pointIndex] == point;
		});
	});
	return totalOptions;
}
