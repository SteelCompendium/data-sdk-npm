"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const XmlAbilityReader_1 = require("../../../io/xml/XmlAbilityReader");
(0, globals_1.describe)("XmlAbilityReader", () => {
    const reader = new XmlAbilityReader_1.XmlAbilityReader();
    const inputsDir = path_1.default.join(__dirname, "..", "..", "data", "ability", "dto-xml");
    const outputsDir = path_1.default.join(__dirname, "..", "..", "data", "ability", "dto-json");
    const xmlFiles = fs_1.default.readdirSync(inputsDir).filter(file => file.endsWith(".xml"));
    const jsonFiles = fs_1.default.readdirSync(outputsDir).filter(file => file.endsWith(".json"));
    const testFiles = xmlFiles.filter(file => jsonFiles.includes(file.replace('.xml', '.json')));
    testFiles.forEach(file => {
        (0, globals_1.it)(`should correctly parse ${file}`, () => {
            const inputPath = path_1.default.join(inputsDir, file);
            const outputPath = path_1.default.join(outputsDir, file.replace(".xml", ".json"));
            const inputText = fs_1.default.readFileSync(inputPath, "utf-8");
            const expectedOutput = JSON.parse(fs_1.default.readFileSync(outputPath, "utf-8"));
            const result = reader.read(inputText).toDTO();
            (0, globals_1.expect)(result).toEqual(expectedOutput);
        });
    });
});
//# sourceMappingURL=XmlAbilityReader.test.js.map