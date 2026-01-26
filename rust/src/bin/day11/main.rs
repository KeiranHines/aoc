use std::{env, fs, time::Instant};

const I_CHAR: u8 = 8;
const O_CHAR: u8 = 14;
const L_CHAR: u8 = 11;
const Z_CHAR: u8 = 25;

fn to_password(nums: Vec<u8>) -> String {
    String::from_utf8(nums.iter().map(|n| n + 97).collect()).unwrap()
}

fn part_1(content: &str) -> String {
    let ascii = content.trim().as_bytes();
    let mut nums = ascii.iter().map(|c| c - 97).collect::<Vec<u8>>();
    let len = nums.len();
    loop {
        // Go to the next password in the sequence.
        for i in (0..=(len - 1)).rev() {
            nums[i] += 1;
            if nums[i] <= Z_CHAR {
                break;
            }
            nums[i] = 0
        }

        // Passwords must include one increasing straight of at least three letters, like abc, bcd, cde, and so on, up to xyz. They cannot skip letters; abd doesn't count.
        let mut acending = false;
        for i in 0..len - 2 {
            let first = nums[i];
            if nums[i + 1] == first + 1 && nums[i + 2] == first + 2 {
                acending = true;
            }
        }

        // Passwords may not contain the letters i, o, or l, as these letters can be mistaken for other characters and are therefore confusing.
        let bad_char = nums.contains(&I_CHAR) || nums.contains(&O_CHAR) || nums.contains(&L_CHAR);
        // Passwords must contain at least two different, non-overlapping pairs of letters, like aa, bb, or zz.

        let mut pairs = 0;
        let mut i = 0;
        while i < len - 1 {
            if nums[i] == nums[i + 1] {
                pairs += 1;
                i += 1;
            }
            i += 1;
        }

        if !bad_char && acending && pairs > 1 {
            return to_password(nums);
        }
    }
}
fn part_2(content: &str) -> String {
    let first = part_1(content);
    part_1(&first)
}

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total = Instant::now();

    println!("day 11");
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
