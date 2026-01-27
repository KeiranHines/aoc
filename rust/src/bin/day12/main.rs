use std::{env, fs, time::Instant};

use regex::Regex;
use serde_json::Value;

fn part_1(content: &str) -> i32 {
    let re = Regex::new(r"(-?\d+)").unwrap();
    re.find_iter(content)
        .filter_map(|m| m.as_str().parse::<i32>().ok())
        .sum()
}

fn parse_json(data: &Value) -> i64 {
    let mut total = 0;
    if data.is_array() {
        for d in data.as_array().unwrap() {
            total += parse_json(d);
        }
    } else if data.is_number() {
        total += data.as_i64().unwrap()
    } else if data.is_object() {
        let d = data.as_object().unwrap();
        let vals = d.values();
        if !vals.clone().any(|v| v.as_str() == Some("red")) {
            for v in vals {
                total += parse_json(v);
            }
        }
    }
    total
}

fn part_2(content: &str) -> i64 {
    let data = serde_json::from_str(content).unwrap();
    parse_json(&data)
}

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total = Instant::now();

    println!("day 12");
    let args: Vec<String> = env::args().collect();
    if args.len() != 2 {
        println!("Requires file path to input as arg1");
    }
    let contents = fs::read_to_string(&args[1])?;
    let mut start = Instant::now();
    let p1 = part_1(&contents);
    let p1t = start.elapsed();
    start = Instant::now();
    let p2 = part_2(&contents);
    let p2t = start.elapsed();

    let t = total.elapsed();

    println!("Part 1: {p1} {p1t:?}, Part 2: {p2} {p2t:?} | Total: {t:?}");
    Ok(())
}

#[cfg(test)]
mod test {
    use super::*;
    use serde_json::json;
    #[test]
    fn test_parse_json() {
        let j = json!([1, 2, 3]);
        assert_eq!(parse_json(&j), 6);
        let j = json!([1,{"c":"red","b":2},3]);
        assert_eq!(parse_json(&j), 4);
        let j = json!({"d":"red","e":[1,2,3,4],"f":5});
        assert_eq!(parse_json(&j), 0);
        let j = json!([1, "red", 5]);
        assert_eq!(parse_json(&j), 6);
    }

    #[test]
    fn test_advanced() {
        let j = json!({
            "a": 1,
            "b": [1, 2, "red"],
            "c": {"a": "red", "b": 100},
            "d": {"a":1, "b":2, "c": {"a": 1, "b":2, "c": {"a": 1000, "b":"red"}}}
        });
        assert_eq!(parse_json(&j), 10);
    }
}
