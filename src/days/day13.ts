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

class Button {
	x: number;
	y: number;
	cost: number;
	presses: number;
	constructor(x: number, y: number, cost: number) {
		this.x = x;
		this.y = y;
		this.cost = cost;
		this.presses = 0;
	}
}
function solveEq(input: string, additional: number = 0) {
	const a_search = /A:.*?(\d+).*?(\d+)/g;
	const b_search = /B:.*?(\d+).*?(\d+)/g;
	const p_search = /Prize:.*?(\d+).*?(\d+)/g;
	const aParts = a_search.exec(input);
	const bParts = b_search.exec(input);
	const pParts = p_search.exec(input);
	const a = new Button(+aParts![1], +aParts![2], 3);
	const b = new Button(+bParts![1], +bParts![2], 1);
	const px = +pParts![1] + additional;
	const py = +pParts![2] + additional;
	const i = (b.x * py - b.y * px) / (a.y * b.x - a.x * b.y);
	const j = (px - i * a.x) / b.x;
	if (
		(px - i * a.x) % b.x == 0 &&
		(b.x * py - b.y * px) % (a.y * b.x - a.x * b.y) == 0
	) {
		return 3 * +i + j;
	}
	return 0;
}
export function part1(input: string): number {
	return input.split("\n\n").reduce((total, i) => total + solveEq(i), 0);
}

export function part2(input: string): number {
	return input.split("\n\n").reduce(
		(total, i) => total + solveEq(i, 10000000000000),
		0,
	);
}
