import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { MarkdownStatblockReader } from "../../../io/markdown/MarkdownStatblockReader";

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
}); 