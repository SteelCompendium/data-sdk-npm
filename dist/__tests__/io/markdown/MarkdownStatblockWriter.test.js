"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const MarkdownStatblockWriter_1 = require("../../../io/markdown/MarkdownStatblockWriter");
const model_1 = require("../../../model");
(0, globals_1.describe)("MarkdownStatblockWriter", () => {
    const writer = new MarkdownStatblockWriter_1.MarkdownStatblockWriter();
    const inputsDir = path_1.default.join(__dirname, "..", "..", "data", "statblock", "dto-json");
    const outputsDir = path_1.default.join(__dirname, "..", "..", "data", "statblock", "sc-md");
    const jsonFiles = fs_1.default.readdirSync(inputsDir).filter(file => file.endsWith(".json"));
    const mdFiles = fs_1.default.readdirSync(outputsDir).filter(file => file.endsWith(".md"));
    const testFiles = jsonFiles.filter(file => mdFiles.includes(file.replace('.json', '.md')));
    testFiles.forEach(file => {
        (0, globals_1.it)(`should correctly write ${file}`, () => {
            const inputPath = path_1.default.join(inputsDir, file);
            const outputPath = path_1.default.join(outputsDir, file.replace(".json", ".md"));
            const inputText = fs_1.default.readFileSync(inputPath, "utf-8");
            const expectedOutput = fs_1.default.readFileSync(outputPath, "utf-8");
            const statblock = model_1.Statblock.fromDTO(JSON.parse(inputText));
            const result = writer.write(statblock);
            (0, globals_1.expect)(result.trim()).toEqual(expectedOutput.trim());
        });
    });
});
//# sourceMappingURL=MarkdownStatblockWriter.test.js.map