"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const validator_1 = __importDefault(require("./validator"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
(0, globals_1.describe)("JSONValidator", () => {
    const dataDir = path_1.default.resolve(__dirname, "../__tests__/data/draw-steel-adapter/outputs");
    const filenames = fs_1.default.readdirSync(dataDir).filter(file => file.endsWith(".json"));
    filenames.forEach(filename => {
        (0, globals_1.test)(`should validate ${filename} successfully`, () => __awaiter(void 0, void 0, void 0, function* () {
            const filePath = path_1.default.join(dataDir, filename);
            const jsonString = fs_1.default.readFileSync(filePath, "utf-8");
            const result = yield validator_1.default.validateJSON(jsonString);
            if (!result.valid) {
                const formattedErrors = validator_1.default.formatErrors(result.errors || []);
                throw new Error(`Validation failed for ${filename}:\n${formattedErrors}`);
            }
            (0, globals_1.expect)(result.valid).toBe(true);
        }));
    });
});
//# sourceMappingURL=validator.test.js.map