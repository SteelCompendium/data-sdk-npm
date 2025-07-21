"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const model_1 = require("../../../model");
const xml_1 = require("../../../io/xml");
const io_1 = require("../../../io");
(0, globals_1.describe)("XmlAbilityWriter", () => {
    const writer = new xml_1.XmlAbilityWriter();
    const inputsDir = path_1.default.join(__dirname, "..", "..", "data", "ability", "dto-json");
    const outputsDir = path_1.default.join(__dirname, "..", "..", "data", "ability", "dto-xml");
    const jsonFiles = fs_1.default.readdirSync(inputsDir).filter(file => file.endsWith(".json"));
    const xmlFiles = fs_1.default.readdirSync(outputsDir).filter(file => file.endsWith(".xml"));
    const testFiles = jsonFiles.filter(file => xmlFiles.includes(file.replace('.json', '.xml')));
    testFiles.forEach(file => {
        (0, globals_1.it)(`should correctly write ${file}`, () => {
            const jsonReader = new io_1.JsonReader(model_1.Ability.modelDTOAdapter);
            const inputPath = path_1.default.join(inputsDir, file);
            const outputPath = path_1.default.join(outputsDir, file.replace(".json", ".xml"));
            const inputText = fs_1.default.readFileSync(inputPath, "utf-8");
            const expectedOutput = fs_1.default.readFileSync(outputPath, "utf-8");
            const ability = jsonReader.read(inputText);
            const result = writer.write(ability);
            (0, globals_1.expect)(result.trim()).toEqual(expectedOutput.trim());
        });
    });
});
//# sourceMappingURL=XmlAbilityWriter.test.js.map