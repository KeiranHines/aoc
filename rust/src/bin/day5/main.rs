use std::{collections::HashMap, env, fs, time::Instant};

fn part_1(content: &str) -> usize {
    content
        .trim()
        .lines()
        .filter(|line| {
            let mut vowels = 0;
            let mut doub = false;
            let mut prev = '_';
            for c in line.chars() {
                if c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' {
                    vowels += 1;
                }
                if c == prev {
                    doub = true;
                }
                //ab, cd, pq, or xy
                if (prev == 'a' && c == 'b')
                    || (prev == 'c' && c == 'd')
                    || (prev == 'p' && c == 'q')
                    || (prev == 'x' && c == 'y')
                {
                    return false;
                }
                prev = c;
            }
            vowels >= 3 && doub
        })
        .count()
}
fn part_2(content: &str) -> usize {
    let mut prev = '_';
    let mut prev_prev = '_';
    let mut reap = false;
    let mut doubs: HashMap<String, u8> = HashMap::new();
    content
        .trim()
        .lines()
        .filter(|line| {
            doubs.clear();
            prev = '_';
            prev_prev = '_';
            reap = false;
            for c in line.chars() {
                if !(c == prev && c == prev_prev) {
                    *doubs.entry(format!("{prev}{c}")).or_default() += 1;
                }
                if c == prev_prev && c != prev {
                    reap = true;
                }
                prev_prev = prev;
                prev = c;
                if doubs.values().filter(|v| **v == 2).count() > 0 && reap {
                    return true;
                }
            }
            return false;
        })
        .count()
}

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total = Instant::now();

    println!("day 5");
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
