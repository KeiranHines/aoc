const std = @import("std");

pub fn build(b: *std.Build) !void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});
    var dir = try std.fs.cwd().openDir("src", .{ .iterate = true });
    defer dir.close();

    var iterator = dir.iterate();
    while (try iterator.next()) |file| {
        // Check if the file is a regular file and ends with ".zig"
        if (std.mem.endsWith(u8, file.name, ".zig")) {
            const file_path = std.fs.path.join(b.allocator, &[_][]const u8{ "src", file.name }) catch unreachable;
            var parts = std.mem.splitSequence(u8, file.name, ".");
            const name = parts.first();
            // Add the file as a source file to the executable
            const day = b.addExecutable(.{
                .name = name,
                .root_module = b.createModule(.{
                    .root_source_file = b.path(file_path),
                    .target = target,
                    .optimize = optimize,
                }),
            });
            // Install the client binary to the 'zig-out/bin' directory
            b.installArtifact(day);
        }
    }
}
