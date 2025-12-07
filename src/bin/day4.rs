use std::{fs, time::Instant};

const TP: char = '@';
const EMPTY: char = '.';

pub fn part1(input: &str) -> u64 {
    let mut free = 0;

    let grid: Vec<Vec<char>> = input.lines().map(|l| l.chars().collect()).collect();
    for (y, row) in grid.iter().enumerate() {
        for (x, point) in row.iter().enumerate() {
            let mut count = 0;
            if *point == TP {
                if y > 0 {
                    let top_row = grid.get(y - 1).unwrap();
                    if *top_row.get(x).unwrap() == TP {
                        count += 1;
                    }
                    if x > 0 && *top_row.get(x - 1).unwrap() == TP {
                        // Top Left
                        count += 1;
                    }
                    if x < row.len() - 1 && *top_row.get(x + 1).unwrap() == TP {
                        // Top right
                        count += 1;
                    }
                }
                if y < grid.len() - 1 {
                    let bottom_row = grid.get(y + 1).unwrap();
                    if *bottom_row.get(x).unwrap() == TP {
                        count += 1;
                    }
                    if x > 0 && *bottom_row.get(x - 1).unwrap() == TP {
                        // Botom Left
                        count += 1;
                    }
                    if x < row.len() - 1 && *bottom_row.get(x + 1).unwrap() == TP {
                        // Bottom right
                        count += 1;
                    }
                }
                if x > 0 && *row.get(x - 1).unwrap() == TP {
                    // left
                    count += 1;
                }
                if x < row.len() - 1 && *row.get(x + 1).unwrap() == TP {
                    // Right
                    count += 1;
                }
                if count < 4 {
                    free += 1;
                }
            }
        }
    }

    free
}

pub fn part2(input: &str) -> u64 {
    let mut free = 0;
    let mut grid: Vec<Vec<char>> = input.lines().map(|l| l.chars().collect()).collect();
    let mut tp: Vec<(usize, usize)> = Vec::new();

    for y in 0..grid.len() {
        for x in 0..grid[y].len() {
            if grid[y][x] == TP {
                tp.push((y, x));
            }
        }
    }

    let mut count;
    loop {
        let mut temp = Vec::new();
        for &(y, x) in &tp {
            count = 0;
            let right_edge = x < grid[y].len() - 1;
            if y > 0 {
                let top_row = &grid[y - 1];
                if top_row[x] == TP {
                    count += 1;
                }
                if x > 0 && top_row[x - 1] == TP {
                    // Top Left
                    count += 1;
                }
                if right_edge && top_row[x + 1] == TP {
                    // Top right
                    count += 1;
                }
            }
            if y < grid.len() - 1 {
                let bottom_row = &grid[y + 1];
                if bottom_row[x] == TP {
                    count += 1;
                }
                if x > 0 && bottom_row[x - 1] == TP {
                    // Botom Left
                    count += 1;
                }
                if right_edge && bottom_row[x + 1] == TP {
                    // Bottom right
                    count += 1;
                }
            }
            let row = &grid[y];
            if x > 0 && row[x - 1] == TP {
                // left
                count += 1;
            }
            if right_edge && row[x + 1] == TP {
                // Right
                count += 1;
            }
            if count < 4 {
                free += 1;
                grid[y][x] = EMPTY;
            } else {
                temp.push((y, x));
            }
        }
        if tp.len() == temp.len() {
            break;
        }
        tp = temp;
    }
    free
}

#[allow(dead_code)]
pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let contents = fs::read_to_string("inputs/day4.txt")?;
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
    let input = "..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.";
    let p1 = part1(input);
    assert_eq!(p1, 13);
}

#[test]
fn test_example2() {
    let input = "..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.";
    let p2 = part2(input);
    assert_eq!(p2, 43);
}
