use std::{fs, time::Instant};

pub fn part1(mut initial: i32, input: &str) -> u32 {
    let mut zero_count = 0u32;
    input.lines().for_each(|l| {
        let d = if l.starts_with("L") { -1 } else { 1 };
        let s: i16 = l[1..].parse().unwrap();
        let scalar = s * d;

        let mut new_pos: i32 = (initial as i32) + (scalar as i32);
        new_pos = new_pos % 100;
        if new_pos < 0 {
            new_pos = 100 + new_pos;
        }

        if initial == 0 {
            zero_count += 1;
        }
        initial = new_pos;
    });
    zero_count
}

pub fn part2(mut initial: i32, input: &str) -> u32 {
    let mut zero_count = 0u32;
    input.lines().for_each(|l| {
        let starting = initial;
        let d = if l.starts_with("L") { -1 } else { 1 };
        let s: i16 = l[1..].parse().unwrap();
        let scalar = s * d;

        let mut new_pos: i32 = (initial as i32) + (scalar as i32);
        let mut zeros: i32 = 0;
        if scalar < 0 {
            if starting == 0 {
                zeros = (new_pos.abs() - initial as i32) / 100;
            } else if scalar.abs() >= initial as i16 {
                zeros = 1 + ((scalar.abs() as i32 - initial as i32) / 100);
            }
        } else {
            zeros = new_pos / 100;
        }
        new_pos = new_pos % 100;
        if new_pos < 0 {
            new_pos = 100 + new_pos;
        }
        zero_count += zeros as u32;
        initial = new_pos;
    });
    zero_count
}

#[allow(dead_code)]
pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let contents = fs::read_to_string("inputs/day1.txt")?;
    let mut start = Instant::now();
    let p1 = part1(50, &contents);
    let p1t = start.elapsed();
    start = Instant::now();
    let p2 = part2(50, &contents);
    let p2t = start.elapsed();
    println!("Part 1: {p1}, Part 2: {p2}");
    println!("Part 1: {p1t:?}, Part 2: {p2t:?}");
    Ok(())
}

#[test]
fn example1() {
    let input = "L68
L30
R48
L5
R60
L55
L1
L99
R14
L82
";
    let result = part1(50, input);
    assert_eq!(result, 3);
}

#[test]
fn example2() {
    let input = "L68
L30
R48
L5
R60
L55
L1
L99
R14
L82
";
    let result = part2(50, input);
    assert_eq!(result, 6);
}
