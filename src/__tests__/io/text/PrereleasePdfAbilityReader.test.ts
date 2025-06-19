import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { PrereleasePdfAbilityReader } from "../../../io/text/PrereleasePdfAbilityReader";

describe("PrereleasePdfAbilityReader", () => {
    const reader = new PrereleasePdfAbilityReader();
    const inputsDir = path.join(__dirname, "..", "..", "data", "ability", "prerelease-pdf");

    const testFiles = fs.readdirSync(inputsDir).filter(file => file.endsWith(".txt"));

    testFiles.forEach(file => {
        it(`should correctly parse ${file}`, () => {
            const inputPath = path.join(inputsDir, file);
            const inputText = fs.readFileSync(inputPath, "utf-8");
            const result = reader.read(inputText).toDTO();
            expect(result).toMatchSnapshot();
        });
    });
}); 