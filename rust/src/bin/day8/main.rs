use regex::Regex;
use std::{env, fs, time::Instant};
fn part_1(content: &str) -> usize {
    let hex = Regex::new(r"(\\x..)").unwrap();
    let quote = Regex::new(r#"(\\"|\\\\)"#).unwrap();
    content
        .trim()
        .lines()
        .map(|l| {
            let raw = l.len();
            if raw == 2 {
                return 2;
            }
            // Remove the two "
            let mem = &l[1..raw - 1];
            // This replaces \\ or \" with " for simplicity
            let mem = quote.replace_all(mem, "\"").into_owned();

            // This replaces an \x<code> with x for simplicity
            let mem = hex.replace_all(&mem, "x").into_owned();

            raw - mem.len()
        })
        .sum()
}
fn part_2(_content: &str) -> i16 {
    0
}

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total = Instant::now();

    println!("day X");
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

#[test]
fn test_example() {
    let content = r#"""
    "abc"
    "aaa\"aaa"
    "\x27""#;
    let ans = part_1(&content);
    assert_eq!(ans, 12);
}

#[test]
fn test_multi_ansii() {
    let content = r#""\x27\x0A\x0B""#;
    let ans = part_1(&content);
    assert_eq!(ans, 11);
}

#[test]
fn test_backslash() {
    let content = r#""\\""#;
    let ans = part_1(&content);
    assert_eq!(ans, 3);
}

#[test]
fn test_complex() {
    let content = r#""\\\"\xA0\\\"\x80""#;
    let ans = part_1(&content);
    // mem 8
    // total 18
    assert_eq!(ans, 10);
}
