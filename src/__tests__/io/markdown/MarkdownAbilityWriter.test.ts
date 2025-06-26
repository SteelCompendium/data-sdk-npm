import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { MarkdownAbilityWriter } from "../../../io/markdown/MarkdownAbilityWriter";
import { Ability } from "../../../model";

describe("MarkdownAbilityWriter", () => {
    const writer = new MarkdownAbilityWriter();
    const inputsDir = path.join(__dirname, "..", "..", "data", "ability", "dto-json");
    const outputsDir = path.join(__dirname, "..", "..", "data", "ability", "sc_md");

    const jsonFiles = fs.readdirSync(inputsDir).filter(file => file.endsWith(".json"));
    const mdFiles = fs.readdirSync(outputsDir).filter(file => file.endsWith(".md"));
    const testFiles = jsonFiles.filter(file => mdFiles.includes(file.replace('.json', '.md')));

    testFiles.forEach(file => {
        it(`should correctly write ${file}`, () => {
            const inputPath = path.join(inputsDir, file);
            const outputPath = path.join(outputsDir, file.replace(".json", ".md"));

            const inputText = fs.readFileSync(inputPath, "utf-8");
            const expectedOutput = fs.readFileSync(outputPath, "utf-8");

            const ability = new Ability(JSON.parse(inputText));
            const result = writer.write(ability);

            expect(result.trim()).toEqual(expectedOutput.trim());
        });
    });
}); 