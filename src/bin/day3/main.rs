use std::{fs, time::Instant};
#[path = "../../day3.rs"]
mod day3;
use day3::{parse, part1, part2};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let contents = fs::read_to_string("inputs/day3.txt")?;
    let ranges = parse(&contents);
    let mut start = Instant::now();
    let p1 = part1(ranges.clone());
    let p1t = start.elapsed();
    start = Instant::now();
    let p2 = part2(ranges);
    let p2t = start.elapsed();
    println!("Part 1: {p1}, Part 2: {p2}");
    println!("Part 1: {p1t:?}, Part 2: {p2t:?}");
    Ok(())
}
