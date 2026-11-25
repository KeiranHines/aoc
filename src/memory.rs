//! A global allocator that wraps the system one and counts heap usage, so the
//! runner can report peak memory and allocation counts per part.
//!
//! Only heap allocations are seen: stack usage (arrays, recursion) is not.
//! The bookkeeping is a few relaxed atomic ops per allocation, which is small
//! but nonzero; criterion benches use the plain system allocator.

use std::alloc::{GlobalAlloc, Layout, System};
use std::sync::atomic::{AtomicUsize, Ordering::Relaxed};

pub struct Counting;

static CURRENT: AtomicUsize = AtomicUsize::new(0);
static PEAK: AtomicUsize = AtomicUsize::new(0);
static ALLOCS: AtomicUsize = AtomicUsize::new(0);

fn grow(bytes: usize) {
    let now = CURRENT.fetch_add(bytes, Relaxed) + bytes;
    PEAK.fetch_max(now, Relaxed);
}

unsafe impl GlobalAlloc for Counting {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        let ptr = unsafe { System.alloc(layout) };
        if !ptr.is_null() {
            ALLOCS.fetch_add(1, Relaxed);
            grow(layout.size());
        }
        ptr
    }

    unsafe fn alloc_zeroed(&self, layout: Layout) -> *mut u8 {
        let ptr = unsafe { System.alloc_zeroed(layout) };
        if !ptr.is_null() {
            ALLOCS.fetch_add(1, Relaxed);
            grow(layout.size());
        }
        ptr
    }

    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        unsafe { System.dealloc(ptr, layout) };
        CURRENT.fetch_sub(layout.size(), Relaxed);
    }

    unsafe fn realloc(&self, ptr: *mut u8, layout: Layout, new_size: usize) -> *mut u8 {
        let new = unsafe { System.realloc(ptr, layout, new_size) };
        if !new.is_null() {
            ALLOCS.fetch_add(1, Relaxed);
            if new_size > layout.size() {
                grow(new_size - layout.size());
            } else {
                CURRENT.fetch_sub(layout.size() - new_size, Relaxed);
            }
        }
        new
    }
}

#[derive(Clone, Copy, Default)]
pub struct Usage {
    /// Highest heap usage above what was already allocated when `f` started.
    pub peak_bytes: usize,
    /// Number of allocations and reallocations made by `f`.
    pub allocs: usize,
}

/// Runs `f` and reports the heap it used. Single-threaded use only: work on
/// other threads at the same time would be counted too.
pub fn track<R>(f: impl FnOnce() -> R) -> (R, Usage) {
    let base = CURRENT.load(Relaxed);
    PEAK.store(base, Relaxed);
    let allocs = ALLOCS.load(Relaxed);
    let result = f();
    let usage = Usage {
        peak_bytes: PEAK.load(Relaxed) - base,
        allocs: ALLOCS.load(Relaxed) - allocs,
    };
    (result, usage)
}
