import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { MarkdownFeatureWriter } from "../../../io/markdown/MarkdownFeatureWriter";
import { Feature } from "../../../model";

describe("MarkdownFeatureWriter", () => {
    const writer = new MarkdownFeatureWriter();
    const inputsDir = path.join(__dirname, "..", "..", "data", "feature", "dto-json");
    const outputsDir = path.join(__dirname, "..", "..", "data", "feature", "sc-md");

    const jsonFiles = fs.readdirSync(inputsDir).filter(file => file.endsWith(".json"));
    const mdFiles = fs.readdirSync(outputsDir).filter(file => file.endsWith(".md"));
    const testFiles = jsonFiles.filter(file => mdFiles.includes(file.replace('.json', '.md')));

    testFiles.forEach(file => {
        it(`should correctly write markdown (using input ${file})`, () => {
            const inputPath = path.join(inputsDir, file);
            const outputPath = path.join(outputsDir, file.replace(".json", ".md"));

            const inputText = fs.readFileSync(inputPath, "utf-8");
            const expectedOutput = fs.readFileSync(outputPath, "utf-8");

            const feature = Feature.fromDTO(JSON.parse(inputText));
            const result = writer.write(feature);

            expect(result.trim()).toEqual(expectedOutput.trim());
        });
    });
}); 