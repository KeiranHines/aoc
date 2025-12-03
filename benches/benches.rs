use criterion::{Criterion, criterion_group, criterion_main};
use std::fs;
use std::hint::black_box;

#[path = "../src/day3.rs"]
mod day3;
use day3::{parse, part2};

fn criterion_day3_part2(c: &mut Criterion) {
    let contents = fs::read_to_string("inputs/day3.txt").unwrap();
    let ranges = parse(&contents);
    c.bench_function("day3_part2", |b| {
        b.iter(|| part2(black_box(ranges.clone())))
    });
}

criterion_group!(benches, criterion_day3_part2);
criterion_main!(benches);
