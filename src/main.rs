use std::time::Instant;

#[path = "bin/day1.rs"]
mod day1;
#[path = "bin/day2.rs"]
mod day2;
#[path = "bin/day3.rs"]
mod day3;
#[path = "bin/day4.rs"]
mod day4;
#[path = "bin/day5.rs"]
mod day5;
#[path = "bin/day6.rs"]
mod day6;
#[path = "bin/day7.rs"]
mod day7;

#[tokio::main]
async fn main() {
    let start = Instant::now();
    let _ = day1::main();
    let _ = day2::async_runner().await;
    let _ = day3::main();
    let _ = day4::main();
    let _ = day5::main();
    let _ = day6::main();
    let _ = day7::main();
    let elapsed = start.elapsed();
    println!("Took {elapsed:?} to run all days");
}
