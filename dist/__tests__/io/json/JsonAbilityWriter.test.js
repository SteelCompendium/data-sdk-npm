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
(0, globals_1.describe)("JsonAbilityWriter", () => {
    const writer = new io_1.JsonWriter();
    const inputsDir = path_1.default.join(__dirname, "..", "..", "data", "ability", "dto-yaml");
    const outputsDir = path_1.default.join(__dirname, "..", "..", "data", "ability", "dto-json");
    const yamlFiles = fs_1.default.readdirSync(inputsDir).filter(file => file.endsWith(".yaml"));
    const jsonFiles = fs_1.default.readdirSync(outputsDir).filter(file => file.endsWith(".json"));
    const testFiles = yamlFiles.filter(file => jsonFiles.includes(file.replace('.yaml', '.json')));
    testFiles.forEach(file => {
        (0, globals_1.it)(`should correctly write ${file} (json validation)`, () => {
            const yamlReader = new io_1.YamlReader(model_1.Ability.modelDTOAdapter);
            const inputPath = path_1.default.join(inputsDir, file);
            const outputPath = path_1.default.join(outputsDir, file.replace(".yaml", ".json"));
            const inputText = fs_1.default.readFileSync(inputPath, "utf-8");
            const expectedOutput = fs_1.default.readFileSync(outputPath, "utf-8");
            const ability = yamlReader.read(inputText);
            const result = writer.write(ability);
            (0, globals_1.expect)(JSON.parse(result)).toEqual(JSON.parse(expectedOutput));
        });
    });
});
//# sourceMappingURL=JsonAbilityWriter.test.js.map