"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const MarkdownAbilityReader_1 = require("../../../io/markdown/MarkdownAbilityReader");
(0, globals_1.describe)("MarkdownAbilityReader", () => {
    const reader = new MarkdownAbilityReader_1.MarkdownAbilityReader();
    const inputsDir = path_1.default.join(__dirname, "..", "..", "data", "ability", "sc_md");
    const outputsDir = path_1.default.join(__dirname, "..", "..", "data", "ability", "dto-json");
    const mdFiles = fs_1.default.readdirSync(inputsDir).filter(file => file.endsWith(".md"));
    const jsonFiles = fs_1.default.readdirSync(outputsDir).filter(file => file.endsWith(".json"));
    const testFiles = mdFiles.filter(file => jsonFiles.includes(file.replace('.md', '.json')));
    testFiles.forEach(file => {
        (0, globals_1.it)(`should correctly parse ${file}`, () => {
            const inputPath = path_1.default.join(inputsDir, file);
            const outputPath = path_1.default.join(outputsDir, file.replace(".md", ".json"));
            const inputText = fs_1.default.readFileSync(inputPath, "utf-8");
            const expectedOutput = JSON.parse(fs_1.default.readFileSync(outputPath, "utf-8"));
            const result = reader.read(inputText).toDTO();
            (0, globals_1.expect)(result).toEqual(expectedOutput);
        });
    });
});
//# sourceMappingURL=MarkdownAbilityReader.test.js.map