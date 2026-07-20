import { describe, it, expect, jest, afterEach } from "@jest/globals";
import fs from "fs";
import path from "path";
import { MarkdownStatblockReader } from "../../../io/markdown/MarkdownStatblockReader";

// Builds a minimal but valid 5-column statblock whose organization/role cell
// (formerly "Roles") is `rolesCell`, so the reader's organization-vs-role split
// can be exercised in isolation.
function statblockWith(rolesCell: string): string {
    return [
        "###### TEST CREATURE",
        "",
        `| Goblin, Humanoid | - | Level 1 | ${rolesCell} | EV 3 |`,
        "|:---:|:---:|:---:|:---:|:---:|",
        "| **1S**<br>Size | **6**<br>Speed | **15**<br>Stamina | **0**<br>Stability | **1**<br>Free Strike |",
        "| **-**<br>Immunity | **climb**<br>Movement | - | **-**<br>With Captain | **-**<br>Weakness |",
        "| **-2**<br>Might | **+2**<br>Agility | **+0**<br>Reason | **+0**<br>Intuition | **-1**<br>Presence |",
        "",
    ].join("\n");
}

describe("MarkdownStatblockReader", () => {
    const reader = new MarkdownStatblockReader();
    const inputsDir = path.join(__dirname, "..", "..", "data", "statblock", "sc-md");
    const outputsDir = path.join(__dirname, "..", "..", "data", "statblock", "dto-json");

    if (!fs.existsSync(inputsDir)) {
        console.warn(`Skipping MarkdownStatblockReader tests: input directory not found at ${inputsDir}`);
        return;
    }

    if (!fs.existsSync(outputsDir)) {
        console.warn(`Skipping MarkdownStatblockReader tests: output directory not found at ${outputsDir}`);
        return;
    }

    const mdFiles = fs.readdirSync(inputsDir).filter(file => file.endsWith(".md"));
    const jsonFiles = fs.readdirSync(outputsDir).filter(file => file.endsWith(".json"));
    const testFiles = mdFiles.filter(file => jsonFiles.includes(file.replace('.md', '.json')));

    testFiles.forEach(file => {
        it(`should correctly read ${file} (validated wth json)`, () => {
            const inputPath = path.join(inputsDir, file);
            const outputPath = path.join(outputsDir, file.replace(".md", ".json"));

            const inputText = fs.readFileSync(inputPath, "utf-8");
            const expectedOutput = JSON.parse(fs.readFileSync(outputPath, "utf-8"));

            const result = reader.read(inputText).toDTO();

            expect(result).toEqual(expectedOutput);
        });
    });

    describe("organization / role split", () => {
        afterEach(() => { jest.restoreAllMocks(); });

        it("splits a two-token cell into a single organization and a single role", () => {
            const dto = reader.read(statblockWith("HORDE, HARRIER")).toDTO();
            expect(dto.organization).toBe("HORDE");
            expect(dto.role).toBe("HARRIER");
        });

        it("treats an organization-only cell (e.g. Solo) as the organization with an empty role", () => {
            const dto = reader.read(statblockWith("SOLO")).toDTO();
            expect(dto.organization).toBe("SOLO");
            expect(dto.role).toBe("");
        });

        it("leaves both empty for a '-' cell", () => {
            const dto = reader.read(statblockWith("-")).toDTO();
            expect(dto.organization).toBe("");
            expect(dto.role).toBe("");
        });

        it("warns and keeps the last role when a cell has multiple non-organization tokens", () => {
            const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
            const dto = reader.read(statblockWith("HORDE, HARRIER, AMBUSHER")).toDTO();
            expect(dto.organization).toBe("HORDE");
            expect(dto.role).toBe("AMBUSHER"); // last non-org token wins (unchanged behavior)
            expect(warn).toHaveBeenCalledTimes(1);
            expect(warn.mock.calls[0][0]).toContain("multiple");
            expect(warn.mock.calls[0][0]).toContain("HARRIER");
        });

        it("does not warn for a well-formed single-role cell", () => {
            const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
            reader.read(statblockWith("HORDE, HARRIER")).toDTO();
            expect(warn).not.toHaveBeenCalled();
        });
    });
}); 