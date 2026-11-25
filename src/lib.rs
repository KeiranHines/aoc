//! Shared plumbing for the Advent of Code 2026 solutions.
//!
//! Each day lives in `src/days/dayNN.rs` and exposes `part1` / `part2`
//! taking `&str` and returning anything that implements `Display`.
//! Return [`Unsolved`] from a part you haven't done yet; the runner and
//! benches skip it.

use std::any::TypeId;
use std::fmt::{self, Display};
use std::path::PathBuf;

pub mod days;

pub const YEAR: u32 = 2026;
pub const DAYS: u32 = 12;

/// Placeholder answer for a part that hasn't been solved yet.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Unsolved;

impl Display for Unsolved {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str("unsolved")
    }
}

/// Type-erased part function.
pub type Part = fn(&str) -> String;

pub struct Day {
    pub day: u32,
    /// `None` while the part still returns [`Unsolved`].
    pub part1: Option<Part>,
    pub part2: Option<Part>,
}

impl Day {
    pub fn name(&self) -> String {
        format!("day{:02}", self.day)
    }

    pub fn input_path(&self) -> PathBuf {
        input_path(self.day)
    }

    pub fn input(&self) -> Option<String> {
        std::fs::read_to_string(self.input_path()).ok()
    }
}

pub fn input_path(day: u32) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("inputs")
        .join(format!("day{day:02}.txt"))
}

/// `None` if `f` returns [`Unsolved`], judged by its type so nothing is run.
pub fn solved<T: 'static>(_f: fn(&str) -> T, erased: Part) -> Option<Part> {
    (TypeId::of::<T>() != TypeId::of::<Unsolved>()).then_some(erased)
}

/// Builds the registry of days. Each name must be a module in `days`.
#[macro_export]
macro_rules! register {
    ($($day:ident = $n:literal),* $(,)?) => {
        $(pub mod $day;)*

        pub fn all() -> Vec<$crate::Day> {
            vec![$($crate::Day {
                day: $n,
                part1: $crate::solved($day::part1, |i| $day::part1(i).to_string()),
                part2: $crate::solved($day::part2, |i| $day::part2(i).to_string()),
            },)*]
        }
    };
}

pub fn get(day: u32) -> Option<Day> {
    days::all().into_iter().find(|d| d.day == day)
}
