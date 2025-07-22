import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import {Ability} from "../../../model";
import {JsonReader} from "../../../io";
import { parse } from 'yaml';

describe("JsonAbilityReader", () => {
    const reader = new JsonReader(Ability.modelDTOAdapter);
    const inputsDir = path.join(__dirname, "..", "..", "data", "ability", "dto-json");
    const outputsDir = path.join(__dirname, "..", "..", "data", "ability", "dto-yaml");

    const yamlFiles = fs.readdirSync(inputsDir).filter(file => file.endsWith(".json"));
    const jsonFiles = fs.readdirSync(outputsDir).filter(file => file.endsWith(".yaml"));
    const testFiles = yamlFiles.filter(file => jsonFiles.includes(file.replace('.json', '.yaml')));

    testFiles.forEach(file => {
        it(`should correctly parse ${file} (yaml validation)`, () => {
            const inputPath = path.join(inputsDir, file);
            const outputPath = path.join(outputsDir, file.replace(".json", ".yaml"));

            const inputText = fs.readFileSync(inputPath, "utf-8");
            const expectedOutput = parse(fs.readFileSync(outputPath, "utf-8"));

            const result = reader.read(inputText).toDTO();

            expect(result).toEqual(expectedOutput);
        });
    });
}); 