import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { MarkdownFeatureblockWriter } from "../../../io/markdown/MarkdownFeatureblockWriter";
import { Featureblock } from "../../../model";

describe("MarkdownFeatureblockWriter", () => {
    const writer = new MarkdownFeatureblockWriter();
    const inputsDir = path.join(__dirname, "..", "..", "data", "featureblock", "dto-json");
    const outputsDir = path.join(__dirname, "..", "..", "data", "featureblock", "sc_md");

    const jsonFiles = fs.readdirSync(inputsDir).filter(file => file.endsWith(".json"));
    const mdFiles = fs.readdirSync(outputsDir).filter(file => file.endsWith(".md"));
    const testFiles = jsonFiles.filter(file => mdFiles.includes(file.replace('.json', '.md')));

    testFiles.forEach(file => {
        it(`should correctly write markdown from source: ${file}`, () => {
            const inputPath = path.join(inputsDir, file);
            const outputPath = path.join(outputsDir, file.replace(".json", ".md"));

            const inputText = fs.readFileSync(inputPath, "utf-8");
            const expectedOutput = fs.readFileSync(outputPath, "utf-8");

            const featureblock = new Featureblock(JSON.parse(inputText));
            const result = writer.write(featureblock);

            expect(result.trim()).toEqual(expectedOutput.trim());
        });
    });
}); 