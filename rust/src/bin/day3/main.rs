use std::{collections::HashSet, env, fs, time::Instant};

fn part_1(content: &str) -> usize {
    let mut x = 0;
    let mut y = 0;
    let mut houses = HashSet::new();
    houses.insert((x, y));
    for c in content.trim().chars() {
        match c {
            '^' => y -= 1,
            'v' => y += 1,
            '<' => x -= 1,
            '>' => x += 1,
            _ => unreachable!(),
        }
        houses.insert((x, y));
    }
    houses.len()
}

#[derive(Default)]
struct Santa {
    x: i16,
    y: i16,
}

fn part_2(content: &str) -> usize {
    let mut santa = Santa::default();
    let mut robo = Santa::default();

    let mut houses = HashSet::new();
    houses.insert((0, 0));
    let mut active = &mut santa;
    for (i, c) in content.trim().chars().enumerate() {
        match c {
            '^' => active.y -= 1,
            'v' => active.y += 1,
            '<' => active.x -= 1,
            '>' => active.x += 1,
            _ => unreachable!(),
        }
        houses.insert((active.x, active.y));
        active = match i % 2 {
            0 => &mut robo,
            1 => &mut santa,
            _ => unreachable!(),
        }
    }
    houses.len()
}

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total = Instant::now();

    println!("day 3");
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
