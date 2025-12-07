use std::{fs, time::Instant};

pub fn part1(input: &str) -> u64 {
    let lines: Vec<Vec<&str>> = input
        .lines()
        .map(|l| l.split_whitespace().collect())
        .collect();
    let nums = &lines[0..&lines.len() - 1];
    let cmds = &lines[lines.len() - 1];

    let mut total = 0;
    let numbers = nums.len();
    for i in 0..lines[0].len() {
        if cmds[i] == "*" {
            let mut sum = 1;
            for n in 0..numbers {
                sum *= lines[n][i].parse::<u64>().unwrap();
            }
            total += sum;
        } else {
            let mut sum = 0;
            for n in 0..numbers {
                sum += lines[n][i].parse::<u64>().unwrap();
            }
            total += sum;
        }
    }
    total
}

pub fn part2(input: &str) -> u64 {
    let lines: Vec<&str> = input.lines().collect();
    let nums: Vec<Vec<char>> = lines[0..&lines.len() - 1]
        .iter()
        .map(|l| l.chars().collect())
        .collect();
    let mut cmds: Vec<&str> = lines[lines.len() - 1].split_whitespace().collect();
    let mut total = 0;
    let numbers = nums.len();

    let mut has_number = false;
    let mut sum = 0;
    let mut cmd = "";
    for i in (0..lines[0].len()).rev() {
        if !has_number {
            // Start a new sum
            total += sum;
            cmd = cmds.pop().unwrap();
            if cmd == "*" {
                sum = 1;
            } else {
                sum = 0;
            }
        }
        has_number = false;
        let mut num_strings: String = "".to_string();

        for n in 0..numbers {
            if nums[n][i] != ' ' {
                num_strings.push(nums[n][i]);
                has_number = true;
            }
        }
        if has_number {
            if cmd == "*" {
                sum *= num_strings.parse::<u64>().unwrap()
            }
            if cmd == "+" {
                sum += num_strings.parse::<u64>().unwrap()
            }
        }
    }
    total + sum
}

#[allow(dead_code)]
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let contents = fs::read_to_string("inputs/day6.txt")?;
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
    let input = "123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  
";
    let p1 = part1(input);
    assert_eq!(p1, 4277556);
}

#[test]
fn test_example2() {
    let input = "123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  
";
    let p2 = part2(input);
    assert_eq!(p2, 3263827);
}
