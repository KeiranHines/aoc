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

pub fn part2(input: &str) -> u64 {
    let mut all: HashMap<&str, Entry> = HashMap::new();
    let mut mapping: HashMap<&str, u16> = HashMap::new();
    input.lines().for_each(|l| {
        let parts: Vec<&str> = l.split(": ").collect();
        all.insert(
            parts[0],
            Entry {
                connected: parts[1].split(" ").collect(),
            },
        );
    });
    let mut x = find_all_paths_dfs(&all, &"svr", &"out");
    x.retain(|p| p.contains(&"dac") && p.contains(&"fft"));
    x.len() as u64
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
