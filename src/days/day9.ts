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
	let id = -1;
	const disk: Array<string> = input.split("").flatMap((char, index) => {
		if (index % 2 == 0) {
			id++;
			return Array(+char).fill("" + id);
		}
		return Array(+char).fill(".");
	});
	let endPos = disk.length - 1;
	let total = 0;
	for (let i = 0; i < disk.length; i++) {
		if (disk[i] === ".") {
			while (disk[endPos] == "." && endPos > i) {
				endPos--;
			}
			disk[i] = disk[endPos];
			disk[endPos] = ".";
		}
	}

	for (let i = 0; i < disk.length; i++) {
		if (disk[i] === ".") {
			break;
		}
		total = total + (i * +disk[i]);
	}
	return total;
}

export function part2(input: string): number {
	let id = -1;
	const disk: Array<string> = input.split("").flatMap((char, index) => {
		if (index % 2 == 0) {
			id++;
			return Array(+char).fill("" + id);
		}
		return Array(+char).fill(".");
	});
	let total = 0;
	for (let i = disk.length - 1; i >= 0; i--) {
		if (disk[i] === ".") {
			continue;
		}
		const char = disk[i];
		let count = 0;
		while (disk[i] == char) {
			count++;
			i--;
		}
		i++;
		for (let j = 0; j < i; j++) {
			if (disk[j] === ".") {
				if (disk.slice(j, j + count).every((x) => x === ".")) {
					for (let k = 0; k < count; k++) {
						disk[j + k] = char;
						disk[i + k] = ".";
					}
					break;
				}
				// TODO Could and an else here to move forward the size of the gap that was there so that
				// every point isn't checked
			}
		}
	}
	for (let i = 0; i < disk.length; i++) {
		if (disk[i] === ".") {
			continue;
		}
		total = total + (i * +disk[i]);
	}
	return total;
}
