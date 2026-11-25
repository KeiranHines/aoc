# AOC

## Description
Repo for Advent of Code challenges. One branch for each year.

This year is 2026 (12 days), written in Rust.

## Layout

```
src/days/dayNN.rs   one file per day: part1, part2 and example tests
src/days/mod.rs     registry of days, used by the runner and the benches
src/main.rs         runner: answers + timings, input fetching, README table
benches/days.rs     criterion benchmarks for every solved part
inputs/dayNN.txt    puzzle inputs (gitignored, see below)
```

## Solving a day

1. Fetch the input: `cargo aoc fetch 3`
2. In `src/days/day03.rs`, change `part1`'s return type from `Unsolved` to
   whatever the answer is (`u64`, `String`, anything `Display`) and implement it.
3. Paste the example into `EXAMPLE`, fill in the expected answer, and remove
   the `#[ignore]` on the test.
4. `cargo test day03` (or `bacon test -- day03` to rerun on save)
5. `cargo aoc 3`

Parts that still return `Unsolved` are skipped by the runner and the benches.

## Commands

| Command | What it does |
|---|---|
| `cargo aoc` | Run every solved day in release mode; print answers and times |
| `cargo aoc 3` | Run day 3 only |
| `cargo aoc fetch 3` | Download day 3's input to `inputs/day03.txt` |
| `cargo aoc readme` | Run every solved day and rewrite the results table below |
| `cargo bench` | Criterion benchmarks for all solved parts (report: `target/criterion/report/index.html`) |
| `cargo bench -- day03` | Benchmark one day (`day03/part2` for one part) |

`cargo aoc` times each part by running it repeatedly for up to 200 ms and
reporting the median. Use `cargo bench` for statistically sound numbers.

It also reports each part's **peak heap memory** and **allocation count**,
measured on the first run by a counting allocator (`src/memory.rs`). The input
string is allocated beforehand, so it isn't included. Stack memory isn't
measured. The allocator is only used by the runner, so tests and
`cargo bench` use the normal system allocator.

Everything is built with `-C target-cpu=native` (see `.cargo/config.toml`), so
times are specific to this machine's CPU and the binaries may not run on older
CPUs. Note that setting the `RUSTFLAGS` environment variable replaces this flag.

## Inputs

Puzzle inputs aren't committed; the [AoC FAQ](https://adventofcode.com/about#faq_copying)
asks that they not be redistributed. `cargo aoc fetch` reads your session cookie
from `AOC_SESSION` or a gitignored `.session` file in the repo root (copy the
`session` cookie from your browser while logged in to adventofcode.com). It
won't re-download an existing file or fetch a day before it unlocks. Set
`AOC_USER_AGENT` if you want to identify yourself to the AoC servers.

## Results

<!-- results:start -->
<!-- results:end -->
