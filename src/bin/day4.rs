use std::{fs, time::Instant};

const TP: char = '@';

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
    let mut can_remove = true;
    let mut grid: Vec<Vec<char>> = input.lines().map(|l| l.chars().collect()).collect();
    while can_remove {
        can_remove = false;
        for y in 0..grid.len() {
            let row = grid.get(y).unwrap().clone();
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
                        grid[y][x] = '.';
                        can_remove = true;
                    }
                }
            }
        }
    }

    free
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
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
