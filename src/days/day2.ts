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

export function part1(input: string): number {
	const safe = input.split("\n").filter((report) => {
		let increasing = false;
		let decreasing = false;
		let prev: number | undefined = undefined;
		const valid = report.split(" ").every((level) => {
			const num = parseInt(level);
			if (prev) {
				if (num > prev + 3 || num < prev - 3 || num == prev) {
					return false;
				}
				if (num > prev) {
					increasing = true;
				}
				if (num < prev) {
					decreasing = true;
				}
			}
			prev = num;
			return true;
		});
		// JS Xor
		return valid && (increasing ? !decreasing : decreasing);
	});
	return safe.length;
}

function validateNumber(
	prev: number,
	num: number,
	direction: number,
) {
	if (num > prev + 3 || num < prev - 3 || num == prev) {
		return 0;
	}
	if (num > prev && direction >= 0) {
		return 1;
	}
	if (num < prev && direction <= 0) {
		return -1;
	}
	return 0;
}

function validateReport(report: number[], oneBad = false): boolean {
	let direction: number = 0;
	for (let i = 1; i < report.length; i++) {
		const v = validateNumber(report[i - 1], report[i], direction);
		if (direction == 0) {
			direction = v;
		}
		if (v == 0 || v != direction) {
			if (oneBad) {
				return false;
			}
			return report.some((_, index, list) => {
				const removed = [...list];
				removed.splice(index, 1);
				return validateReport(removed, true);
			});
		}
	}
	return true;
}

export function part2(input: string): number {
	const safe = input.split("\n").filter((report) => {
		const levels = report.split(" ").map((level) => parseInt(level));
		return validateReport(levels);
	});
	return safe.length;
}
