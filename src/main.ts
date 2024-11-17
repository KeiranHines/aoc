/**
 * Utility function for running any days challenge from a deno task
 * e.g. `deno task run day1` will run the day one solution.
 */
async function run_day() {
	if (Deno.args.length < 1) {
		console.warn("Did not specify a day");
		console.warn("Run with `deno task run <day>` to run a day");
		console.warn("e.g. `deno task run day1` will run day 1");
		Deno.exit(2);
	}
	if (Deno.args.length > 1) {
		console.warn("Too many args. Only specify one arg, the day to run");
		Deno.exit(3);
	}
	const day = Deno.args[0];
	const { main } = await import(`./days/${day}.ts`).catch(() => {
		console.warn(`Could not load ./src/days/${day}.ts`);
		Deno.exit(1);
	});
	await main();
}

await run_day();
