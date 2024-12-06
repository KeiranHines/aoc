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

export function part2(input: string): number {
	// TODO: Implement part 2 here.
	return input.length;
}
