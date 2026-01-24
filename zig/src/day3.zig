const std = @import("std");
const House = struct { i16, i16 };
const HashSet = std.AutoHashMap(House, void); // Define a type alias for clarity

fn read_input(allocator: std.mem.Allocator, file_path: []const u8) ![]const u8 {
    const file = try std.fs.cwd().openFile(file_path, .{});
    defer file.close(); // Ensure the file is closed when the function exits.

    // Get the file size to use as a maximum size for the buffer
    const stat = try file.stat();
    const file_contents = try file.readToEndAlloc(allocator, stat.size);

    return file_contents;
}

fn part_1(content: []const u8) !u32 {
    var x: i16 = 0;
    var y: i16 = 0;
    // An allocator is required for dynamic memory management
    var houses = HashSet.init(std.heap.page_allocator);
    defer houses.deinit();

    try houses.put(.{ x, y }, {});
    for (content) |c| {
        switch (c) {
            '^' => y -= 1,
            'v' => y += 1,
            '<' => x -= 1,
            '>' => x += 1,
            else => {},
        }
        try houses.put(.{ x, y }, {});
    }

    return houses.count();
}

fn part_2(content: []const u8) !u32 {
    var santa: House = .{ 0, 0 };
    var robo: House = .{ 0, 0 };
    // An allocator is required for dynamic memory management
    var houses = HashSet.init(std.heap.page_allocator);
    defer houses.deinit();
    try houses.put(.{ 0, 0 }, {});

    var active = &santa;
    for (content, 0..) |c, i| {
        switch (c) {
            '^' => active.@"1" -= 1,
            'v' => active.@"1" += 1,
            '<' => active.@"0" -= 1,
            '>' => active.@"0" += 1,
            else => {},
        }
        try houses.put(.{ active.@"0", active.@"1" }, {});
        if (i % 2 == 0) {
            active = &robo;
        } else {
            active = &santa;
        }
    }

    return houses.count();
}

pub fn main() !void {
    // Start the timer
    var total = try std.time.Timer.start();

    var args = std.process.args();
    _ = args.skip();
    const file_path = args.next() orelse {
        std.debug.print("Requires file path to input as arg1\n", .{});
        return;
    };
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();

    const allocator = arena.allocator();

    std.debug.print("day 3\n", .{});
    const content = try read_input(allocator, file_path);
    var timer = try std.time.Timer.start();
    const part1 = try part_1(content);
    const p1_ns = timer.read();
    timer = try std.time.Timer.start();
    const part2 = try part_2(content);
    const p2_ns = timer.read();

    const t_ns = total.read();
    const p1_ms: f64 = @as(f64, @floatFromInt(p1_ns)) / @as(f64, std.time.ns_per_ms);
    const p2_ms: f64 = @as(f64, @floatFromInt(p2_ns)) / @as(f64, std.time.ns_per_ms);
    const t_ms: f64 = @as(f64, @floatFromInt(t_ns)) / @as(f64, std.time.ns_per_ms);

    std.debug.print("Part 1: {d} {d:.3}ms, Part 2: {d} {d:.3}ms | Total: {d:.3}ms\n", .{ part1, p1_ms, part2, p2_ms, t_ms });
}
