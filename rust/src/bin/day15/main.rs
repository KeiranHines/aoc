use std::{env, fs, time::Instant};

#[derive(Debug, Default)]
struct Ingredient {
    name: String,
    capacity: i32,
    durability: i32,
    flavor: i32,
    texture: i32,
    calories: i32,
}

fn get_num(ing: &str) -> i32 {
    let parts = ing.split(" ").collect::<Vec<&str>>();
    return parts[1].parse().unwrap();
}

fn calc_score(mutlipliers: &[i32], ingredients: &[Ingredient]) -> i32 {
    let mut mixed = Ingredient::default();
    for (i, m) in mutlipliers.iter().enumerate() {
        let ing = &ingredients[i];
        mixed.capacity += ing.capacity * m;
        mixed.durability += ing.durability * m;
        mixed.flavor += ing.flavor * m;
        mixed.texture += ing.texture * m;
    }
    mixed.capacity.max(0) * mixed.durability.max(0) * mixed.flavor.max(0) * mixed.texture.max(0)
}

fn part_1(content: &str) -> i16 {
    let ingredients = content
        .trim()
        .lines()
        .map(|line| {
            let (name, details) = line.split_once(": ").unwrap();
            let parts = details.split(", ").collect::<Vec<&str>>();
            Ingredient {
                name: name.to_string(),
                capacity: get_num(parts[0]),
                durability: get_num(parts[1]),
                flavor: get_num(parts[2]),
                texture: get_num(parts[3]),
                calories: get_num(parts[4]),
            };
        })
        .collect::<Vec<_>>();
    println!(" Ingredients: {ingredients:?}");
    0
}
fn part_2(_content: &str) -> i16 {
    0
}

pub fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total = Instant::now();

    println!("day X");
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

#[test]
fn test_example_1_sum() {
    //Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
    // Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3
    let butter = Ingredient {
        name: "Butterscotch".to_string(),
        capacity: -1,
        durability: -2,
        flavor: 6,
        texture: 3,
        calories: 8,
    };
    let cinnamon = Ingredient {
        name: "Cinnamon".to_string(),
        capacity: 2,
        durability: 3,
        flavor: -2,
        texture: -1,
        calories: 3,
    };
    let total = calc_score(&[44, 56], &[butter, cinnamon]);
    assert_eq!(total, 62842880);
}
