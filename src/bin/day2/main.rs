use std::fs;

use fancy_regex::Regex;

#[derive(Clone)]
struct Range {
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

fn parse(contents: &str) -> Vec<Range> {
    contents
        .trim()
        .split(",")
        .map(|l| Range::from_string(l))
        .collect()
}

fn part1(ranges: Vec<Range>) -> u64 {
    let mut total = 0u64;
    for r in ranges {
        let mut count = 0;
        for i in r.min_num..=r.max_num {
            let st = i.to_string();
            let mid = st.len() / 2;
            if st[..mid] == st[mid..] {
                count += 1;
                total += i;
            }
        }
        println!(
            "min: {} max: {} count: {count} total: {total}",
            r.min_str, r.max_str
        );
    }
    total
}

fn part2(ranges: Vec<Range>) -> u64 {
    let re = Regex::new(r"^(\d+?)\1+$").unwrap();
    let mut total = 0u64;
    for r in ranges {
        for i in r.min_num..=r.max_num {
            if re.is_match(&i.to_string()).expect("no match") {
                total += i;
            }
        }
    }
    total
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let contents = fs::read_to_string("inputs/day2.txt")?;
    let ranges = parse(&contents);
    let p1 = part1(ranges.clone());
    let p2 = part2(ranges);
    println!("Part 1: {p1}, Part 2: {p2}");
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
#[test]
fn test_example2() {
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
    let p2 = part2(ranges);
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
