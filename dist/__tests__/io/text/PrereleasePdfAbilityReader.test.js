"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const PrereleasePdfAbilityReader_1 = require("../../../io/text/PrereleasePdfAbilityReader");
(0, globals_1.describe)("PrereleasePdfAbilityReader", () => {
    const adapter = new PrereleasePdfAbilityReader_1.PrereleasePdfAbilityReader();
    const inputsDir = path_1.default.join(__dirname, "..", "..", "data", "ability", "prerelease-pdf");
    const outputsDir = path_1.default.join(__dirname, "..", "..", "data", "ability", "dto-json");
    const testFiles = fs_1.default.readdirSync(inputsDir).filter(file => file.endsWith(".txt"));
    testFiles.forEach(file => {
        (0, globals_1.it)(`should correctly parse ${file}`, () => {
            const inputPath = path_1.default.join(inputsDir, file);
            const outputPath = path_1.default.join(outputsDir, file.replace(".txt", ".json"));
            const inputText = fs_1.default.readFileSync(inputPath, "utf-8");
            const expectedOutput = JSON.parse(fs_1.default.readFileSync(outputPath, "utf-8"));
            const result = adapter.read(inputText).toDTO();
            (0, globals_1.expect)(result).toEqual(expectedOutput);
        });
    });
});
//# sourceMappingURL=PrereleasePdfAbilityReader.test.js.map