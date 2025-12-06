use core::fmt;
use std::{collections::HashSet, fs, time::Instant};

#[derive(Clone, PartialEq, Eq, Hash)]
struct Range {
    min: u64,
    max: u64,
}

impl fmt::Debug for Range {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "({},{})", self.min, self.max)
    }
}

pub fn part1(input: &str) -> u64 {
    let mid = input.find("\n\n").unwrap();
    let ranges: Vec<(u64, u64)> = input[0..mid]
        .lines()
        .map(|l| {
            let p: Vec<&str> = l.split("-").collect();
            (p[0].parse().unwrap(), p[1].parse().unwrap())
        })
        .collect();
    input[mid + 2..input.len()]
        .lines()
        .map(|id| {
            let i: u64 = id.parse().unwrap();
            for (min, max) in &ranges {
                if i >= *min && i <= *max {
                    return 1;
                }
            }
            0
        })
        .sum()
}

fn simplify(r1: &Range, r2: &Range) -> Vec<Range> {
    if r1.min >= r2.min {
        if r1.min > r2.max {
            // R1 is fully after r2
            return vec![r1.clone(), r2.clone()];
        }
        //r1 starts inside r2.
        if r1.max <= r2.max {
            // r2 contains r1
            vec![r2.clone()]
        } else {
            //r1 starts inside r2, ends outside r2
            vec![Range {
                min: r2.min,
                max: r1.max,
            }]
        }
    } else {
        // R1 starts outside of r2
        if r1.max < r2.min - 1 {
            // r1 finishes before r2 starts, comletely disjoint
            return vec![r1.clone(), r2.clone()];
        }
        // There is some overlap
        if r1.max <= r2.max {
            //r1 starts before r2 and ends inside
            return vec![Range {
                min: r1.min,
                max: r2.max,
            }];
        }
        vec![r1.clone()]
    }
}

pub fn part2(input: &str) -> u64 {
    let mid = input.find("\n\n").unwrap();
    let mut ranges: Vec<Range> = input[0..mid]
        .lines()
        .map(|l| {
            let p: Vec<&str> = l.split("-").collect();
            Range {
                min: p[0].parse().unwrap(),
                max: p[1].parse().unwrap(),
            }
        })
        .collect();
    loop {
        let mut replace = HashSet::new();
        for i in 0..ranges.len() {
            let mut best = ranges[i].clone();
            for j in i + 0..ranges.len() {
                if i != j {
                    let x = simplify(&best, &ranges[j]);
                    if x.len() == 1 {
                        best = x[0].clone();
                    }
                }
                //    println!("Simplified {:?} {:?} to {:?}", ranges[i], ranges[j], x);
            }
            replace.insert(best);
        }
        let replace_vec = replace.into_iter().collect();
        if replace_vec == ranges {
            println!("break");
            break;
        }
        ranges = replace_vec;
    }
    ranges.iter().map(|r| 1 + r.max - r.min).sum()
}

#[allow(dead_code)]
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let contents = fs::read_to_string("inputs/day5.txt")?;
    let mut start = Instant::now();
    let p1 = part1(&contents);
    let p1t = start.elapsed();
    start = Instant::now();
    let p2 = part2(&contents);
    let p2t = start.elapsed();
    println!("Part 1: {p1}, Part 2: {p2}");
    println!("Part 1: {p1t:?}, Part 2: {p2t:?}");
    Ok(())
}

#[test]
fn test_example1() {
    let input = "3-5
10-14
16-20
12-18

1
5
8
11
17
32
";
    let p1 = part1(input);
    assert_eq!(p1, 3);
}

#[test]
fn test_example2() {
    let input = "3-5
10-14
16-20
12-18

1
5
8
11
17
32
";
    let p2 = part2(input);
    assert_eq!(p2, 14);
}

#[test]
fn test_complete_overlap() {
    let input = "7-10
10-20
1-7

1";
    let p2 = part2(input);
    assert_eq!(p2, 20);
}

#[test]
fn test_complete_overlap_one_off() {
    let input = "7-9
10-20
1-6

1";
    let p2 = part2(input);
    assert_eq!(p2, 20);
}
