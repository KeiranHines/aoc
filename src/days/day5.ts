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
	const [orders, updates] = input.split("\n\n");
	const orderMap: { [key: string]: Array<string> } = {};
	orders.split("\n").forEach((order) => {
		const [pre, post] = order.split("|");
		if (!Object.hasOwn(orderMap, post)) {
			orderMap[post] = [];
		}
		orderMap[post].push(pre);
	});
	return updates.split("\n").reduce((total, update) => {
		let needsSort = true;
		let changed = false;
		let pages = update.split(",");
		while (needsSort) {
			needsSort = false;
			const temp: Array<string> = [];
			for (let i = 0; i < pages.length; i++) {
				const order = orderMap[pages[i]];
				const after = [];
				for (const otherPage of pages.slice(i + 1)) {
					if (order && order.includes(otherPage)) {
						temp.push(otherPage);
						needsSort = true;
						changed = true;
					} else {
						after.push(otherPage);
					}
				}
				temp.push(pages[i]);
				if (needsSort) {
					pages = [...temp, ...after];
					break;
				}
			}
		}
		return !changed ? total + (+pages[(pages.length - 1) / 2]) : total;
	}, 0);
}

export function part2(input: string): number {
	// TODO: Implement part 2 here.
	return input.length;
}
