use std::{
    collections::{HashMap, HashSet},
    fs,
    time::Instant,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct Pos {
    y: usize,
    x: usize,
}

pub fn part1(input: &str) -> u64 {
    let mut total = 0;
    let mut beams = HashSet::from([input.find("S").unwrap()]); // Assume we start on the first line.

    let mut splits = Vec::new();
    for r in input.lines() {
        let c: Vec<char> = r.chars().collect();
        for b in &beams {
            if c[*b] == '^' {
                splits.push(*b - 1);
                splits.push(*b + 1);
                total += 1;
            } else {
                splits.push(*b);
            }
        }
        beams.clear();
        beams.extend(splits.clone());
        splits.clear();
    }
    total
}

pub fn part2(input: &str) -> u64 {
    let rows: Vec<&str> = input.lines().collect();
    let start = input.find("S").unwrap();
    let mut beams = HashSet::from([start]);
    let mut count_map: HashMap<Pos, u64> = HashMap::new();
    count_map.insert(Pos { y: 0, x: start }, 1);
    for i in 1..rows.len() {
        let r = rows[i];
        let mut splits = Vec::new();
        let p_i = i - 1;
        let c: Vec<char> = r.chars().collect();
        for b in &beams {
            let prev = *count_map.get(&Pos { y: p_i, x: *b }).unwrap();
            if c[*b] == '^' {
                splits.push(*b - 1);
                count_map
                    .entry(Pos { y: i, x: *b - 1 })
                    .and_modify(|i| *i += prev)
                    .or_insert(prev);
                splits.push(*b + 1);
                count_map
                    .entry(Pos { y: i, x: *b + 1 })
                    .and_modify(|i| *i += prev)
                    .or_insert(prev);
            } else {
                splits.push(*b);
                count_map
                    .entry(Pos { y: i, x: *b })
                    .and_modify(|i| *i += prev)
                    .or_insert(prev);
            }
        }
        beams.clear();
        beams.extend(splits);
    }
    beams
        .iter()
        .map(|b| {
            *count_map
                .get(&Pos {
                    y: rows.len() - 1,
                    x: *b,
                })
                .unwrap()
        })
        .sum()
}

#[allow(dead_code)]
pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let contents = fs::read_to_string("inputs/day7.txt")?;
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
fn test_example1() {
    let input = ".......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............
";
    let p1 = part1(input);
    assert_eq!(p1, 21);
}

#[test]
fn test_example2() {
    let input = ".......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............
";
    let p2 = part2(input);
    assert_eq!(p2, 40);
}

#[test]
fn test_single() {
    let input = ".......S.......
...............
.......^.......
...............
......^.^......
...............
";
    let p2 = part2(input);
    assert_eq!(p2, 4);
}
#[test]
fn test_simple() {
    let input = ".......S.......
...............
.......^.......
...............
......^.^......
.......^.......
...............
";
    let p2 = part2(input);
    assert_eq!(p2, 7);
}
