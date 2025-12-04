use std::{collections::HashMap, fs, time::Instant};

use fancy_regex::Regex;

#[derive(Clone)]
pub struct Range {
    #[allow(dead_code)]
    min_str: String,
    #[allow(dead_code)] // used in better p2 impl
    max_str: String,
    min_num: u64,
    max_num: u64,
}

impl Range {
    fn from_string(input: &str) -> Range {
        let parts: Vec<&str> = input.split("-").collect();
        Range {
            min_str: parts[0].to_string(),
            max_str: parts[1].to_string(),
            min_num: parts[0].parse().unwrap(),
            max_num: parts[1].parse().unwrap(),
        }
    }
}

pub fn parse(contents: &str) -> Vec<Range> {
    contents
        .trim()
        .split(",")
        .map(|l| Range::from_string(l))
        .collect()
}

pub fn part1(ranges: Vec<Range>) -> u64 {
    let mut total = 0u64;
    for r in ranges {
        if r.min_str.len() % 2 == 1 && r.min_str.len() == r.max_str.len() {
            continue;
        }
        let mut mid_str: &str = &r.min_str;
        if mid_str.len() > 1 {
            mid_str = &mid_str[0..mid_str.len() / 2];
        }
        let mid_min: u32 = mid_str.parse().unwrap();
        let mut mid_str_max = &r.max_str[0..r.max_str.len() / 2];
        if r.max_str.len() % 2 == 1 {
            mid_str_max = &r.max_str[0..=r.max_str.len() / 2];
        }
        let mid_max = mid_str_max.parse().unwrap();
        for i in mid_min..=mid_max {
            let t: u64 = format!("{i}{i}").parse().unwrap();
            if t >= r.min_num {
                if t <= r.max_num {
                    total += t as u64;
                } else {
                    break;
                }
            }
        }
    }
    total
}

pub async fn part2(ranges: Vec<Range>) -> u64 {
    let mut final_total = 0u64;
    let mut handles = Vec::new();
    for r in ranges {
        let handle = tokio::task::spawn(async move {
            let re = Regex::new(r"^(\d+?)\1+$").unwrap();
            let mut total = 0u64;
            for i in r.min_num..=r.max_num {
                let st = i.to_string();
                let mut unique = HashMap::new();
                for c in st.chars() {
                    let count = unique.get(&c).unwrap_or_else(|| &0);
                    unique.insert(c, count + 1);
                }
                let mut duplicates = true;
                for count in unique.values() {
                    if *count < 2 {
                        duplicates = false;
                    }
                }
                if duplicates && re.is_match(&st).expect("no match") {
                    total += i;
                }
            }
            total
        });
        handles.push(handle);
    }
    for handle in handles {
        final_total += handle.await.expect("error");
    }
    final_total
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let contents = fs::read_to_string("inputs/day2.txt")?;
    let ranges = parse(&contents);
    let mut start = Instant::now();
    let p1 = part1(ranges.clone());
    let p1t = start.elapsed();
    start = Instant::now();
    let p2 = part2(ranges).await;
    let p2t = start.elapsed();
    println!("Part 1: {p1}, Part 2: {p2}");
    println!("Part 1: {p1t:?}, Part 2: {p2t:?}");
    Ok(())
}

#[test]
fn test_example1() {
    /*
    11-22 has two invalid IDs, 11 and 22.                   33
    95-115 has one invalid ID, 99.                          132
    998-1012 has one invalid ID, 1010.                      1142
    1188511880-1188511890 has one invalid ID, 1188511885.   1188513027
    222220-222224 has one invalid ID, 222222.               1188735249
    1698522-1698528 contains no invalid IDs.
    446443-446449 has one invalid ID, 446446.               1189181695
    38593856-38593862 has one invalid ID, 38593859.         1227775554
    */
    let input = "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124";
    let ranges = parse(input);
    let p1 = part1(ranges);
    assert_eq!(p1, 1227775554);
}
#[tokio::test]
async fn test_example2() {
    /* TODO: Numbers on far right are wrong from p1
    *
    11-22 has two invalid IDs, 11 and 22.                   33
    95-115 has one invalid ID, 99.                          132
    998-1012 has one invalid ID, 1010.                      1142
    1188511880-1188511890 has one invalid ID, 1188511885.   1188513027
    222220-222224 has one invalid ID, 222222.               1188735249
    1698522-1698528 contains no invalid IDs.
    446443-446449 has one invalid ID, 446446.               1189181695
    38593856-38593862 has one invalid ID, 38593859.         1227775554
    */
    let input = "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124";
    let ranges = parse(input);
    let p2 = part2(ranges).await;
    assert_eq!(p2, 4174379265);
}

#[test]
fn test_both() {
    let r = Range::from_string("11-22");
    let res = part1(vec![r]);
    assert_eq!(res, 33);
}
#[test]
fn test_twos() {
    let r = Range::from_string("222220-222224");
    let res = part1(vec![r]);
    assert_eq!(res, 222222);
}

#[test]
fn test_actual() {
    let contents = fs::read_to_string("inputs/day2.txt").unwrap();
    let ranges = parse(&contents);
    let p1 = part1(ranges.clone());
    assert_eq!(p1, 26255179562);
}
