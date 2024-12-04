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

function checkUp(
	map: Array<Array<string>>,
	rowNum: number,
	colNum: number,
	chars: Array<string>,
) {
	if (rowNum < chars.length) {
		return false;
	}
	return chars.every((char, index) =>
		map[rowNum - index - 1][colNum] === char
	);
}

function checkDown(
	map: Array<Array<string>>,
	rowNum: number,
	colNum: number,
	chars: Array<string>,
) {
	if (rowNum > map.length - chars.length - 1) {
		return false;
	}
	return chars.every((char, index) =>
		map[rowNum + index + 1][colNum] === char
	);
}

function checkLeft(
	map: Array<Array<string>>,
	rowNum: number,
	colNum: number,
	chars: Array<string>,
) {
	if (colNum < chars.length) {
		return false;
	}
	return chars.every((char, index) =>
		map[rowNum][colNum - index - 1] === char
	);
}

function checkRight(
	map: Array<Array<string>>,
	rowNum: number,
	colNum: number,
	chars: Array<string>,
) {
	if (colNum > map[rowNum].length - chars.length - 1) {
		return false;
	}
	return chars.every((char, index) =>
		map[rowNum][colNum + index + 1] === char
	);
}
function checkDownRight(
	map: Array<Array<string>>,
	rowNum: number,
	colNum: number,
	chars: Array<string>,
) {
	if (
		colNum > map[rowNum].length - chars.length - 1 ||
		rowNum > map.length - chars.length - 1
	) {
		return false;
	}
	return chars.every((char, index) =>
		map[rowNum + index + 1][colNum + index + 1] === char
	);
}

function checkDownLeft(
	map: Array<Array<string>>,
	rowNum: number,
	colNum: number,
	chars: Array<string>,
) {
	if (rowNum > map.length - chars.length - 1 || colNum < chars.length) {
		return false;
	}
	return chars.every((char, index) =>
		map[rowNum + index + 1][colNum - index - 1] === char
	);
}

function checkUpRight(
	map: Array<Array<string>>,
	rowNum: number,
	colNum: number,
	chars: Array<string>,
) {
	if (
		colNum > map[rowNum].length - chars.length - 1 || rowNum < chars.length
	) {
		return false;
	}
	return chars.every((char, index) =>
		map[rowNum - index - 1][colNum + index + 1] === char
	);
}

function checkUpLeft(
	map: Array<Array<string>>,
	rowNum: number,
	colNum: number,
	chars: Array<string>,
) {
	if (colNum < chars.length || rowNum < chars.length) {
		return false;
	}
	return chars.every((char, index) =>
		map[rowNum - index - 1][colNum - index - 1] === char
	);
}

export function part1(input: string): number {
	const map = input.split("\n").map((line) => line.split(""));
	let matches = 0;
	map.forEach((row, rowNum) => {
		row.forEach((char, colNum) => {
			if (char === "X") {
				matches = checkUp(map, rowNum, colNum, ["M", "A", "S"])
					? matches + 1
					: matches;
				matches = checkDown(map, rowNum, colNum, ["M", "A", "S"])
					? matches + 1
					: matches;
				matches = checkLeft(map, rowNum, colNum, ["M", "A", "S"])
					? matches + 1
					: matches;
				matches = checkRight(map, rowNum, colNum, ["M", "A", "S"])
					? matches + 1
					: matches;
				matches = checkDownLeft(map, rowNum, colNum, ["M", "A", "S"])
					? matches + 1
					: matches;
				matches = checkDownRight(map, rowNum, colNum, ["M", "A", "S"])
					? matches + 1
					: matches;
				matches = checkUpLeft(map, rowNum, colNum, ["M", "A", "S"])
					? matches + 1
					: matches;
				matches = checkUpRight(map, rowNum, colNum, ["M", "A", "S"])
					? matches + 1
					: matches;
			}
		});
	});
	return matches;
}

export function part2(input: string): number {
	// TODO: Implement part 2 here.
	return input.length;
}
