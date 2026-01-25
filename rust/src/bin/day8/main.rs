use regex::Regex;
use std::{env, fs, time::Instant};

fn find_overlapping_matches(re: &Regex, text: &str) -> usize {
    let mut m = 0;
    let mut start = 0;

    while start < text.len() {
        if let Some(match_val) = re.find_at(text, start) {
            m += 1;
            // Advance the start position by one character to check for overlaps
            start = match_val.start() + 1;
        } else {
            // If no match is found from the current position, advance to the next character
            start += 1;
        }
    }
    m
}

fn part_1(content: &str) -> usize {
    let hex_c = Regex::new(r"([^\\]\\x..|\\\\\\x..)").unwrap();
    let quote = Regex::new(r#"(\\"|\\\\)"#).unwrap();
    content
        .trim()
        .lines()
        .map(|l| {
            let raw = l.len();
            if raw == 2 {
                return 2;
            }
            let mut c = raw - 2;
            c -= quote.find_iter(l).count();
            c -= 3 * find_overlapping_matches(&hex_c, l);
            raw - c
        })
        .sum()
}
fn part_2(content: &str) -> usize {
    let quote = Regex::new(r#"(\"|\\)"#).unwrap();
    content
        .trim()
        .lines()
        .map(|l| {
            let mem = quote.replace_all(l, "\\\"").into_owned();
            2 + mem.len() - l.len()
        })
        .sum()
}

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total = Instant::now();

    println!("day 8");
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

#[test]
fn test_example2() {
    let content = r#"""
"abc"
"aaa\"aaa"
"\x27""#;
    let ans = part_2(&content);
    assert_eq!(ans, 19);
}
