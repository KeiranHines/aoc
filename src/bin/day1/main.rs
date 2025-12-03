use std::{fs, time::Instant};

#[derive(Debug, Clone)]
struct Rotation {
    scalar: i16,
}

impl Rotation {
    fn from_string(s: &str) -> Rotation {
        let d = if s.starts_with("L") { -1 } else { 1 };
        let s: i16 = s[1..].parse().unwrap();
        Rotation { scalar: s * d }
    }

    fn effect(self, position: u8) -> (u8, u8) {
        let mut new_pos: i32 = (position as i32) + (self.scalar as i32);
        let mut zeros: i32 = 0;
        if self.scalar < 0 {
            if position == 0 {
                zeros = (new_pos.abs() - position as i32) / 100;
            } else if self.scalar.abs() as i32 >= position as i32 {
                zeros = 1 + ((self.scalar.abs() as i32 - position as i32) / 100);
            }
        } else {
            zeros = new_pos / 100;
        }
        new_pos = new_pos % 100;
        if new_pos < 0 {
            new_pos = 100 + new_pos;
        }
        (new_pos as u8, zeros as u8)
    }
}

fn parse(contents: &str) -> Vec<Rotation> {
    let rotations = contents.lines().map(|l| Rotation::from_string(l)).collect();
    rotations
}

fn part1(mut initial: u8, rotations: Vec<Rotation>) -> u32 {
    let mut zero_count = 0u32;
    for r in rotations {
        (initial, _) = r.effect(initial);
        if initial == 0 {
            zero_count += 1;
        }
    }
    zero_count
}

fn part2(mut initial: u8, rotations: Vec<Rotation>) -> u32 {
    let mut zero_count = 0u32;
    for r in rotations {
        let (i, zeros) = r.effect(initial);
        initial = i;
        zero_count += zeros as u32;
    }
    zero_count
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let contents = fs::read_to_string("inputs/day1.txt")?;
    let rotations = parse(&contents);
    let mut start = Instant::now();
    let p1 = part1(50, rotations.clone());
    let p1t = start.elapsed();
    start = Instant::now();
    let p2 = part2(50, rotations);
    let p2t = start.elapsed();
    println!("Part 1: {p1}, Part 2: {p2}");
    println!("Part 1: {p1t:?}, Part 2: {p2t:?}");
    Ok(())
}

#[test]
fn test_overflow() {
    let overflow = Rotation { scalar: 10 };
    let (result, _) = overflow.effect(99);
    assert_eq!(result, 9);
}

#[test]
fn test_underflow() {
    let overflow = Rotation { scalar: -10 };
    let (result, _) = overflow.effect(2);
    assert_eq!(result, 92);
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
    let rotations = parse(input);
    let result = part1(50, rotations);
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
    let rotations = parse(input);
    let result = part2(50, rotations);
    assert_eq!(result, 6);
}

#[test]
fn test_zero_pass_overflow() {
    let overflow = Rotation { scalar: 1000 };
    let (_, zeros) = overflow.effect(50);
    assert_eq!(zeros, 10);
}

#[test]
fn test_zero_pass_underflow() {
    let overflow = Rotation { scalar: -1000 };
    let (_, zeros) = overflow.effect(50);
    assert_eq!(zeros, 10);
}

#[test]
fn test_zero_pass_overflow_from_zero() {
    let overflow = Rotation { scalar: 101 };
    let (_, zeros) = overflow.effect(0);
    assert_eq!(zeros, 1);
}

#[test]
fn test_zero_pass_underflow_from_zero() {
    let overflow = Rotation { scalar: -101 };
    let (_, zeros) = overflow.effect(0);
    assert_eq!(zeros, 1);
}

#[test]
fn test_zero_pass_overflow_to_zero() {
    let overflow = Rotation { scalar: 98 };
    let (_, zeros) = overflow.effect(2);
    assert_eq!(zeros, 1);
}

#[test]
fn test_zero_pass_underflow_to_zero() {
    let overflow = Rotation { scalar: -2 };
    let (p, zeros) = overflow.effect(2);
    assert_eq!(p, 0);
    assert_eq!(zeros, 1);
}
