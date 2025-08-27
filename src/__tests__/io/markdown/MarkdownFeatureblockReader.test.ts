import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { MarkdownFeatureblockReader } from "../../../io/markdown/MarkdownFeatureblockReader";

describe("MarkdownFeatureblockReader", () => {
    const reader = new MarkdownFeatureblockReader();
    const inputsDir = path.join(__dirname, "..", "..", "data", "featureblock", "sc_md");
    const outputsDir = path.join(__dirname, "..", "..", "data", "featureblock", "dto-json");

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