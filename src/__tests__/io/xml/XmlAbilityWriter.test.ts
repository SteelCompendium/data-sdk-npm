import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import {Ability, Statblock} from "../../../model";
import {XmlAbilityWriter} from "../../../io/xml";
import {JsonReader} from "../../../io";

describe("XmlAbilityWriter", () => {
    const writer = new XmlAbilityWriter();
    const inputsDir = path.join(__dirname, "..", "..", "data", "ability", "dto-json");
    const outputsDir = path.join(__dirname, "..", "..", "data", "ability", "dto-xml");

    const jsonFiles = fs.readdirSync(inputsDir).filter(file => file.endsWith(".json"));
    const xmlFiles = fs.readdirSync(outputsDir).filter(file => file.endsWith(".xml"));
    const testFiles = jsonFiles.filter(file => xmlFiles.includes(file.replace('.json', '.xml')));

    testFiles.forEach(file => {
        it(`should correctly write ${file}`, () => {
            const jsonReader = new JsonReader(Ability.modelDTOAdapter);
            const inputPath = path.join(inputsDir, file);
            const outputPath = path.join(outputsDir, file.replace(".json", ".xml"));

            const inputText = fs.readFileSync(inputPath, "utf-8");
            const expectedOutput = fs.readFileSync(outputPath, "utf-8");

            const ability = jsonReader.read(inputText);
            const result = writer.write(ability);

            expect(result.trim()).toEqual(expectedOutput.trim());
        });
    });
}); 