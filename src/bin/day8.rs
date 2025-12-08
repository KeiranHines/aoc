use core::fmt;
use std::{cmp, fs, time::Instant};

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

#[derive(Clone)]
struct Connection {
    pos1: Pos,
    pos2: Pos,
    distance: f64,
}

impl fmt::Debug for Connection {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}->{:?}:{}", self.pos1, self.pos2, self.distance)
    }
}

/*impl PartialEq for Connection {
    fn eq(&self, other: &Self) -> bool {
        let direct_match = self.pos1 == other.pos1 && self.pos2 == other.pos2;
        let alt_match = self.pos1 == other.pos2 && self.pos2 == other.pos1;
        self.distance == other.distance && (direct_match || alt_match)
    }
}
impl Eq for Connection {}
*/
fn distance_to(pos1: Pos, pos2: Pos) -> f64 {
    // No euclidian distance, sqrt == float == bad
    let x = (((pos1.x - pos2.x).pow(2) + (pos1.y - pos2.y).pow(2) + (pos1.z - pos2.z).pow(2))
        as f64)
        .sqrt();
    //print!("{x} ");
    x
    //((pos1.x - pos2.x).abs() + (pos1.y - pos2.y).abs() + (pos1.z - pos2.z).abs()) as u64
}

pub fn part1(input: &str) -> u64 {
    part1_processing(input, 1000)
}

fn part1_processing(input: &str, limit: u32) -> u64 {
    let mut boxes: Vec<Pos> = Vec::with_capacity(1_000);
    let mut circuits: Vec<Vec<Pos>> = Vec::with_capacity(1_000);
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
        circuits.push(vec![pos]);
    }

    for (i, b1) in boxes.iter().enumerate() {
        for b2 in boxes[i + 1..].iter() {
            dist = distance_to(*b1, *b2);
            let new_con = Connection {
                pos1: *b1,
                pos2: *b2,
                distance: dist,
            };
            connections.push(new_con);
        }
    }
    // All possible connections found
    //let mut cp: Vec<Connection> = connections.clone();
    //cp.sort_by(|a, b| b.distance.total_cmp(&a.distance));

    //connections.sort_by(|a, b| b.distance.total_cmp(&a.distance));
    connections.sort_by(|a, b| a.distance.total_cmp(&b.distance));
    connections.reverse();
    /*   for i in 0..connections.len() {
        if cp[i] != connections[i] {
            println!("Mismatch {i} {:?} {:?}", cp[i], connections[i]);
            return 0;
        }
    }*/
    // All possible connections are now sorted
    let mut c: Connection;
    for _i in 0..limit {
        c = connections.pop().unwrap();
        let mut c1 = None;
        let mut c2 = None;
        for (j, circ) in &mut circuits.iter().enumerate() {
            if circ.contains(&c.pos1) {
                c1 = Some(j);
            }
            if circ.contains(&c.pos2) {
                c2 = Some(j);
            }
        }
        let c1 = c1.unwrap();
        let c2 = c2.unwrap();
        if c1 != c2 {
            let remove = cmp::max(c1, c2);
            let keep = cmp::min(c1, c2);
            let other = circuits.remove(remove);
            circuits[keep].extend(other);
        }
    }

    circuits.sort_by(|a, b| b.len().cmp(&a.len()));
    println!(
        "Circuits len {:?}",
        circuits.iter().map(|c| c.len()).collect::<Vec<usize>>(),
    );
    (circuits[0].len() * circuits[1].len() * circuits[2].len()) as u64
}

#[allow(dead_code)]
pub fn part2(_input: &str) -> u64 {
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
