use std::{env, fs, time::Instant};

fn part_1(content: &str) -> usize {
    let mut grid: [[bool; 1000]; 1000] = [[false; 1000]; 1000];
    content.trim().lines().for_each(|line| {
        let parts: Vec<_> = line.split(" ").collect();
        let (e_x, e_y) = parts[parts.len() - 1].split_once(",").unwrap();
        let (s_x, s_y) = parts[parts.len() - 3].split_once(",").unwrap();

        let e_x: usize = e_x.parse().unwrap();
        let e_y: usize = e_y.parse().unwrap();
        let s_x: usize = s_x.parse().unwrap();
        let s_y: usize = s_y.parse().unwrap();

        let cmd = parts[parts.len() - 4];

        for x in s_x..e_x + 1 {
            for y in s_y..e_y + 1 {
                match cmd {
                    "on" => grid[y][x] = true,
                    "off" => grid[y][x] = false,
                    "toggle" => grid[y][x] = !grid[y][x],
                    _ => unreachable!(),
                }
            }
        }
    });

    grid.iter()
        .map(|row| row.iter().filter(|x| **x).count())
        .sum()
}
fn part_2(content: &str) -> usize {
    let mut grid: [[u16; 1000]; 1000] = [[0; 1000]; 1000];
    content.trim().lines().for_each(|line| {
        let parts: Vec<_> = line.split(" ").collect();
        let (e_x, e_y) = parts[parts.len() - 1].split_once(",").unwrap();
        let (s_x, s_y) = parts[parts.len() - 3].split_once(",").unwrap();

        let e_x: usize = e_x.parse().unwrap();
        let e_y: usize = e_y.parse().unwrap();
        let s_x: usize = s_x.parse().unwrap();
        let s_y: usize = s_y.parse().unwrap();

        let cmd = parts[parts.len() - 4];

        for x in s_x..e_x + 1 {
            for y in s_y..e_y + 1 {
                match cmd {
                    "on" => grid[y][x] += 1,
                    "off" => grid[y][x] = grid[y][x].saturating_sub(1),
                    "toggle" => grid[y][x] += 2,
                    _ => unreachable!(),
                }
            }
        }
    });

    grid.iter()
        .map(|row| row.iter().sum::<u16>() as usize)
        .sum()
}

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total = Instant::now();

    println!("day 6");
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
fn test_all_lights() {
    let insruction = "turn on 0,0 through 999,999";
    let ans = part_1(insruction);
    assert_eq!(ans, 1000 * 1000);
}
