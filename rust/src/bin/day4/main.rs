use std::{env, fs, time::Instant};

use md5::Digest;

fn part_1(content: &str) -> u32 {
    let mut i: u32 = 0;
    let key = content.trim();
    let mut result = md5::digest::generic_array::GenericArray::default();
    let mut hasher = md5::Md5::new();
    let target: [u8; 2] = [0, 0];
    loop {
        hasher.update(format!("{}{}", key, i));
        hasher.finalize_into_reset(&mut result);
        if result.starts_with(&target) && result[2] < 0x10 {
            return i;
        }
        i += 1;
    }
}

fn part_2(content: &str) -> i32 {
    let mut i = 0;
    let key = content.trim();
    let mut result = md5::digest::generic_array::GenericArray::default();
    let mut hasher = md5::Md5::new();
    let target: [u8; 3] = [0, 0, 0];
    loop {
        hasher.update(format!("{}{}", key, i));
        hasher.finalize_into_reset(&mut result);
        if result.starts_with(&target) {
            return i;
        }
        i += 1;
    }
}

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total = Instant::now();

    println!("day 4");
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
