use core::fmt;
use std::{cmp, collections::HashSet, fs, time::Instant};

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
    distance: i32,
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

fn distance_to(pos1: Pos, pos2: Pos) -> i32 {
    // No euclidian distance, sqrt == float == bad
    (pos1.x - pos2.x).pow(2) + (pos1.y - pos2.y).pow(2) + (pos1.z - pos2.z).pow(2)
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
    connections.sort_by(|a, b| a.distance.cmp(&b.distance));

    connections.reverse();

    let mut circuits: Vec<Vec<Pos>> = Vec::new();
    let mut c: Connection;
    for _i in 0..limit {
        //let _ = connections.pop(); // I wrote bad code so I really only need every second
        c = connections.pop().unwrap();
        let mut c1 = None;
        let mut c2 = None;
        for (i, circ) in &mut circuits.iter().enumerate() {
            if circ.contains(&c.pos1) {
                c1 = Some(i);
            }
            if circ.contains(&c.pos2) {
                c2 = Some(i);
            }
        }
        if c1 == None && c2 == None {
            circuits.push(vec![c.pos1, c.pos2]);
        } else if c2 == None {
            // Only c1 is set
            circuits[c1.unwrap()].push(c.pos2);
        } else if c1 == None {
            // Only c2 is set
            circuits[c2.unwrap()].push(c.pos1);
        } else {
            if c1.unwrap() != c2.unwrap() {
                let remove = cmp::max(c1.unwrap(), c2.unwrap());
                let keep = cmp::min(c1.unwrap(), c2.unwrap());
                let other = circuits.remove(remove);
                circuits[keep].extend(other);
            } else {
                println!("Nothing happens");
            }
        }
        //println!("It: {_i} {circuits:?}");
    }
    let mut total = 1;

    circuits.sort_by(|a, b| b.len().cmp(&a.len()));
    let mut temp: HashSet<Pos> = HashSet::new();
    for c in &circuits {
        temp.extend(c);
        println!("{}", c.len());
    }

    circuits[0..3].iter().for_each(|c| {
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

    assert_eq!(distance_to(p1, p2), 100427);
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
    assert!(false)
}

/*#[test]
fn test_example2() {
    let input = "";
    let p2 = part2(input);
    assert_eq!(p2, 40);
}*/
