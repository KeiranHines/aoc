use std::{cmp, fs, time::Instant};

pub fn part1(input: &str) -> u64 {
    let mut max = 0;
    let red_tiles: Vec<(i64, i64)> = input
        .lines()
        .map(|l| {
            let parts: Vec<&str> = l.split(",").collect();
            (
                parts[0].parse::<i64>().unwrap(),
                parts[1].parse::<i64>().unwrap(),
            )
        })
        .collect();
    for (i, t1) in red_tiles.iter().enumerate() {
        for t2 in &red_tiles[i + 1..] {
            let area = (1 + (t1.0 - t2.0).abs()) * (1 + (t1.1 - t2.1).abs());
            if area > max {
                max = area
            }
        }
    }
    max as u64
}

pub fn part2(input: &str) -> u64 {
    let mut options = Vec::new();
    let red_tiles: Vec<(i64, i64)> = input
        .lines()
        .map(|l| {
            let parts: Vec<&str> = l.split(",").collect();
            (
                parts[0].parse::<i64>().unwrap(),
                parts[1].parse::<i64>().unwrap(),
            )
        })
        .collect();
    let mut a1: (i64, i64);
    let mut a2: (i64, i64); // TODO: Add a into the tuple should be the 4th corner
    let mut area: i64;
    for (i, t1) in red_tiles.iter().enumerate() {
        for t2 in &red_tiles[i + 1..] {
            a1 = (t1.0, t2.1);
            a2 = (t2.0, t1.1);
            area = (1 + (t1.0 - t2.0).abs()) * (1 + (t1.1 - t2.1).abs());
            options.push((t1, a1, t2, a2, area));
        }
    }
    /*
        // Add loop arounds
        f = &red_tiles[red_tiles.len() - 1];
        n = &red_tiles[0];
        e = &red_tiles[1];
        if f.0 == n.0 {
            // first and next are on the same y axis, final will be at ex-fy
            a = (e.0, f.1);
        } else {
            // first and next are on differnt y axis, finaly will be fx-ey.
            a = (f.0, e.1);
        }
        area = (1 + (f.0 - e.0).abs()) * (1 + (f.1 - e.1).abs());
        options.push((f, n, e, a, area));

        f = &red_tiles[red_tiles.len() - 2];
        n = &red_tiles[red_tiles.len() - 1];
        e = &red_tiles[0];
        if f.0 == n.0 {
            // first and next are on the same y axis, final will be at ex-fy
            a = (e.0, f.1);
        } else {
            // first and next are on differnt y axis, finaly will be fx-ey.
            a = (f.0, e.1);
        }
        area = (1 + (f.0 - e.0).abs()) * (1 + (f.1 - e.1).abs());
        options.push((&f, n, e, a, area));
    */
    //options.retain(|o| o.4 > 159183472); // Hack to test only results that should be valid
    options.sort_by_key(|o| -o.4);
    for o in &options {
        // Example We know corners 1, 2, 3 are valid, we need to know if 4 is.
        //..............
        //.......#XXX#..
        //.......XXXXX..
        //..3OOOOOO4XX..
        //..OOOOOOOOXX..
        //..2OOOOOO1XX..
        //.........XXX..
        //.........#X#..
        //..............
        // Check for all points from 1-4 AND 3-4 If exactly one point is a corner we are
        // good?
        let mut corners = 0;
        println!("running checks on {o:?}");
        if o.0.0 != o.3.0 {
            // second param is the same.
            let c1 = o.0.1;
            let c2 = o.2.0;
            let min_1 = cmp::min(o.0.0, o.3.0);
            let max_1 = cmp::max(o.0.0, o.3.0);
            let min_2 = cmp::min(o.2.1, o.3.1);
            let max_2 = cmp::max(o.2.1, o.3.1);

            /*println!(
                "second param is the same, checking {:?}-{:?} and {:?}-{:?}",
                (min_1, c1),
                (max_1, c1),
                (c2, min_2),
                (c2, max_2)
            );*/
            println!("Checking a {min_1},{c1} to {},{c1}", max_1 - 1);
            for i in min_1..max_1 {
                let test = (i, c1);
                if *o.0 == test || o.1 == test || *o.2 == test || o.3 == test {
                    continue;
                }
                if red_tiles.contains(&test) {
                    println!("Corner found at {i},{c1}");
                    corners += 1;
                }
            }
            println!("Checking b {c2},{min_2} to {c2},{}", max_2 - 1);
            for i in min_2..max_2 {
                let test = (c2, i);
                if *o.0 == test || o.1 == test || *o.2 == test || o.3 == test {
                    continue;
                }
                if red_tiles.contains(&test) {
                    println!("Corner found at {c2},{i}");
                    corners += 1;
                }
            }
        } else {
            // first param is the same.

            let c1 = o.0.0;
            let c2 = o.2.1;
            let min_1 = cmp::min(o.0.1, o.3.1);
            let max_1 = cmp::max(o.0.1, o.3.1);
            let min_2 = cmp::min(o.2.0, o.3.0);
            let max_2 = cmp::max(o.2.0, o.3.0);

            //..............
            //.......1XXX2..
            //.......XXXXX..
            //..#XXXX#XXXX..
            //..XXXXXXXXXX..
            //..#XXXXXX#XX..
            //.........XXX..
            //.......4.#X3..
            //..............
            /*println!(
                "First param is the same, checking {:?}-{:?} and {:?}-{:?}",
                (c1, min_1),
                (c1, max_1),
                (min_2, c2),
                (max_2, c2)
            );*/
            println!("Checking c {c1},{min_1} to {c1}, {}", max_1 - 1);
            for i in min_1..max_1 {
                let test = (c1, i);
                if *o.0 == test || o.1 == test || *o.2 == test || o.3 == test {
                    continue;
                }
                if red_tiles.contains(&test) {
                    println!("Corner found at {c1},{i}");
                    corners += 1;
                }
            }
            println!("Checking d {min_2},{c2} to {},{c2}", max_2 - 1);
            for i in min_2..max_2 {
                let test = (i, c2);
                if *o.0 == test || o.1 == test || *o.2 == test || o.3 == test {
                    continue;
                }
                if red_tiles.contains(&test) {
                    println!("Corner found at {i},{c2}");
                    corners += 1;
                }
            }
        }
        /*  println!(
            "Checking {o:?} {} f1: {} f2: {} \n",
            (found_1 ^ found_2),
            found_1,
            found_2
        );*/
        println!("{o:?} corners: {corners}");
        //if corners % 2 == 1 {
        if corners <= 4 {
            // TODO: Need to update the above to check all edges
            println!("Returning {o:?} with corners {corners}");
            return o.4 as u64;
        }
    }
    //println!("{options:?}");

    // TODO: 159183472 is not right, too low
    0
}

#[allow(dead_code)]
pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let contents = fs::read_to_string("inputs/day9.txt")?;
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
fn test_simple() {
    let input = "2,5
11,1";
    let p1 = part1(input);
    assert_eq!(p1, 50);
}

#[test]
fn test_example1() {
    let input = "7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3";
    let p1 = part1(input);
    assert_eq!(p1, 50);
}

#[test]
fn test_example2() {
    let input = "7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3";
    let p2 = part2(input);
    assert_eq!(p2, 24);
}

#[test]
fn test_case_that_was_missed() {

    //..............
    //.......#XXX#..
    //.......XXXXX..
    //..3OOOOOO4XX..
    //..2OOOOOOOX#OOOOOOOOO3..
    //..1OOOOOO#X#OOOOOOOOO4..
    //.........XXX..
    //.........#X#..
    //..............
}

// Test Plot
// 01234567890123
//0..............
//1.......#XXX#..
//2.......XXXXX..
//3..#XXXX#XXXX..
//4..XXXXXXXXXX..
//5..#XXXXXX#XX..
//6.........XXX..
//7.........#X#..
//8..............

// Test Plot (40 returned)
// corners at 2,5 | 9,5 | 9,3 only hit one
// 01234567890123
//0..............
//1.......#XXX#..
//2.......XXXXX..
//3..OXXXX#XXXX..
//4..XXXXXXXXXX..
//5..#XXXXXX#XX..
//6.........XXX..
//7.........OX#..
//8..............
