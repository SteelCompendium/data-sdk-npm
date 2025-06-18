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
const Ability_1 = require("../../model/Ability");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml_1 = require("../../io/yaml");
const json_1 = require("../../io/json");
const json_2 = require("../../io/json");
const yaml_2 = require("../../io/yaml");
const testDataDir = path.join(__dirname, 'test-data', 'ability');
const inputDir = path.join(testDataDir, 'input');
const outputDir = path.join(testDataDir, 'output');
describe('Ability Data-Driven Tests', () => {
    const inputFiles = fs.readdirSync(inputDir);
    inputFiles.forEach(inputFile => {
        const inputFilePath = path.join(inputDir, inputFile);
        const fileExtension = path.extname(inputFile);
        const baseName = path.basename(inputFile, fileExtension);
        if (fileExtension === '.yaml' || fileExtension === '.yml') {
            test(`${baseName}.yaml to JSON`, () => {
                const inputYaml = fs.readFileSync(inputFilePath, 'utf8');
                const ability = Ability_1.Ability.read(new yaml_1.YamlReader(Ability_1.Ability.ModelDTOAdapter), inputYaml);
                const outputJson = new json_1.JsonWriter().write(ability);
                const expectedJsonPath = path.join(outputDir, `${baseName}.json`);
                const expectedJson = fs.readFileSync(expectedJsonPath, 'utf8');
                expect(JSON.parse(outputJson)).toEqual(JSON.parse(expectedJson));
            });
        }
        if (fileExtension === '.json') {
            test(`${baseName}.json to YAML`, () => {
                const inputJson = fs.readFileSync(inputFilePath, 'utf8');
                const ability = Ability_1.Ability.read(new json_2.JsonReader(Ability_1.Ability.ModelDTOAdapter), inputJson);
                const outputYaml = new yaml_2.YamlWriter().write(ability);
                const expectedYamlPath = path.join(outputDir, `${baseName}.yaml`);
                const expectedYaml = fs.readFileSync(expectedYamlPath, 'utf8');
                expect(outputYaml).toEqual(expectedYaml);
            });
        }
    });
});
//# sourceMappingURL=Ability.test.js.map