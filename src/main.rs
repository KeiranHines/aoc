use std::hint::black_box;
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};
use std::{env, fs, process};

use aoc::{DAYS, Day, Part, YEAR, days, get, input_path};

mod memory;
use memory::Usage;

#[global_allocator]
static ALLOC: memory::Counting = memory::Counting;

const USAGE: &str = "\
usage:
  cargo aoc               run every solved day
  cargo aoc <day>         run one day
  cargo aoc fetch <day>   download a day's input (needs AOC_SESSION or .session)
  cargo aoc readme        run every solved day and update the table in README.md";

/// Repeat fast parts until this much time has been spent, then report the median.
const SAMPLE_BUDGET: Duration = Duration::from_millis(200);
const MAX_SAMPLES: usize = 1000;

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();
    let args: Vec<&str> = args.iter().map(String::as_str).collect();
    let result = match args.as_slice() {
        [] => run_all().map(|_| ()),
        ["fetch", day] => parse_day(day).and_then(fetch),
        ["readme"] => run_all().and_then(|rows| write_readme(&rows)),
        ["-h" | "--help" | "help"] => {
            println!("{USAGE}");
            Ok(())
        }
        [day] => parse_day(day).and_then(run_one),
        _ => Err(USAGE.to_string()),
    };
    if let Err(e) = result {
        eprintln!("error: {e}");
        process::exit(1);
    }
}

fn parse_day(s: &str) -> Result<u32, String> {
    match s.parse::<u32>() {
        Ok(d) if (1..=DAYS).contains(&d) => Ok(d),
        _ => Err(format!("day must be 1-{DAYS}, got {s:?}")),
    }
}

// ---------------------------------------------------------------- running

struct PartResult {
    answer: Option<String>,
    time: Duration,
    mem: Usage,
}

struct Row {
    day: u32,
    parts: Option<[PartResult; 2]>, // None = no input file
}

fn measure(part: Option<Part>, input: &str) -> PartResult {
    let Some(part) = part else {
        return PartResult {
            answer: None,
            time: Duration::ZERO,
            mem: Usage::default(),
        };
    };
    // The first (cold) run gives the answer and the memory figures.
    let start = Instant::now();
    let (answer, mem) = memory::track(|| part(black_box(input)));
    let first = start.elapsed();
    let answer = Some(answer);
    if first >= SAMPLE_BUDGET {
        return PartResult {
            answer,
            time: first,
            mem,
        };
    }
    let mut samples = vec![first];
    let budget = Instant::now();
    while samples.len() < MAX_SAMPLES && budget.elapsed() < SAMPLE_BUDGET {
        let start = Instant::now();
        black_box(part(black_box(input)));
        samples.push(start.elapsed());
    }
    samples.sort_unstable();
    PartResult {
        answer,
        time: samples[samples.len() / 2],
        mem,
    }
}

fn run_day(day: &Day) -> Row {
    let parts = day
        .input()
        .map(|input| [measure(day.part1, &input), measure(day.part2, &input)]);
    Row {
        day: day.day,
        parts,
    }
}

fn run_one(day: u32) -> Result<(), String> {
    let day = get(day).ok_or_else(|| format!("day {day} is not registered in src/days/mod.rs"))?;
    let row = run_day(&day);
    if row.parts.is_none() {
        return Err(format!(
            "no input at {} (run `cargo aoc fetch {}`)",
            day.input_path().display(),
            day.day
        ));
    }
    print_table(&[row]);
    Ok(())
}

fn run_all() -> Result<Vec<Row>, String> {
    let rows: Vec<Row> = days::all()
        .iter()
        .filter(|d| d.part1.is_some() || d.part2.is_some())
        .map(run_day)
        .collect();
    if rows.is_empty() {
        println!("Nothing solved yet.");
    } else {
        print_table(&rows);
    }
    Ok(rows)
}

fn total(rows: &[Row]) -> Duration {
    rows.iter()
        .flat_map(|r| r.parts.iter().flatten())
        .filter(|p| p.answer.is_some())
        .map(|p| p.time)
        .sum()
}

fn print_table(rows: &[Row]) {
    let head = format!(
        "{:<16} {:>10} {:>10} {:>7}",
        "Answer", "Time", "Peak mem", "Allocs"
    );
    println!("     {:<46}  Part 2", "Part 1");
    println!("{:>3}  {head}  {head}", "Day");
    for row in rows {
        match &row.parts {
            None => println!("{:>3}  no input (cargo aoc fetch {})", row.day, row.day),
            Some([p1, p2]) => println!("{:>3}  {}  {}", row.day, fmt_part(p1), fmt_part(p2)),
        }
    }
    if rows.len() > 1 {
        println!("\nTotal time {}", fmt_duration(total(rows)));
    }
}

fn fmt_part(p: &PartResult) -> String {
    let answer = p.answer.as_deref().unwrap_or("-");
    if p.answer.is_none() {
        return format!("{answer:<16} {:>10} {:>10} {:>7}", "-", "-", "-");
    }
    format!(
        "{answer:<16} {:>10} {:>10} {:>7}",
        fmt_duration(p.time),
        fmt_bytes(p.mem.peak_bytes),
        p.mem.allocs
    )
}

fn fmt_mem(p: &PartResult) -> String {
    if p.answer.is_some() {
        fmt_bytes(p.mem.peak_bytes)
    } else {
        "-".into()
    }
}

fn fmt_bytes(b: usize) -> String {
    let b = b as f64;
    match b {
        n if n < 1024.0 => format!("{n:.0} B"),
        n if n < 1024.0 * 1024.0 => format!("{:.1} KiB", n / 1024.0),
        n if n < 1024.0 * 1024.0 * 1024.0 => format!("{:.1} MiB", n / (1024.0 * 1024.0)),
        n => format!("{:.2} GiB", n / (1024.0 * 1024.0 * 1024.0)),
    }
}

fn fmt_time(p: &PartResult) -> String {
    if p.answer.is_some() {
        fmt_duration(p.time)
    } else {
        "-".into()
    }
}

fn fmt_duration(d: Duration) -> String {
    let ns = d.as_nanos() as f64;
    match ns {
        n if n < 1e3 => format!("{n:.0} ns"),
        n if n < 1e6 => format!("{:.2} µs", n / 1e3),
        n if n < 1e9 => format!("{:.2} ms", n / 1e6),
        n => format!("{:.2} s", n / 1e9),
    }
}

// ---------------------------------------------------------------- README

const README_START: &str = "<!-- results:start -->";
const README_END: &str = "<!-- results:end -->";

fn write_readme(rows: &[Row]) -> Result<(), String> {
    let path = concat!(env!("CARGO_MANIFEST_DIR"), "/README.md");
    let readme = fs::read_to_string(path).map_err(|e| format!("reading README.md: {e}"))?;

    let mut table = String::from(
        "| Day | Part 1 time | Part 1 peak mem | Part 2 time | Part 2 peak mem |\n\
         |----:|------------:|----------------:|------------:|----------------:|\n",
    );
    for row in rows {
        let Some([p1, p2]) = &row.parts else { continue };
        table += &format!(
            "| [{d}](https://adventofcode.com/{YEAR}/day/{d}) | {} | {} | {} | {} |\n",
            fmt_time(p1),
            fmt_mem(p1),
            fmt_time(p2),
            fmt_mem(p2),
            d = row.day,
        );
    }
    table += &format!("| **Total** | | | **{}** | |\n", fmt_duration(total(rows)));
    let block = format!("{README_START}\n{table}{README_END}");

    let updated = match (readme.find(README_START), readme.find(README_END)) {
        (Some(s), Some(e)) if s < e => {
            format!("{}{block}{}", &readme[..s], &readme[e + README_END.len()..])
        }
        _ => format!("{}\n## Results\n\n{block}\n", readme.trim_end()),
    };
    fs::write(path, updated).map_err(|e| format!("writing README.md: {e}"))?;
    println!("\nUpdated README.md");
    Ok(())
}

// ---------------------------------------------------------------- fetch

/// Puzzles unlock at midnight EST (05:00 UTC). 2026-12-01T05:00:00Z:
const DAY1_UNLOCK: u64 = 1_796_101_200;

fn fetch(day: u32) -> Result<(), String> {
    let path = input_path(day);
    if path.exists() {
        println!("{} already exists, not re-downloading", path.display());
        return Ok(());
    }

    let unlock = DAY1_UNLOCK + u64::from(day - 1) * 86_400;
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    if now < unlock {
        let wait = unlock - now;
        return Err(format!(
            "day {day} unlocks in {}h {}m",
            wait / 3600,
            wait % 3600 / 60
        ));
    }

    let session = session_cookie()?;
    let user_agent = env::var("AOC_USER_AGENT")
        .unwrap_or_else(|_| "personal advent-of-code input fetcher (rust/ureq)".into());
    let url = format!("https://adventofcode.com/{YEAR}/day/{day}/input");
    let body = ureq::get(&url)
        .header("Cookie", &format!("session={session}"))
        .header("User-Agent", &user_agent)
        .call()
        .map_err(|e| format!("GET {url}: {e} (is the session cookie still valid?)"))?
        .body_mut()
        .read_to_string()
        .map_err(|e| format!("reading response: {e}"))?;

    fs::create_dir_all(path.parent().unwrap()).map_err(|e| e.to_string())?;
    fs::write(&path, body).map_err(|e| format!("writing {}: {e}", path.display()))?;
    println!("Saved {}", path.display());
    Ok(())
}

fn session_cookie() -> Result<String, String> {
    if let Ok(s) = env::var("AOC_SESSION") {
        return Ok(s.trim().to_string());
    }
    let path = concat!(env!("CARGO_MANIFEST_DIR"), "/.session");
    fs::read_to_string(path)
        .map(|s| s.trim().to_string())
        .map_err(|_| "set AOC_SESSION or put your session cookie in .session".to_string())
}
