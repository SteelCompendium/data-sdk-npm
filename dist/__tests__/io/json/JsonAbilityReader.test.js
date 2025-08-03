"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const model_1 = require("../../../model");
const io_1 = require("../../../io");
const yaml_1 = require("yaml");
(0, globals_1.describe)("JsonAbilityReader", () => {
    const reader = new io_1.JsonReader(model_1.Ability.modelDTOAdapter);
    const inputsDir = path_1.default.join(__dirname, "..", "..", "data", "ability", "dto-json");
    const outputsDir = path_1.default.join(__dirname, "..", "..", "data", "ability", "dto-yaml");
    const yamlFiles = fs_1.default.readdirSync(inputsDir).filter(file => file.endsWith(".json"));
    const jsonFiles = fs_1.default.readdirSync(outputsDir).filter(file => file.endsWith(".yaml"));
    const testFiles = yamlFiles.filter(file => jsonFiles.includes(file.replace('.json', '.yaml')));
    testFiles.forEach(file => {
        (0, globals_1.it)(`should correctly parse ${file} (yaml validation)`, () => {
            const inputPath = path_1.default.join(inputsDir, file);
            const outputPath = path_1.default.join(outputsDir, file.replace(".json", ".yaml"));
            const inputText = fs_1.default.readFileSync(inputPath, "utf-8");
            const expectedOutput = (0, yaml_1.parse)(fs_1.default.readFileSync(outputPath, "utf-8"));
            const result = reader.read(inputText).toDTO();
            (0, globals_1.expect)(result).toEqual(expectedOutput);
        });
    });
});
//# sourceMappingURL=JsonAbilityReader.test.js.map