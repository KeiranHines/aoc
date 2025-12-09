use criterion::{Criterion, criterion_group, criterion_main};
use std::fs;
use std::hint::black_box;
use tokio::runtime::Runtime;

#[path = "../src/bin/day1.rs"]
mod day1;
#[path = "../src/bin/day2.rs"]
mod day2;
#[path = "../src/bin/day3.rs"]
mod day3;
#[path = "../src/bin/day4.rs"]
mod day4;
#[path = "../src/bin/day5.rs"]
mod day5;
#[path = "../src/bin/day6.rs"]
mod day6;
#[path = "../src/bin/day7.rs"]
mod day7;
#[path = "../src/bin/day8.rs"]
mod day8;

fn day1(c: &mut Criterion) {
    let contents = fs::read_to_string("inputs/day1.txt").unwrap();

    let mut g = c.benchmark_group("day1");
    g.bench_function("part1", |b| {
        b.iter(|| day1::part1(50, black_box(&contents)))
    });
    g.bench_function("part2", |b| {
        b.iter(|| day1::part2(50, black_box(&contents)))
    });
}
fn day2(c: &mut Criterion) {
    let contents = fs::read_to_string("inputs/day2.txt").unwrap();
    let ranges = day2::parse(&contents);
    let mut g = c.benchmark_group("day2");
    let r = Runtime::new().expect("error creating runtime");

    g.bench_function("part1", |b| {
        b.iter(|| day2::part1(black_box(ranges.clone())))
    });

    g.bench_function("part2", |b| {
        b.to_async(&r)
            .iter(|| day2::part2(black_box(ranges.clone())));
    });
}
fn day3(c: &mut Criterion) {
    let contents = fs::read_to_string("inputs/day3.txt").unwrap();
    let ranges = day3::parse(&contents);
    let mut g = c.benchmark_group("day3");
    g.bench_function("part1", |b| {
        b.iter(|| day3::part1(black_box(ranges.clone())))
    });
    g.bench_function("part2", |b| {
        b.iter(|| day3::part2(black_box(ranges.clone())))
    });
}

fn day4(c: &mut Criterion) {
    let contents = fs::read_to_string("inputs/day4.txt").unwrap();
    let mut g = c.benchmark_group("day4");
    g.bench_function("part1", |b| b.iter(|| day4::part1(black_box(&contents))));
    g.bench_function("part2", |b| b.iter(|| day4::part2(black_box(&contents))));
}

fn day5(c: &mut Criterion) {
    let contents = fs::read_to_string("inputs/day5.txt").unwrap();
    let mut g = c.benchmark_group("day5");
    g.bench_function("part1", |b| b.iter(|| day5::part1(black_box(&contents))));
    g.bench_function("part2", |b| b.iter(|| day5::part2(black_box(&contents))));
}

fn day6(c: &mut Criterion) {
    let contents = fs::read_to_string("inputs/day6.txt").unwrap();
    let mut g = c.benchmark_group("day6");
    g.bench_function("part1", |b| b.iter(|| day6::part1(black_box(&contents))));
    g.bench_function("part2", |b| b.iter(|| day6::part2(black_box(&contents))));
}

fn day7(c: &mut Criterion) {
    let contents = fs::read_to_string("inputs/day7.txt").unwrap();
    let mut g = c.benchmark_group("day7");
    g.bench_function("part1", |b| b.iter(|| day7::part1(black_box(&contents))));
    g.bench_function("part2", |b| b.iter(|| day7::part2(black_box(&contents))));
}

fn day8(c: &mut Criterion) {
    let contents = fs::read_to_string("inputs/day8.txt").unwrap();
    let mut g = c.benchmark_group("day8");
    g.bench_function("part1", |b| b.iter(|| day8::part1(black_box(&contents))));
    g.bench_function("part2", |b| b.iter(|| day8::part2(black_box(&contents))));
}

criterion_group!(benches, day1, day2, day3, day4, day5, day6, day7, day8);
criterion_main!(benches);
