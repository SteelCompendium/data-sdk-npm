import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { XmlAbilityReader } from "../../../io/xml/XmlAbilityReader";

describe("XmlAbilityReader", () => {
    const reader = new XmlAbilityReader();
    const inputsDir = path.join(__dirname, "..", "..", "data", "ability", "dto-xml");
    const outputsDir = path.join(__dirname, "..", "..", "data", "ability", "dto-json");

    const xmlFiles = fs.readdirSync(inputsDir).filter(file => file.endsWith(".xml"));
    const jsonFiles = fs.readdirSync(outputsDir).filter(file => file.endsWith(".json"));
    const testFiles = xmlFiles.filter(file => jsonFiles.includes(file.replace('.xml', '.json')));

    testFiles.forEach(file => {
        it(`should correctly parse ${file}`, () => {
            const inputPath = path.join(inputsDir, file);
            const outputPath = path.join(outputsDir, file.replace(".xml", ".json"));

            const inputText = fs.readFileSync(inputPath, "utf-8");
            const expectedOutput = JSON.parse(fs.readFileSync(outputPath, "utf-8"));

            const result = reader.read(inputText).toDTO();

            expect(result).toEqual(expectedOutput);
        });
    });
}); 