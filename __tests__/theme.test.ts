import { readFileSync } from "fs";
import { join } from "path";

describe("Theme stability", () => {
  const globalsCss = readFileSync(
    join(process.cwd(), "app", "globals.css"),
    "utf8"
  );

  it("uses a fixed dark background by default", () => {
    expect(globalsCss).toContain("--background: #030712;");
    expect(globalsCss).toContain("--foreground: #f3f4f6;");
  });

  it("does not switch background color based on system color scheme", () => {
    expect(globalsCss).not.toMatch(/prefers-color-scheme/);
  });
});
