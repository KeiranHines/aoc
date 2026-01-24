const std = @import("std");

fn read_input(allocator: std.mem.Allocator, file_path: []const u8) ![]const u8 {
    const file = try std.fs.cwd().openFile(file_path, .{});
    defer file.close(); // Ensure the file is closed when the function exits.

    // Get the file size to use as a maximum size for the buffer
    const stat = try file.stat();
    const file_contents = try file.readToEndAlloc(allocator, stat.size);

    return file_contents;
}

fn part_1(instructions: []const u8) i16 {
    var floor: i16 = 0;
    for (instructions) |char| {
        switch (char) {
            '(' => floor += 1,
            ')' => floor -= 1,
            else => {},
        }
    }
    return floor;
}

fn part_2(instructions: []const u8) i16 {
    var floor: i16 = 0;
    for (instructions, 1..) |char, i| {
        switch (char) {
            '(' => floor += 1,
            ')' => floor -= 1,
            else => {},
        }
        if (floor < 0) {
            return @intCast(i);
        }
    }
    return 0;
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

    std.debug.print("day 1\n", .{});
    const content = try read_input(allocator, file_path);
    var timer = try std.time.Timer.start();
    const part1 = part_1(content);
    const p1_ns = timer.read();
    timer = try std.time.Timer.start();
    const part2 = part_2(content);
    const p2_ns = timer.read();

    const t_ns = total.read();
    const p1_ms: f64 = @as(f64, @floatFromInt(p1_ns)) / @as(f64, std.time.ns_per_ms);
    const p2_ms: f64 = @as(f64, @floatFromInt(p2_ns)) / @as(f64, std.time.ns_per_ms);
    const t_ms: f64 = @as(f64, @floatFromInt(t_ns)) / @as(f64, std.time.ns_per_ms);

    std.debug.print("Part 1: {d} {d:.3}ms, Part 2: {d} {d:.3}ms | Total: {d:.3}ms\n", .{ part1, p1_ms, part2, p2_ms, t_ms });
}
