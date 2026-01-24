use std::{env, fs, time::Instant};

fn part_1(content: &str) -> u32 {
    content
        .lines()
        .map(|line| {
            let parts = line
                .split("x")
                .map(|s| s.parse().unwrap())
                .collect::<Vec<u32>>();
            let a1 = parts[0] * parts[1];
            let a2 = parts[0] * parts[2];
            let a3 = parts[1] * parts[2];
            2 * a1 + 2 * a2 + 2 * a3 + a1.min(a2.min(a3))
        })
        .sum()
}
fn part_2(content: &str) -> u32 {
    content
        .lines()
        .map(|line| {
            let mut m1 = u32::MAX;
            let mut m2 = u32::MAX;
            let mut t = 1;
            line.split("x").for_each(|s| {
                let v = s.parse().unwrap();
                if v < m2 {
                    m2 = v;
                }
                if v < m1 {
                    m2 = m1;
                    m1 = v;
                }
                t *= v;
            });
            2 * m1 + 2 * m2 + t
        })
        .sum()
}

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total = Instant::now();

    println!("day 2");
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
