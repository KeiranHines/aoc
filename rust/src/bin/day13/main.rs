use std::{
    collections::{HashMap, HashSet},
    env, fs,
    time::Instant,
};

use itertools::Itertools;

fn part_1(content: &str) -> i32 {
    let mut guests = HashSet::new();
    let mut seatings: HashMap<(&str, &str), i32> = HashMap::new();
    for line in content.trim().lines() {
        let parts = line.split(" ").collect::<Vec<_>>();
        let person_a = parts[0];
        let person_b = parts[parts.len() - 1].trim_matches('.');

        let happiness = match parts[2] {
            "gain" => parts[3].parse().unwrap(),
            "lose" => -1 * parts[3].parse::<i32>().unwrap(),
            _ => unreachable!(),
        };
        guests.insert(person_a);
        guests.insert(person_b);
        seatings.insert((person_b, person_a), happiness);
    }
    let guest_count = guests.len();

    let mut highest = i32::MIN;
    for p in guests.iter().permutations(guest_count) {
        let mut total = 0;
        for i in 0..guest_count - 1 {
            let person_a = p[i];
            let person_b = p[i + 1];
            let h1 = seatings.get(&(person_a, person_b)).unwrap();
            let h2 = seatings.get(&(person_b, person_a)).unwrap();
            total += h1 + h2;
        }
        // Final guest pair
        let person_a = p[p.len() - 1];
        let person_b = p[0];
        let h1 = seatings.get(&(person_a, person_b)).unwrap();
        let h2 = seatings.get(&(person_b, person_a)).unwrap();
        total += h1 + h2;

        if highest < total {
            highest = total;
        }
    }
    highest
}

const HOST: &str = "Host";

fn part_2(content: &str) -> i32 {
    let mut guests = HashSet::new();
    let mut seatings: HashMap<(&str, &str), i32> = HashMap::new();
    for line in content.trim().lines() {
        let parts = line.split(" ").collect::<Vec<_>>();
        let person_a = parts[0];
        let person_b = parts[parts.len() - 1].trim_matches('.');

        let happiness = match parts[2] {
            "gain" => parts[3].parse().unwrap(),
            "lose" => -1 * parts[3].parse::<i32>().unwrap(),
            _ => unreachable!(),
        };
        guests.insert(person_a);
        guests.insert(person_b);
        seatings.insert((person_b, person_a), happiness);
    }
    // Insert the host as a neutral guest
    for g in &guests {
        seatings.insert((HOST, g), 0);
        seatings.insert((g, HOST), 0);
    }
    guests.insert(HOST);
    let guest_count = guests.len();

    let mut highest = i32::MIN;
    for p in guests.iter().permutations(guest_count) {
        let mut total = 0;
        for i in 0..guest_count - 1 {
            let person_a = p[i];
            let person_b = p[i + 1];
            let h1 = seatings.get(&(person_a, person_b)).unwrap();
            let h2 = seatings.get(&(person_b, person_a)).unwrap();
            total += h1 + h2;
        }
        // Final guest pair
        let person_a = p[p.len() - 1];
        let person_b = p[0];
        let h1 = seatings.get(&(person_a, person_b)).unwrap();
        let h2 = seatings.get(&(person_b, person_a)).unwrap();
        total += h1 + h2;

        if highest < total {
            highest = total;
        }
    }
    highest
}

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total = Instant::now();

    println!("day 13");
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

#[test]
fn test_part1_example() {
    let input = r"Alice would gain 54 happiness units by sitting next to Bob.
Alice would lose 79 happiness units by sitting next to Carol.
Alice would lose 2 happiness units by sitting next to David.
Bob would gain 83 happiness units by sitting next to Alice.
Bob would lose 7 happiness units by sitting next to Carol.
Bob would lose 63 happiness units by sitting next to David.
Carol would lose 62 happiness units by sitting next to Alice.
Carol would gain 60 happiness units by sitting next to Bob.
Carol would gain 55 happiness units by sitting next to David.
David would gain 46 happiness units by sitting next to Alice.
David would lose 7 happiness units by sitting next to Bob.
David would gain 41 happiness units by sitting next to Carol.
";
    let res = part_1(input);
    assert_eq!(res, 330);
}
