use std::{env, fs, time::Instant};

fn process(content: &str, iter: u8) -> usize {
    let mut input = content.trim().to_string();
    for _ in 0..iter {
        let chars = input.chars().collect::<Vec<_>>();
        let mut output = "".to_string();
        let mut active_char = chars[0];
        let mut active_count = 0;
        for c in chars {
            if c == active_char {
                active_count += 1;
            } else {
                output += format!("{}{}", active_count, active_char).as_ref();
                active_char = c;
                active_count = 1;
            }
        }

        output += format!("{}{}", active_count, active_char).as_ref();
        input = output;
    }
    input.len()
}

fn part_1(content: &str) -> usize {
    process(content, 40)
}
fn part_2(content: &str) -> usize {
    process(content, 50)
}

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total = Instant::now();

    println!("day 10");
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
