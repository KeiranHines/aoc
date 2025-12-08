use core::fmt;
use std::{fs, time::Instant};

#[derive(Clone, Copy, PartialEq, Eq, Hash)]
struct Pos {
    x: i32,
    y: i32,
    z: i32,
}

impl fmt::Debug for Pos {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{},{},{}", self.x, self.y, self.z)
    }
}

struct Connection {
    pos1: Pos,
    pos2: Pos,
    distance: f32,
}

impl fmt::Debug for Connection {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}->{:?}:{}", self.pos1, self.pos2, self.distance)
    }
}

impl PartialEq for Connection {
    fn eq(&self, other: &Self) -> bool {
        let direct_match = self.pos1 == other.pos1 && self.pos2 == other.pos2;
        let alt_match = self.pos1 == other.pos2 && self.pos2 == other.pos1;
        self.distance == other.distance && (direct_match || alt_match)
    }
}
impl Eq for Connection {}

fn distance_to(pos1: Pos, pos2: Pos) -> f32 {
    (((pos1.x - pos2.x).pow(2) + (pos1.y - pos2.y).pow(2) + (pos1.z - pos2.z).pow(2)) as f32).sqrt()
    //((pos1.x - pos2.x).abs() + (pos1.y - pos2.y).abs() + (pos1.z - pos2.z).abs()) as u64
}

pub fn part1(input: &str) -> u64 {
    part1_processing(input, 10_000)
}

fn part1_processing(input: &str, limit: u32) -> u64 {
    let mut boxes: Vec<Pos> = Vec::with_capacity(1_000);
    let mut connections: Vec<Connection> = Vec::with_capacity(limit as usize);
    let mut dist;
    for line in input.lines() {
        let p: Vec<&str> = line.split(",").collect();
        let pos = Pos {
            x: p[0].parse().unwrap(),
            y: p[1].parse().unwrap(),
            z: p[2].parse().unwrap(),
        };

        boxes.push(pos);
    }

    for (i, b1) in boxes.iter().enumerate() {
        for (j, b2) in boxes[i + 1..].iter().enumerate() {
            if i == j {
                continue;
            }
            dist = distance_to(*b1, *b2);
            let new_con = Connection {
                pos1: *b1,
                pos2: *b2,
                distance: dist,
            };
            connections.push(new_con);
        }
    }
    connections.sort_by(|a, b| {
        a.distance.partial_cmp(&b.distance).unwrap_or_else(|| {
            // Define custom ordering for NaNs
            if a.distance.is_nan() && b.distance.is_nan() {
                std::cmp::Ordering::Equal
            } else if a.distance.is_nan() {
                std::cmp::Ordering::Greater
            } else {
                std::cmp::Ordering::Less
            }
        })
    });

    connections.reverse();

    let mut seen: Vec<Pos> = Vec::with_capacity(limit as usize);
    let mut circuits: Vec<Vec<Pos>> = Vec::new();
    let mut c: Connection;
    for _i in 0..limit {
        //let _ = connections.pop(); // I wrote bad code so I really only need every second
        c = connections.pop().unwrap();
        println!("{_i}");
        let seen1 = seen.contains(&c.pos1);
        let seen2 = seen.contains(&c.pos2);

        if !seen1 && !seen2 {
            // TODO: Probably need to check if they are on the same circuit first

            // Neither seen, create new circuit
            seen.push(c.pos1);
            seen.push(c.pos2);
            circuits.push(vec![c.pos1, c.pos2]);
        } else if !seen1 {
            // p1 exists only add p2.
            seen.push(c.pos1);
            for circ in &mut circuits {
                if circ.contains(&c.pos2) {
                    circ.push(c.pos1);
                }
            }
        } else if !seen2 {
            // p1 exists only add p2.
            seen.push(c.pos2);
            for circ in &mut circuits {
                if circ.contains(&c.pos1) {
                    circ.push(c.pos2);
                }
            }
        } else {
            let mut c1 = None;
            let mut c2 = None;
            for circ in &mut circuits {
                if circ.contains(&c.pos1) {
                    c1 = Some(circ);
                } else if circ.contains(&c.pos2) {
                    c2 = Some(circ);
                }
            }
            if c1 != None && c2 != None {
                // If one is None they are already in the same collection
                let f = c1.unwrap();
                for c in c2.unwrap() {
                    f.push(*c);
                }
            }
        }
        //println!("Iteration {i} {} {circuits:?}", seen.len());
    }
    let mut total = 1;

    circuits.sort_by(|a, b| a.len().cmp(&b.len()));

    circuits[circuits.len() - 3..].iter().for_each(|c| {
        println!("c len {}", c.len());
        total *= c.len()
    });

    total as u64
}

pub fn part2(input: &str) -> u64 {
    0
}

#[allow(dead_code)]
pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let contents = fs::read_to_string("inputs/day8.txt")?;
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
fn test_closest() {
    let p1 = Pos {
        x: 162,
        y: 817,
        z: 812,
    };
    let p2 = Pos {
        x: 425,
        y: 690,
        z: 689,
    };

    assert_eq!(distance_to(p1, p2), 316.9022);
}

#[test]
fn test_example1() {
    let input = "162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689
";
    let p1 = part1_processing(input, 10);
    assert_eq!(p1, 40);
}

/*#[test]
fn test_example2() {
    let input = "";
    let p2 = part2(input);
    assert_eq!(p2, 40);
}*/
