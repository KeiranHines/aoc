use std::{env, fs, time::Instant};

use regex::Regex;

fn part_1(content: &str) -> i32 {
    let re = Regex::new(r"(-?\d+)").unwrap();
    re.find_iter(content)
        .filter_map(|m| m.as_str().parse::<i32>().ok())
        .sum()
}
fn part_2(_content: &str) -> i16 {
    0
}

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total = Instant::now();

    println!("day 12");
    let args: Vec<String> = env::args().collect();
    if args.len() != 2 {
        println!("Requires file path to input as arg1");
    }
    let contents = fs::read_to_string(&args[1])?;
    let mut start = Instant::now();
    let p1 = part_1(&contents);
    let p1t = start.elapsed();
    start = Instant::now();
    let p2 = part_2(&contents);
    let p2t = start.elapsed();

    let t = total.elapsed();

    println!("Part 1: {p1} {p1t:?}, Part 2: {p2} {p2t:?} | Total: {t:?}");
    Ok(())
}
