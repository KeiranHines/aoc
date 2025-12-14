use std::{
    collections::{HashMap, HashSet},
    fs,
    time::Instant,
};

#[derive(Clone)]
struct Entry<'a> {
    connected: Vec<&'a str>,
}

fn find_all_paths_dfs<'a>(
    graph: &'a HashMap<&'a str, Entry>,
    start_node: &'a str,
    end_node: &'a str,
) -> Vec<Vec<&'a str>> {
    let mut all_paths = Vec::new();
    let mut current_path = Vec::new();
    let mut visited = HashSet::new();

    dfs_backtrack(
        graph,
        start_node,
        end_node,
        &mut current_path,
        &mut visited,
        &mut all_paths,
    );

    all_paths
}

fn dfs_backtrack<'a>(
    graph: &'a HashMap<&'a str, Entry>,
    current_node: &'a str,
    end_node: &'a str,
    current_path: &mut Vec<&'a str>,
    visited: &mut HashSet<&'a str>,
    all_paths: &mut Vec<Vec<&'a str>>,
) {
    // Mark the current node as visited and add to the current path
    visited.insert(current_node);
    current_path.push(current_node);

    if current_node == end_node {
        // Found a path, add a clone to the results
        all_paths.push(current_path.clone());
    } else {
        // Explore neighbors
        for &neighbor in &graph.get(&current_node).unwrap().connected {
            if !visited.contains(&neighbor) {
                dfs_backtrack(graph, neighbor, end_node, current_path, visited, all_paths);
            }
        }
    }

    // Backtrack: unmark the node and remove from the current path
    current_path.pop();
    visited.remove(&current_node);
}

pub fn part1(input: &str) -> u64 {
    let mut all: HashMap<&str, Entry> = HashMap::new();
    input.lines().for_each(|l| {
        let parts: Vec<&str> = l.split(": ").collect();
        all.insert(
            parts[0],
            Entry {
                connected: parts[1].split(" ").collect(),
            },
        );
    });
    find_all_paths_dfs(&all, &"you", &"out").len() as u64
}

struct Entry2 {
    connected: Vec<u16>,
}

fn find_all_paths_dfs2(
    graph: &HashMap<u16, Entry2>,
    start_node: u16,
    end_node: u16,
    skip_node: Option<u16>,
) -> Vec<Vec<u16>> {
    let mut all_paths = Vec::new();
    let mut current_path = Vec::new();
    let mut visited = HashSet::new();
    let _ = match skip_node {
        Some(n) => visited.insert(n),
        _ => false,
    };
    dfs_backtrack2(
        graph,
        start_node,
        end_node,
        &mut current_path,
        &mut visited,
        &mut all_paths,
    );

    all_paths
}

fn dfs_backtrack2(
    graph: &HashMap<u16, Entry2>,
    current_node: u16,
    end_node: u16,
    current_path: &mut Vec<u16>,
    visited: &mut HashSet<u16>,
    all_paths: &mut Vec<Vec<u16>>,
) {
    // Mark the current node as visited and add to the current path
    visited.insert(current_node);
    current_path.push(current_node);

    if current_node == end_node {
        // Found a path, add a clone to the results
        all_paths.push(current_path.clone());
    } else {
        // Explore neighbors
        for &neighbor in &graph.get(&current_node).unwrap().connected {
            if !visited.contains(&neighbor) {
                dfs_backtrack2(graph, neighbor, end_node, current_path, visited, all_paths);
            }
        }
    }

    // Backtrack: unmark the node and remove from the current path
    current_path.pop();
    visited.remove(&current_node);
}
fn count_paths(
    graph: &HashMap<u16, Entry2>,
    current_node: u16,
    end_node: u16,
    count: &mut HashMap<u16, u64>,
) -> u64 {
    if current_node == end_node {
        // Last step from current to end, call it a day.
        return 1;
    }
    if let Some(cached) = count.get(&current_node) {
        return *cached;
    }
    let mut total = 0;
    for ele in &graph.get(&current_node).unwrap().connected {
        total += count_paths(graph, *ele, end_node, count);
    }
    count.insert(current_node, total);
    total
}

pub fn part2(input: &str) -> u64 {
    let mut all: HashMap<u16, Entry2> = HashMap::new();
    let mut mapping: HashMap<&str, u16> = HashMap::new();
    let mut next = 0;
    input.lines().for_each(|l| {
        let parts: Vec<&str> = l.split(": ").collect();
        mapping.insert(parts[0], next);
        next += 1;
    });
    mapping.insert(&"out", next);
    input.lines().for_each(|l| {
        let parts: Vec<&str> = l.split(": ").collect();
        all.insert(
            *mapping.get(parts[0]).unwrap(),
            Entry2 {
                connected: parts[1]
                    .split(" ")
                    .map(|s| *mapping.get(s).unwrap())
                    .collect(),
            },
        );
    });
    all.insert(next, Entry2 { connected: vec![] });
    let dac = *mapping.get(&"dac").unwrap();
    let fft = *mapping.get(&"fft").unwrap();
    let svr = *mapping.get(&"svr").unwrap();
    let out = *mapping.get(&"out").unwrap();

    /*let svr_dac = find_all_paths_dfs2(&all, svr, dac, Some(fft)).len();
    println!("svr_dac");
    let dac_fft = find_all_paths_dfs2(&all, dac, fft, None).len();
    println!("dac_fft");
    let fft_out = find_all_paths_dfs2(&all, fft, dac, Some(dac)).len();
    println!("Half way");*/
    let svr_fft = count_paths(&all, svr, fft, &mut HashMap::new());
    let fft_dac = count_paths(&all, fft, dac, &mut HashMap::new());
    let dac_out = count_paths(&all, dac, out, &mut HashMap::new());

    (svr_fft * fft_dac * dac_out) as u64
    //(svr_dac * dac_fft * fft_out) as u64 + (svr_fft * fft_dac * dac_out) as u64

    //0
}

#[allow(dead_code)]
pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let contents = fs::read_to_string("inputs/day11.txt")?;
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
    let input = "aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out";
    let p1 = part1(input);
    assert_eq!(p1, 5);
}

#[test]
fn test_example2() {
    let input = "svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out";
    let p2 = part2(input);
    assert_eq!(p2, 2);
}
