import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import {Feature, Statblock} from "../../../model";
import {JsonReader, JsonWriter, YamlReader} from "../../../io";

describe("JsonFeatureWriter", () => {
    const writer = new JsonWriter();
    const inputsDir = path.join(__dirname, "..", "..", "data", "feature", "dto-yaml");
    const outputsDir = path.join(__dirname, "..", "..", "data", "feature", "dto-json");

    const yamlFiles = fs.readdirSync(inputsDir).filter(file => file.endsWith(".yaml"));
    const jsonFiles = fs.readdirSync(outputsDir).filter(file => file.endsWith(".json"));
    const testFiles = yamlFiles.filter(file => jsonFiles.includes(file.replace('.yaml', '.json')));

    testFiles.forEach(file => {
        it(`should correctly write ${file} (json validation)`, () => {
            const yamlReader = new YamlReader(Feature.modelDTOAdapter);
            const inputPath = path.join(inputsDir, file);
            const outputPath = path.join(outputsDir, file.replace(".yaml", ".json"));

            const inputText = fs.readFileSync(inputPath, "utf-8");
            const expectedOutput = fs.readFileSync(outputPath, "utf-8");

            const feature = yamlReader.read(inputText);
            const result = writer.write(feature);

            expect(JSON.parse(result)).toEqual(JSON.parse(expectedOutput));
        });
    });
}); 