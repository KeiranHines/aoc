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
class Box {
	char: string;
	y: number;
	x: number;
	constructor(char: string, y: number, x: number) {
		this.char = char;
		this.y = y;
		this.x = x;
	}
}

function boxInBoxes(boxes: Set<Box>, y: number, x: number) {
	for (const b of boxes) {
		if (b.x == x && b.y == y) {
			return true;
		}
	}
	return false;
}
function shiftUp(
	map: Array<Array<string>>,
	x: number,
	y: number,
	boxSymbols = "O",
): boolean {
	if (y === 0) {
		return false;
	}
	if (map[y - 1][x] === "#") {
		return false;
	}
	if (map[y - 1][x] === ".") {
		map[y][x] = ".";
		map[y - 1][x] = "@";
		return true;
	}
	if (boxSymbols.includes(map[y - 1][x])) {
		const boxes: Set<Box> = new Set();
		if (map[y - 1][x] == "O") {
			boxes.add(new Box("O", y - 1, x));
		} else if (map[y - 1][x] == "[") {
			boxes.add(new Box("[", y - 1, x));
			boxes.add(new Box("]", y - 1, x + 1));
		} else if (map[y - 1][x] == "]") {
			boxes.add(new Box("[", y - 1, x - 1));
			boxes.add(new Box("]", y - 1, x));
		}
		while (true) {
			const initLength = boxes.size;
			for (const box of boxes) {
				const by = box.y;
				const bx = box.x;
				if (map[by - 1][bx] == "#") {
					return false;
				}
				if (
					boxSymbols.includes(map[by - 1][bx]) &&
					!boxInBoxes(boxes, by - 1, bx)
				) {
					if (map[by - 1][bx] == "O") {
						boxes.add(new Box("O", by - 1, bx));
					} else if (map[by - 1][bx] == "[") {
						boxes.add(new Box("[", by - 1, bx));
						boxes.add(new Box("]", by - 1, bx + 1));
					} else if (map[by - 1][bx] == "]") {
						boxes.add(new Box("[", by - 1, bx - 1));
						boxes.add(new Box("]", by - 1, bx));
					}
				}
			}
			if (boxes.size == initLength) {
				break;
			}
		}

		// Start from the top of the box stack to make moving them easier.
		Array.from(boxes).reverse().forEach((b) => {
			map[b.y - 1][b.x] = b.char;
			map[b.y][b.x] = ".";
		});
		map[y - 1][x] = "@";
		map[y][x] = ".";
		return true;
	}
	return false;
}
function shiftDown(
	map: Array<Array<string>>,
	x: number,
	y: number,
	boxSymbols = "O",
): boolean {
	if (y === map.length - 1) {
		return false;
	}
	if (map[y + 1][x] === "#") {
		return false;
	}
	if (map[y + 1][x] === ".") {
		map[y][x] = ".";
		map[y + 1][x] = "@";
		return true;
	}
	if (boxSymbols.includes(map[y + 1][x])) {
		const boxes: Set<Box> = new Set();
		if (map[y + 1][x] == "O") {
			boxes.add(new Box("O", y + 1, x));
		} else if (map[y + 1][x] == "[") {
			boxes.add(new Box("[", y + 1, x));
			boxes.add(new Box("]", y + 1, x + 1));
		} else if (map[y + 1][x] == "]") {
			boxes.add(new Box("[", y + 1, x - 1));
			boxes.add(new Box("]", y + 1, x));
		}
		while (true) {
			const initLength = boxes.size;
			for (const box of boxes) {
				const by = box.y;
				const bx = box.x;
				if (map[by + 1][bx] == "#") {
					return false;
				}
				if (
					boxSymbols.includes(map[by + 1][bx]) &&
					!boxInBoxes(boxes, by + 1, bx)
				) {
					if (map[by + 1][bx] == "O") {
						boxes.add(new Box("O", by + 1, bx));
					} else if (map[by + 1][bx] == "[") {
						boxes.add(new Box("[", by + 1, bx));
						boxes.add(new Box("]", by + 1, bx + 1));
					} else if (map[by + 1][bx] == "]") {
						boxes.add(new Box("[", by + 1, bx - 1));
						boxes.add(new Box("]", by + 1, bx));
					}
				}
			}
			if (boxes.size == initLength) {
				break;
			}
		}

		// Start from the top of the box stack to make moving them easier.
		Array.from(boxes).reverse().forEach((b) => {
			map[b.y + 1][b.x] = b.char;
			map[b.y][b.x] = ".";
		});
		map[y + 1][x] = "@";
		map[y][x] = ".";
		return true;
	}
	return false;
}
function shiftLeft(
	map: Array<Array<string>>,
	x: number,
	y: number,
	boxSymbols = "O",
): boolean {
	if (x === 0) {
		return false;
	}
	if (map[y][x - 1] === "#") {
		return false;
	}
	if (map[y][x - 1] === ".") {
		map[y][x] = ".";
		map[y][x - 1] = "@";
		return true;
	}
	if (boxSymbols.includes(map[y][x - 1])) {
		let i = 1;
		while (boxSymbols.includes(map[y][x - i - 1])) {
			i++;
		}
		// i boxes in a row to push potentially
		if (map[y][x - i - 1] === "#") {
			return false;
		}

		if (map[y][x - i - 1] === ".") {
			while (i > 0) {
				// TODO: Replace with moving a double wide box
				map[y][x - i - 1] = map[y][x - i];
				i--;
			}
			map[y][x - 1] = "@";
			map[y][x] = ".";
			return true;
		}
	}
	return false;
}
function shiftRight(
	map: Array<Array<string>>,
	x: number,
	y: number,
	boxSymbols = "O",
): boolean {
	if (x === 0) {
		return false;
	}
	if (map[y][x + 1] === "#") {
		return false;
	}
	if (map[y][x + 1] === ".") {
		map[y][x] = ".";
		map[y][x + 1] = "@";
		return true;
	}
	if (boxSymbols.includes(map[y][x + 1])) {
		let i = 1;
		while (boxSymbols.includes(map[y][x + i + 1])) {
			i++;
		}
		// i boxes in a row to push potentially
		if (map[y][x + i + 1] === "#") {
			return false;
		}

		if (map[y][x + i + 1] === ".") {
			while (i > 0) {
				map[y][x + i + 1] = map[y][x + i];
				i--;
			}
			map[y][x + 1] = "@";
			map[y][x] = ".";
			return true;
		}
	}
	return false;
}

function simulate(
	map: Array<Array<string>>,
	start: Array<number>,
	moves: Array<string>,
	boxSymbols = "O",
) {
	let x = start[1];
	let y = start[0];
	moves.forEach((m) => {
		switch (m) {
			case "^":
				if (shiftUp(map, x, y, boxSymbols)) {
					y--;
				}
				break;
			case "v":
				if (shiftDown(map, x, y, boxSymbols)) {
					y++;
				}
				break;
			case "<":
				if (shiftLeft(map, x, y, boxSymbols)) {
					x--;
				}
				break;
			case ">":
				if (shiftRight(map, x, y, boxSymbols)) {
					x++;
				}
				break;
			case "\n":
				break;
			default:
				console.log("error default case", m);
		}
	});
}

export function part1(input: string): number {
	const [mapInput, moveInputs] = input.split("\n\n");
	let pos: Array<number> = [];
	const map = mapInput.split("\n").map((row, index) => {
		const startIndex = row.indexOf("@");
		if (startIndex > -1) {
			pos = [index, startIndex];
		}
		return row.split("");
	});
	simulate(map, pos, moveInputs.split(""));
	const boxes: Array<Array<number>> = [];
	map.forEach((row, rowIndex) => {
		row.forEach((char, index) => {
			if (char == "O") {
				boxes.push([rowIndex, index]);
			}
		});
	});
	return boxes.reduce((t, box) => t + (box[0] * 100 + box[1]), 0);
}

export function part2(input: string): number {
	const [mapInput, moveInputs] = input.split("\n\n");
	const map = mapInput.split("\n").map((row) => {
		return row.split("").flatMap((c) => {
			switch (c) {
				case "#":
					return ["#", "#"];
				case "O":
					return ["[", "]"];
				case ".":
					return [".", "."];
				case "@":
					return ["@", "."];
			}
			return c;
		});
	});
	let pos: Array<number> = [];
	for (const ri in map) {
		const row = map[ri];
		for (const ci in row) {
			if (row[ci] == "@") {
				pos = [+ri, +ci];
			}
		}
	}
	simulate(map, pos, moveInputs.split(""), "[]");
	const boxes: Array<Array<number>> = [];
	map.forEach((row, rowIndex) => {
		row.forEach((char, index) => {
			if (char == "[") {
				boxes.push([rowIndex, index]);
			}
		});
	});
	return boxes.reduce((t, box) => t + (box[0] * 100 + box[1]), 0);
}
