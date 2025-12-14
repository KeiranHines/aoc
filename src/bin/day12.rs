use core::fmt;
use std::{
    fs::{self},
    time::Instant,
};

struct Shape {
    shape: Vec<Vec<u8>>,
}

impl fmt::Debug for Shape {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "\n")?;
        for l in &self.shape {
            for c in l {
                if *c == 1 {
                    write!(f, "{c}")?;
                } else {
                    write!(f, " ")?;
                }
            }
            write!(f, "\n")?;
        }
        Ok(())
    }
}

pub fn part1(input: &str) -> u64 {
    let mut total = 0;
    let sections: Vec<&str> = input.split("\n\n").collect();
    let mut shapes: Vec<Shape> = Vec::new();
    for s in sections {
        let lines: Vec<&str> = s.lines().collect();
        if !lines[0].contains("x") {
            // Input shape
            let shape = lines[1..]
                .iter()
                .map(|row| {
                    row.chars()
                        .map(|c| {
                            if c == '.' {
                                return 0;
                            }
                            return 1;
                        })
                        .collect::<Vec<u8>>()
                })
                .collect::<Vec<Vec<u8>>>();
            shapes.push(Shape { shape: shape });
        } else {
            // Target grid
            for line in s.lines() {
                let parts: Vec<&str> = line.split(": ").collect();
                let sizes: Vec<&str> = parts[0].split("x").collect();
                let w: u8 = sizes[0].parse().unwrap();
                let h: u8 = sizes[1].parse().unwrap();
                let area = w as u16 * h as u16;

                let required = parts[1]
                    .split(" ")
                    .map(|n| n.parse::<u16>().unwrap())
                    .sum::<u16>()
                    * 9;
                if area >= required {
                    total += 1;
                }
            }
        }
    }
    total
}

pub fn part2(input: &str) -> u64 {
    0
}

#[allow(dead_code)]
pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let contents = fs::read_to_string("inputs/day12.txt")?;
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
    let input = "0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2
";
    let p1 = part1(input);
    assert_eq!(p1, 2);
}

#[test]
fn test_example2() {
    let input = "";
    let p2 = part2(input);
    assert_eq!(p2, 40);
}
