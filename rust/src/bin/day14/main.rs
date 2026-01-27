use std::{collections::HashMap, env, fs, time::Instant};

#[derive(Debug, Hash, PartialEq, Eq)]
struct Racer {
    name: String,
    speed: u32,
    running_time: u32,
    stopped_time: u32,
}

fn calc_distance(racer: &Racer, total_time: u32) -> u32 {
    let time_per_loop = racer.running_time + racer.stopped_time;
    let loops = (total_time as f32 / time_per_loop as f32) as u32;
    let initial_dist = loops * racer.speed * racer.running_time;
    let remaining_time = total_time - (loops * time_per_loop);
    let additional_dist = remaining_time.min(racer.running_time) * racer.speed;
    initial_dist + additional_dist
}

fn part_1(content: &str) -> u32 {
    // TODO: sim equations
    // e.g.
    //Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
    //Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.
    // over 1000s add two timings, (137 and 173s) divide total by that (1000/137 and 1000/173).
    // That gets total complete cycles, then do speed * remainder to get the final part
    content
        .trim()
        .lines()
        .map(|line| {
            let parts = line.split(" ").collect::<Vec<_>>();
            let name = parts[0];
            let speed = parts[3].parse::<u32>().unwrap();
            let running_time = parts[6].parse::<u32>().unwrap();
            let stopped_time = parts[13].parse::<u32>().unwrap();
            let racer = Racer {
                name: name.to_string(),
                speed,
                running_time,
                stopped_time,
            };
            calc_distance(&racer, 2500)
        })
        .max()
        .unwrap()
}

fn part_2(content: &str) -> u32 {
    let racers = content
        .trim()
        .lines()
        .map(|line| {
            let parts = line.split(" ").collect::<Vec<_>>();
            let name = parts[0];
            let speed = parts[3].parse::<u32>().unwrap();
            let running_time = parts[6].parse::<u32>().unwrap();
            let stopped_time = parts[13].parse::<u32>().unwrap();
            Racer {
                name: name.to_string(),
                speed,
                running_time,
                stopped_time,
            }
        })
        .collect::<Vec<_>>();

    let mut scores: HashMap<&Racer, u32> = HashMap::new();
    for i in 1..=2503 {
        let mut first: &Racer = &racers[0];
        let mut furthest = u32::MIN;
        for r in &racers {
            let d = calc_distance(&r, i);
            if d > furthest {
                furthest = d;
                first = r;
            }
        }
        *scores.entry(first).or_default() += 1;
    }
    *scores.values().max().unwrap()
}

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total = Instant::now();

    println!("day X");
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
fn test_example_1() {
    //Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
    let res = calc_distance("Comet", 14, 10, 127, 1000);
    assert_eq!(res, 1120);
}
