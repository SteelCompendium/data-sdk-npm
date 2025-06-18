"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const JsonAdapter_1 = __importDefault(require("./JsonAdapter"));
const MarkdownAdapter_1 = __importDefault(require("./MarkdownAdapter"));
const jsonAdapter = new JsonAdapter_1.default();
const markdownAdapter = new MarkdownAdapter_1.default();
const inputsDir = path_1.default.join(__dirname, "../__tests__/data/markdown-adapter/inputs");
const outputsDir = path_1.default.join(__dirname, "../__tests__/data/markdown-adapter/outputs");
(0, globals_1.describe)("MarkdownAdapter", () => {
    const testFiles = fs_1.default.readdirSync(inputsDir).filter(file => file.endsWith(".json"));
    testFiles.forEach(file => {
        const inputFile = path_1.default.join(inputsDir, file);
        const outputFile = path_1.default.join(outputsDir, file.replace(".json", ".md"));
        if (fs_1.default.existsSync(outputFile)) {
            (0, globals_1.it)(`should correctly convert ${file} to markdown`, () => {
                const input = fs_1.default.readFileSync(inputFile, "utf-8");
                const expectedOutput = fs_1.default.readFileSync(outputFile, "utf-8");
                const statblock = jsonAdapter.parse(input);
                const actualOutput = markdownAdapter.format(statblock);
                (0, globals_1.expect)(actualOutput.trim()).toEqual(expectedOutput.trim());
            });
        }
        else {
            globals_1.it.skip(`should correctly convert ${file} to markdown (output file not found)`, () => {
                // This test is skipped because the output file does not exist.
            });
        }
    });
});
//# sourceMappingURL=MarkdownAdapter.test.js.map