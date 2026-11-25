//! Criterion benchmarks for every solved part that has an input.
//! Picks up new days automatically from the registry in src/days/mod.rs.
//!
//!   cargo bench               # everything
//!   cargo bench -- day03      # one day
//!   cargo bench -- day03/part2

use std::hint::black_box;

use criterion::{Criterion, criterion_group, criterion_main};

fn benches(c: &mut Criterion) {
    for day in aoc::days::all() {
        let Some(input) = day.input() else { continue };
        let mut group = c.benchmark_group(day.name());
        for (name, part) in [("part1", day.part1), ("part2", day.part2)] {
            if let Some(part) = part {
                group.bench_function(name, |b| b.iter(|| part(black_box(&input))));
            }
        }
        group.finish();
    }
}

criterion_group!(days, benches);
criterion_main!(days);
