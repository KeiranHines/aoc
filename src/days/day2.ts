import { white } from "jsr:@std/internal@^1.0.5/styles";

export async function main() {
	const filepath = import.meta.filename || "";
	const parts = filepath.split("/");
	const DAY = parts[parts.length - 1].split(".")[0];

	const input = await Deno.readTextFile(`inputs/${DAY}`).catch(() => {
		console.warn(`Could not read file inputs/${DAY}`);
		Deno.exit(1);
	}).then((i) => i.trim());
	console.log(`Day ${DAY} part 1 answer is: `, part1(input));
	console.log(`Day ${DAY} part 2 answer is: `, part2(input));
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
	//console.log(prev, num);
	if (num > prev + 3 || num < prev - 3 || num == prev) {
		//	console.log("first 0");
		return 0;
	}
	if (num > prev && direction >= 0) {
		return 1;
	}
	if (num < prev && direction <= 0) {
		return -1;
	}
	//console.log("second 0");
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
				//			console.log("failed", v == 0, v != direction, direction);
				return false;
			}
			const withoutPrev = [
				...report.slice(0, i - 1),
				...report.slice(i, report.length),
			];
			const withoutCurrent = [
				...report.slice(0, i),
				...report.slice(i + 1, report.length),
			];
			/*	console.log(
				"checking next lists",
				report,
				withoutPrev,
				withoutCurrent,
			);*/
			return validateReport(withoutPrev, true) ||
				validateReport(withoutCurrent, true);
		}
	}
	return true;
}

export function part2(input: string): number {
	let iv = 0;
	const safe = input.split("\n").filter((report) => {
		const levels = report.split(" ").map((level) => parseInt(level));
		const valid = validateReport(levels);
		if (!valid) {
			iv++;
			console.log(levels, "is valid?", valid, iv);
		}
		return valid;
	});
	return safe.length; // TODO: Implement part 2 here.
}
