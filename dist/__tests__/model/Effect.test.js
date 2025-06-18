"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml_1 = require("yaml");
const Effects_1 = require("../../model/Effects");
const Effects_2 = require("../../model/Effects");
const testDataDir = path.join(__dirname, 'test-data', 'effect');
const effectTypes = fs.readdirSync(testDataDir);
describe('Effect Data-Driven Tests', () => {
    effectTypes.forEach(effectType => {
        const effectTestDataDir = path.join(testDataDir, effectType);
        const inputDir = path.join(effectTestDataDir, 'input');
        const outputDir = path.join(effectTestDataDir, 'output');
        if (!fs.existsSync(inputDir) || !fs.existsSync(outputDir)) {
            return;
        }
        describe(effectType, () => {
            const inputFiles = fs.readdirSync(inputDir);
            inputFiles.forEach(inputFile => {
                const inputFilePath = path.join(inputDir, inputFile);
                const fileExtension = path.extname(inputFile);
                const baseName = path.basename(inputFile, fileExtension);
                if (fileExtension === '.yaml' || fileExtension === '.yml') {
                    test(`${baseName}.yaml to JSON`, () => {
                        const inputYaml = fs.readFileSync(inputFilePath, 'utf8');
                        const parsed = (0, yaml_1.parse)(inputYaml);
                        const effects = Array.isArray(parsed) ? Effects_1.Effects.fromDTO(parsed).effects : [(0, Effects_2.effectFromDTO)(parsed)];
                        const dtos = effects.map(e => e.toDTO());
                        const outputJson = JSON.stringify(dtos.length > 1 ? dtos : dtos[0], null, 2);
                        const expectedJsonPath = path.join(outputDir, `${baseName}.json`);
                        const expectedJson = fs.readFileSync(expectedJsonPath, 'utf8');
                        expect(JSON.parse(outputJson)).toEqual(JSON.parse(expectedJson));
                    });
                }
                if (fileExtension === '.json') {
                    test(`${baseName}.json to YAML`, () => {
                        const inputJson = fs.readFileSync(inputFilePath, 'utf8');
                        const parsed = JSON.parse(inputJson);
                        const effects = Array.isArray(parsed) ? Effects_1.Effects.fromDTO(parsed).effects : [(0, Effects_2.effectFromDTO)(parsed)];
                        const dtos = effects.map(e => e.toDTO());
                        const outputYaml = (0, yaml_1.parse)(JSON.stringify(dtos.length > 1 ? dtos : dtos[0]));
                        const expectedYamlPath = path.join(outputDir, `${baseName}.yaml`);
                        const expectedYaml = fs.readFileSync(expectedYamlPath, 'utf8');
                        expect(outputYaml).toEqual((0, yaml_1.parse)(expectedYaml));
                    });
                }
            });
        });
    });
});
//# sourceMappingURL=Effect.test.js.map