import { unimplemented } from "@std/assert/unimplemented";

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

enum OptCode {
	adv = 0,
	bxl = 1,
	bst = 2,
	jnz = 3,
	bxc = 4,
	out = 5,
	bdv = 6,
	cdv = 7,
}

class OptCodeComputer {
	A: number;
	B: number;
	C: number;
	out: Array<number> = [];
	constructor(a: number, b: number, c: number) {
		this.A = a;
		this.B = b;
		this.C = c;
	}
	comboOperand = (operand: number) => {
		if (operand === 4) {
			return this.A;
		}
		if (operand === 5) {
			return this.B;
		}
		if (operand === 6) {
			return this.C;
		}
		return operand;
	};

	reset = (a: number) => {
		this.A = a;
		this.B = 0;
		this.C = 0;

		this.out = [];
	};

	run = (instructions: Array<number>) => {
		let pointer = 0;
		while (pointer < instructions.length) {
			const optcode = instructions[pointer];
			switch (optcode) {
				case OptCode.adv:
					this.A = Math.trunc(
						this.A /
							2 ** this.comboOperand(instructions[++pointer]),
					);
					pointer++;
					break;
				case OptCode.bxl:
					this.B = this.B ^ instructions[++pointer];
					pointer++;
					break;
				case OptCode.bst:
					this.B = this.comboOperand(instructions[++pointer]) % 8;
					pointer++;
					break;
				case OptCode.jnz:
					if (this.A === 0) {
						pointer += 2;
						break;
					}
					pointer = instructions[++pointer];
					break;
				case OptCode.bxc:
					this.B = Number(BigInt(this.B) ^ BigInt(this.C));
					pointer += 2;
					break;
				case OptCode.out:
					this.out.push(
						this.comboOperand(instructions[++pointer]) % 8,
					);
					pointer++;
					break;
				case OptCode.bdv:
					this.B = Math.trunc(
						this.A /
							2 ** this.comboOperand(instructions[++pointer]),
					);
					pointer++;
					break;
				case OptCode.cdv:
					this.C = Math.trunc(
						this.A /
							2 ** this.comboOperand(instructions[++pointer]),
					);
					pointer++;
					break;
			}
		}
	};
}

export function part1(input: string): string {
	const [registers, program] = input.split("\n\n");
	const [a, b, c] = registers.split("\n").map((line) => +line.split(": ")[1]);
	const computer = new OptCodeComputer(a, b, c);
	const instructions = program.split(": ")[1].split(",").map((o) => +o);

	computer.run(instructions);
	return computer.out.join(",");
}

function solve(
	c: OptCodeComputer,
	instructions: Array<number>,
	digits: number,
	total: number,
): number | undefined {
	for (let i = 0; i < 8; i++) {
		const next = (total * 8) + i;
		c.reset(next);
		c.run(instructions);

		if (instructions.slice(digits).every((v, i) => c.out[i] == v)) {
			if (digits == 0) {
				return next;
			}
			const result = solve(c, instructions, digits - 1, next);
			if (result) {
				return result;
			}
		}
	}
	return undefined;
}

export function part2(input: string): number {
	const [registers, program] = input.split("\n\n");
	const [a, b, c] = registers.split("\n").map((line) => +line.split(": ")[1]);
	const computer = new OptCodeComputer(a, b, c);
	const instructions = program.split(": ")[1].split(",").map((o) => +o);

	return solve(computer, instructions, instructions.length - 1, 0)!;
}
