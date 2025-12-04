use std::{fs, time::Instant};

const RADIX: u32 = 10;

#[inline]
pub fn parse(contents: &str) -> Vec<Vec<u32>> {
    contents
        .trim()
        .lines()
        .map(|l| l.chars().map(|j| j.to_digit(RADIX).unwrap()).collect())
        .collect()
}

#[inline]
fn find_largest_set(banks: Vec<Vec<u32>>, count: usize) -> u64 {
    let mut total = 0;
    banks.iter().for_each(|b| {
        let mut start = 0;
        for i in (0..count).rev() {
            let sub = &b[start..b.len() - i];
            let mut max = sub.get(0).unwrap();
            let mut max_i = 0;
            for i in 1..sub.len() {
                let t = sub.get(i).unwrap();
                if t > max {
                    max = t;
                    max_i = i;
                }
            }
            start += 1 + max_i;
            let to_add = *max as u64 * 10u64.pow(i as u32);
            total += to_add;
        }
    });
    total
}

#[inline]
pub fn part1(banks: Vec<Vec<u32>>) -> u64 {
    find_largest_set(banks, 2)
}

#[inline]
pub fn part2(banks: Vec<Vec<u32>>) -> u64 {
    find_largest_set(banks, 12)
}

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

#[test]
fn test_example1() {
    let input = "987654321111111
811111111111119
234234234234278
818181911112111";
    let banks = parse(input);
    let p1 = part1(banks);
    assert_eq!(p1, 357)
}

#[test]
fn test_large() {
    let input = "987654321111111";
    let banks = parse(input);
    let p2 = part2(banks);
    assert_eq!(p2, 987654321111);
}

#[test]
fn test_example2() {
    let input = "987654321111111
811111111111119
234234234234278
818181911112111";
    let banks = parse(input);
    let p2 = part2(banks);
    assert_eq!(p2, 3121910778619)
}
