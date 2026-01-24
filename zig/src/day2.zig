const std = @import("std");

fn read_input(allocator: std.mem.Allocator, file_path: []const u8) ![]const u8 {
    const file = try std.fs.cwd().openFile(file_path, .{});
    defer file.close(); // Ensure the file is closed when the function exits.

    // Get the file size to use as a maximum size for the buffer
    const stat = try file.stat();
    const file_contents = try file.readToEndAlloc(allocator, stat.size);

    return file_contents;
}

fn part_1(instructions: []const u8) !u32 {
    var lines = std.mem.splitSequence(u8, instructions, "\n");
    var total: u32 = 0;
    while (lines.next()) |line| {
        if (line.len == 0) {
            continue;
        }
        var parts = std.mem.splitSequence(u8, line, "x");
        const l = try std.fmt.parseInt(u16, parts.next().?, 10);
        const w = try std.fmt.parseInt(u16, parts.next().?, 10);
        const h = try std.fmt.parseInt(u16, parts.next().?, 10);

        const a1 = l * w;
        const a2 = l * h;
        const a3 = w * h;
        total += 2 * a1 + 2 * a2 + 2 * a3 + @min(a1, @min(a2, a3));
    }
    return total;
}

fn part_2(instructions: []const u8) !u32 {
    var lines = std.mem.splitSequence(u8, instructions, "\n");
    var total: u32 = 0;
    while (lines.next()) |line| {
        if (line.len == 0) {
            continue;
        }
        var m1: u32 = std.math.maxInt(u32);
        var m2: u32 = std.math.maxInt(u32);
        var t: u32 = 1;
        var parts = std.mem.splitSequence(u8, line, "x");
        while (parts.next()) |p| {
            const d = try std.fmt.parseInt(u16, p, 10);
            if (d < m2) {
                m2 = d;
            }
            if (d < m1) {
                m2 = m1;
                m1 = d;
            }
            t *= d;
        }

        total += 2 * m1 + 2 * m2 + t;
    }
    return total;
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

    std.debug.print("day 2\n", .{});
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
