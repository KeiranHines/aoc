use std::{
    collections::{HashMap, HashSet},
    env, fs,
    time::Instant,
};

use itertools::Itertools;

fn part_1(content: &str) -> u32 {
    let mut cities = HashSet::new();
    let mut routes: HashMap<(&str, &str), u32> = HashMap::new();
    for line in content.trim().lines() {
        let parts = line.split(" ").collect::<Vec<_>>();
        let from = parts[0];
        let to = parts[2];
        let dist = parts[4].parse().unwrap();
        cities.insert(from);
        cities.insert(to);
        routes.insert((to, from), dist);
    }
    let total_cities = cities.len();

    let mut lowest = u32::MAX;
    for p in cities.iter().permutations(total_cities) {
        let mut total = 0;
        for i in 0..total_cities - 1 {
            if total > lowest {
                break;
            }
            let from_t = p[i];
            let to_t = p[i + 1];
            match routes.get(&(*from_t, *to_t)) {
                Some(d) => total += d,
                None => match routes.get(&(*to_t, *from_t)) {
                    Some(d) => total += d,
                    None => (),
                },
            }
        }
        if lowest > total {
            lowest = total;
        }
    }
    lowest
}
fn part_2(content: &str) -> u32 {
    let mut cities = HashSet::new();
    let mut routes: HashMap<(&str, &str), u32> = HashMap::new();
    for line in content.trim().lines() {
        let parts = line.split(" ").collect::<Vec<_>>();
        let from = parts[0];
        let to = parts[2];
        let dist = parts[4].parse().unwrap();
        cities.insert(from);
        cities.insert(to);
        routes.insert((to, from), dist);
    }
    let total_cities = cities.len();

    let mut highest = 0;
    for p in cities.iter().permutations(total_cities) {
        let mut total = 0;
        for i in 0..total_cities - 1 {
            let from_t = p[i];
            let to_t = p[i + 1];
            match routes.get(&(*from_t, *to_t)) {
                Some(d) => total += d,
                None => match routes.get(&(*to_t, *from_t)) {
                    Some(d) => total += d,
                    None => (),
                },
            }
        }
        if highest < total {
            highest = total;
        }
    }
    highest
}

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total = Instant::now();

    println!("day 9");
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
