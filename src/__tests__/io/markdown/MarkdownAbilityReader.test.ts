import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { MarkdownAbilityReader } from "../../../io/markdown/MarkdownAbilityReader";

describe("MarkdownAbilityReader", () => {
    const reader = new MarkdownAbilityReader();
    const inputsDir = path.join(__dirname, "..", "..", "data", "ability", "sc_md");
    const outputsDir = path.join(__dirname, "..", "..", "data", "ability", "dto-json");

    const mdFiles = fs.readdirSync(inputsDir).filter(file => file.endsWith(".md"));
    const jsonFiles = fs.readdirSync(outputsDir).filter(file => file.endsWith(".json"));
    const testFiles = mdFiles.filter(file => jsonFiles.includes(file.replace('.md', '.json')));

    testFiles.forEach(file => {
        it(`should correctly parse ${file}`, () => {
            const inputPath = path.join(inputsDir, file);
            const outputPath = path.join(outputsDir, file.replace(".md", ".json"));

            const inputText = fs.readFileSync(inputPath, "utf-8");
            const expectedOutput = JSON.parse(fs.readFileSync(outputPath, "utf-8"));

            const result = reader.read(inputText).toDTO();

            expect(result).toEqual(expectedOutput);
        });
    });
}); 