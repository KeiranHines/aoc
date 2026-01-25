use std::{
    collections::{HashMap, VecDeque},
    env, fs,
    time::Instant,
};

fn part_1(content: &str) -> u16 {
    let mut values: HashMap<&str, u16> = HashMap::new();
    let mut instructions: VecDeque<_> = content.trim().lines().collect();
    let len = instructions.len();
    let mut total = 0;
    let mut skipped = 0;
    while instructions.len() > 0 {
        let inst = instructions.pop_front().unwrap();

        let (input, output) = inst.split_once(" -> ").unwrap();
        let parts: Vec<_> = input.split(" ").collect();
        total += 1;
        match parts.len() {
            1 => {
                // either number or register only e.g. lx -> a or 0 -> a
                let num: Option<u16> = match parts[0].parse() {
                    Ok(n) => Some(n),
                    Err(_) => values.get(parts[0]).copied(),
                };
                if num.is_none() {
                    // This instructions inputs are not yet set, cannot process this yet,
                    // add it back to the queue.
                    instructions.push_back(inst);
                    skipped += 1;
                    continue;
                }
                values.insert(output, num.unwrap());
            }
            2 => {
                // NOT a -> b
                let (_, p1) = input.split_once(" ").unwrap();
                // Process the NOT xx -> yy case
                let p1: Option<u16> = match p1.parse() {
                    Ok(num) => Some(num),
                    Err(_) => values.get(p1).copied(),
                };
                if p1.is_none() {
                    // This instructions inputs are not yet set, cannot process this yet,
                    // add it back to the queue.
                    instructions.push_back(inst);
                    skipped += 1;
                    continue;
                }
                let out = !p1.unwrap();
                values.insert(output, out);
            }
            3 => {
                // Any other command.
                let parts: Vec<_> = input.split(" ").collect();
                let cmd = parts[1];
                let p1: Option<u16> = match parts[0].parse() {
                    Ok(num) => Some(num),
                    Err(_) => values.get(parts[0]).copied(),
                };
                let p2: Option<u16> = match parts[2].parse() {
                    Ok(num) => Some(num),
                    Err(_) => values.get(parts[2]).copied(),
                };

                if p1.is_none() || p2.is_none() {
                    // This instructions inputs are not yet set, cannot process this yet,
                    // add it back to the queue.
                    instructions.push_back(inst);
                    skipped += 1;
                    continue;
                }
                let p1 = p1.unwrap();
                let p2 = p2.unwrap();
                let out = match cmd {
                    "AND" => p1 & p2,
                    "OR" => p1 | p2,
                    "LSHIFT" => p1 << p2,
                    "RSHIFT" => p1 >> p2,
                    _ => unreachable!(),
                };
                values.insert(output, out);
            }
            _ => unreachable!(),
        }
    }

    println!("Skipped {}/{} from {}", skipped, total, len);
    *values.get("a").unwrap()
}
fn part_2(content: &str) -> u16 {
    let override_val = part_1(content);
    let new = content
        .trim()
        .lines()
        .map(|l| {
            if l.ends_with("-> b") {
                return format!("{} -> b", override_val);
            }
            return l.to_string();
        })
        .collect::<Vec<String>>()
        .join("\n");
    part_1(&new)
}

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total = Instant::now();

    println!("day 7");
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
