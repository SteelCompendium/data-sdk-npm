"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const glob_1 = require("glob");
const yaml_1 = require("../../../io/yaml");
const model_1 = require("../../../model");
const yamlTestPath = path_1.default.join(__dirname, '..', '..', 'data', 'statblock', 'dto-yaml');
const jsonTestPath = path_1.default.join(__dirname, '..', '..', 'data', 'statblock', 'dto-json');
describe('YamlReader', () => {
    const files = glob_1.glob.sync('*.yaml', { cwd: yamlTestPath });
    test.each(files)('should correctly read %s and convert to JSON', (file) => {
        const yamlReader = new yaml_1.YamlReader(model_1.Statblock.modelDTOAdapter);
        const yamlFilePath = path_1.default.join(yamlTestPath, file);
        const jsonFilePath = path_1.default.join(jsonTestPath, file.replace('.yaml', '.json'));
        const yamlContent = fs_1.default.readFileSync(yamlFilePath, 'utf-8');
        const jsonContent = fs_1.default.readFileSync(jsonFilePath, 'utf-8');
        const creature = yamlReader.read(yamlContent);
        const actualJson = creature.toDTO();
        const expectedJson = JSON.parse(jsonContent);
        expect(actualJson).toEqual(expectedJson);
    });
});
//# sourceMappingURL=YamlStatblockReader.spec.js.map