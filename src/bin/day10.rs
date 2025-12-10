use std::{
    collections::{HashMap, HashSet},
    fs,
    time::Instant,
    u16,
};

#[derive(Debug)]
struct Machine {
    num_lights: u16,
    lights: Vec<u16>,
    switches: Vec<Vec<u16>>,
    joltages: Vec<u16>,
}

pub fn part1(input: &str) -> u64 {
    input
        .lines()
        .map(|l| {
            let lights_end = l.find(']').unwrap();
            let joltages_start = l.find("{").unwrap();

            let chars: Vec<char> = l.chars().collect();
            let mut lights: Vec<u16> = Vec::with_capacity(lights_end - 1);
            for i in 1..lights_end {
                if chars[i] == '#' {
                    lights.push((i - 1) as u16);
                }
            }

            let switches: Vec<Vec<u16>> = l[lights_end + 2..(joltages_start - 1)]
                .split(" ")
                .map(|s| {
                    s[1..(s.len() - 1)]
                        .split(",")
                        .map(|n| n.parse::<u16>().unwrap())
                        .collect()
                })
                .collect();

            Machine {
                num_lights: (lights_end - 1) as u16,
                lights,
                switches,
                joltages: Vec::new(),
            }
        })
        .map(|m| {
            let mut result = vec![vec![]]; // Start with an empty set
            let mut shortest: u64 = 999999;
            for item in &m.switches {
                let mut new_subsets = Vec::new();
                for subset in &result {
                    let mut new_subset = subset.clone();
                    if new_subset.len() < shortest as usize {
                        new_subset.push(item.clone());
                        // Start processing this subset to see if it works.
                        let mut presses: HashMap<u16, usize> = HashMap::new();
                        for x in &new_subset {
                            for n in x {
                                *presses.entry(*n).or_insert(0) += 1;
                            }
                        }
                        let mut success = true;
                        for light in 0..m.num_lights {
                            let status = presses.get(&(light as u16)).unwrap_or(&0usize);
                            if m.lights.contains(&light) {
                                if *status % 2 != 1 {
                                    success = false;
                                }
                            } else {
                                if *status % 2 != 0 {
                                    success = false;
                                }
                            }
                        }
                        if success {
                            shortest = new_subset.len() as u64;
                        }

                        // Store this result to build a bigger subset
                        new_subsets.push(new_subset);
                    }
                }
                result.extend(new_subsets);
            }
            shortest
        })
        .sum::<u64>() as u64
}

/*// Function to calculate the Greatest Common Divisor (GCD) using the Euclidean algorithm
fn gcd(a: u16, b: u16) -> u16 {
    if b == 0 { a } else { gcd(b, a % b) }
}

// Function to calculate the Least Common Multiple (LCM) of two numbers
fn lcm_two_numbers(a: u16, b: u16) -> u16 {
    if a == 0 || b == 0 {
        0 // LCM of any number with 0 is 0
    } else {
        (a * b) / gcd(a, b)
    }
}

// Function to calculate the LCM of an array of numbers
fn lcm_of_n_numbers(numbers: &Vec<u16>) -> u16 {
    if numbers.is_empty() {
        return 0; // Or handle error for empty input
    }

    let mut result = numbers[0];
    for &num in numbers.iter().skip(1) {
        result = lcm_two_numbers(result, num);
    }
    result
}*/

fn verify_presses(new_subset: &Vec<Vec<u16>>, m: &Machine) -> bool {
    // Start processing this subset to see if it works.
    let mut presses: HashMap<u16, usize> = HashMap::new();
    for x in new_subset {
        for n in x {
            *presses.entry(*n).or_insert(0) += 1;
        }
    }
    //let scale = lcm_of_n_numbers(&m.joltages);
    let mut success = true;
    if presses.keys().len() == m.num_lights as usize {
        // TODO: Factor joltages down to a scale and find a match,
        // multiply by scale so we don't need to check as many factors
        for (k, press) in presses.iter() {
            if m.joltages[*k as usize] != *press as u16 {
                success = false;
                break;
            }
        }
        return success;
    }

    false
}

pub fn part2(input: &str) -> u64 {
    input
        .lines()
        .map(|l| {
            let lights_end = l.find(']').unwrap();
            let joltages_start = l.find("{").unwrap();

            let chars: Vec<char> = l.chars().collect();
            let mut lights: Vec<u16> = Vec::with_capacity(lights_end - 1);
            for i in 1..lights_end {
                if chars[i] == '#' {
                    lights.push((i - 1) as u16);
                }
            }

            let switches: Vec<Vec<u16>> = l[lights_end + 2..(joltages_start - 1)]
                .split(" ")
                .map(|s| {
                    s[1..(s.len() - 1)]
                        .split(",")
                        .map(|n| n.parse::<u16>().unwrap())
                        .collect()
                })
                .collect();

            let joltages: Vec<u16> = l[joltages_start + 1..l.len() - 1]
                .split(",")
                .map(|j| j.parse::<u16>().unwrap())
                .collect();

            Machine {
                num_lights: (lights_end - 1) as u16,
                lights,
                switches,
                joltages: joltages,
            }
        })
        .map(|m| {
            let mut result = vec![vec![]]; // Start with an empty set
            let mut shortest: u64 = 999999;
            let min_count: u16 = m.joltages.iter().sum();
            let mut lots_of_presses = Vec::new();
            lots_of_presses.extend(m.switches.clone());
            lots_of_presses.extend(m.switches.clone());
            lots_of_presses.extend(m.switches.clone());
            lots_of_presses.extend(m.switches.clone());
            lots_of_presses.extend(m.switches.clone());
            for item in &lots_of_presses {
                let mut new_subsets = HashSet::new();
                for subset in &result {
                    let mut new_subset: Vec<Vec<u16>> = subset.clone();
                    // TODO: make this work for the factors, only scan valid sets
                    // if new_subset.map('all numbers').len() < joltages_factored.sum() {
                    //    push so we can use this again.
                    //    new_subsets.push(new_subset);
                    //    continue;
                    // }
                    //

                    let press_count: usize = new_subset.iter().map(|s| s.len()).sum();
                    if press_count < min_count as usize {
                        new_subset.push(item.clone());
                        print!(".");
                        new_subsets.insert(new_subset);
                    } else {
                        println!("new subset{new_subset:?}");
                        if new_subset.len() < shortest as usize {
                            new_subset.push(item.clone());
                            let success = verify_presses(&new_subset, &m);
                            if success {
                                shortest = new_subset.len() as u64;
                            }
                            // Store this result to build a bigger subset
                            new_subsets.insert(new_subset);
                        }
                    }
                }
                println!("");
                result.extend(new_subsets);
            }
            println!("checked {:?} iterations Longest {result:?}", result.len());
            shortest
        })
        .sum::<u64>() as u64
}

#[allow(dead_code)]
pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let contents = fs::read_to_string("inputs/day10.txt")?;
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
fn test_simple1() {
    let input = "[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}";
    let p1 = part1(input);
    assert_eq!(p1, 2);
}

#[test]
fn test_example_gets_hit() {
    //TODO:
    let m = Machine {
        num_lights: 4,
        lights: vec![1, 2],
        switches: vec![
            vec![3],
            vec![1, 3],
            vec![1, 3],
            vec![2],
            vec![2, 3],
            vec![0, 2],
            vec![0, 2],
            vec![0, 1],
        ],
        joltages: vec![3, 5, 4, 7],
    };
    let new_subset = vec![
        vec![3],
        vec![1, 3],
        vec![1, 3],
        vec![1, 3],
        vec![2, 3],
        vec![2, 3],
        vec![2, 3],
        vec![0, 2],
        vec![0, 1],
        vec![0, 1],
    ];
    let verified = verify_presses(&new_subset, &m);
    assert!(verified);
}

#[test]
fn test_example_gets_hit2() {
    //TODO:
    let m = Machine {
        num_lights: 5,
        lights: vec![4],
        switches: vec![
            vec![0, 2, 3, 4],
            vec![2, 3],
            vec![0, 4],
            vec![0, 1, 2],
            vec![1, 2, 3, 4],
        ],
        joltages: vec![7, 5, 12, 7, 2],
    };
    let new_subset = vec![
        vec![0, 2, 3, 4],
        vec![0, 2, 3, 4],
        vec![2, 3],
        vec![2, 3],
        vec![2, 3],
        vec![2, 3],
        vec![2, 3],
        vec![0, 1, 2],
        vec![0, 1, 2],
        vec![0, 1, 2],
        vec![0, 1, 2],
        vec![0, 1, 2],
    ];
    let verified = verify_presses(&new_subset, &m);
    assert!(verified);
}

#[test]
fn test_example1() {
    let input = "[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}";
    let p1 = part1(input);
    assert_eq!(p1, 7);
}
#[test]
fn test_simple2() {
    let input = "[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}";
    let p2 = part2(input);
    assert_eq!(p2, 10);
    let input = "[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}";
    let p2 = part2(input);
    assert_eq!(p2, 12);
    let input = "[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}";
    let p2 = part2(input);
    assert_eq!(p2, 11);
}

#[test]
fn test_example2() {
    let input = "[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}";
    let p2 = part2(input);
    assert_eq!(p2, 33);
}
