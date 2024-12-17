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
	comboOperandString = (operand: number) => {
		if (operand === 4) {
			return "A";
		}
		if (operand === 5) {
			return "B";
		}
		if (operand === 6) {
			return "C";
		}
		return "" + operand;
	};

	reset = (a: number) => {
		this.A = a;
		this.B = 0;
		this.C = 0;

		this.out = [];
	};

	findADivisor = (instructions: Array<Number>) => {
		const outs = [];
		let firstAWrite: number;
		for (let i = 0; i < instructions.length; i++) {
			if (i % 2 == 0 && instructions[i] == OptCode.out) {
				outs.push(instructions[i + 1]);
				if (instructions[i + 1] == 4) {
					firstAWrite = i;
					break;
				}
			}
		}
		// Outs now contains all the outs up until the first time an operation with A
		// is written. Use that to find a starting condition for A
	};

	runToOutLimit = (instructions: Array<number>, limit: number) => {
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
					this.B = this.B ^ this.C;
					pointer += 2;
					break;
				case OptCode.out:
					this.out.push(
						this.comboOperand(instructions[++pointer]) % 8,
					);
					if (this.out.length > limit) {
						return;
					}
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
					this.B = this.B ^ this.C;
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
	runSolve = (instructions: Array<number>): boolean => {
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
					this.B = this.B ^ this.C;
					pointer += 2;
					break;
				case OptCode.out: {
					this.out.push(
						this.comboOperand(instructions[++pointer]) % 8,
					);
					let match = true;
					if (this.out.length > instructions.length) {
						return false;
					}
					for (let i = 0; i < this.out.length; i++) {
						if (this.out[i] != instructions[i]) {
							match = false;
							break;
						}
					}
					if (!match) {
						return false;
					}
					pointer++;
					break;
				}
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

		return this.out.length == instructions.length;
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

export function part2(input: string): number {
	const [registers, program] = input.split("\n\n");
	const [a, b, c] = registers.split("\n").map((line) => +line.split(": ")[1]);
	const computer = new OptCodeComputer(a, b, c);
	const instructions = program.split(": ")[1].split(",").map((o) => +o);
	// TODO Improve this factor so it scales up when we are under.
	const lowerLimit = 8 ** (instructions.length - 1);
	const upperLimit = 8 ** (instructions.length) - 1;
	console.log(lowerLimit, upperLimit);
	for (let i = lowerLimit; i <= upperLimit; i++) {
		if (i % 10_000_000 == 0) {
			console.log(
				i,
				((i - lowerLimit) * 100) / (upperLimit - lowerLimit),
				"%",
				computer.out.join(","),
			);
		}
		computer.reset(i);
		computer.run(instructions);
		let match = true;
		for (let j = 0; j < computer.out.length; j++) {
			if (computer.out[j] != instructions[j]) {
				match = false;
				break;
			}
		}
		if (match) {
			return i;
		}
		const shortC = computer.out.slice(1);
		const shortI = instructions.slice(1);
		for (let j = shortC.length; j >= 0; j--) {
			if (shortC[j] != shortI[j]) {
				// This seems to keep the last number the same.
				console.log("skipping");
				i = i * 4;
				console.log(computer.out.join(","));
				break;
			}
		}
	}
	return 0;
}
