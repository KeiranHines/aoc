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
	const freqMap: { [key: string]: Array<Array<number>> } = {};

	const rows = input.split("\n");
	const height = rows.length;
	const width = rows[0].length;
	rows.forEach((row, rowIndex) => {
		row.split("").forEach((char, charIndex) => {
			if (char != ".") {
				if (!freqMap[char]) {
					freqMap[char] = [];
				}
				freqMap[char].push([rowIndex, charIndex]);
			}
		});
	});

	const antinodes = new Set();
	Object.values(freqMap).forEach((antennas) => {
		antennas.forEach((antenna, index) => {
			for (let i = 0; i < antennas.length; i++) {
				if (i == index) {
					continue;
				}
				const nextAntenna = antennas[i];
				const deltaY = antenna[0] - nextAntenna[0];
				const deltaX = antenna[1] - nextAntenna[1];
				const antiNodeX = antenna[1] + deltaX;
				const antiNodeY = antenna[0] + deltaY;
				if (
					(antiNodeX >= 0 && antiNodeX < width) &&
					(antiNodeY >= 0 && antiNodeY < height)
				) {
					antinodes.add(`${antiNodeY}, ${antiNodeX}`);
				}
			}
		});
	});
	return antinodes.size;
}

export function part2(input: string): number {
	const freqMap: { [key: string]: Array<Array<number>> } = {};

	const rows = input.split("\n");
	const height = rows.length;
	const width = rows[0].length;
	rows.forEach((row, rowIndex) => {
		row.split("").forEach((char, charIndex) => {
			if (char != ".") {
				if (!freqMap[char]) {
					freqMap[char] = [];
				}
				freqMap[char].push([rowIndex, charIndex]);
			}
		});
	});

	const antinodes = new Set();
	Object.values(freqMap).forEach((antennas) => {
		antennas.forEach((antenna, index) => {
			for (let i = 0; i < antennas.length; i++) {
				if (i == index) {
					continue;
				}
				const nextAntenna = antennas[i];
				const deltaY = antenna[0] - nextAntenna[0];
				const deltaX = antenna[1] - nextAntenna[1];
				let mult = 0;
				while (true) {
					const antiNodeX = antenna[1] + (deltaX * mult);
					const antiNodeY = antenna[0] + (deltaY * mult);
					if (
						(antiNodeX >= 0 && antiNodeX < width) &&
						(antiNodeY >= 0 && antiNodeY < height)
					) {
						antinodes.add(`${antiNodeY}, ${antiNodeX}`);
						mult++;
					} else {
						break;
					}
				}
			}
		});
	});
	return antinodes.size;
}
