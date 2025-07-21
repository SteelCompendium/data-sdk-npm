"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const glob_1 = require("glob");
const json_1 = require("../../../io/json");
const yaml_1 = require("../../../io/yaml");
const model_1 = require("../../../model");
const yaml_2 = require("yaml");
const jsonTestPath = path_1.default.join(__dirname, '..', '..', 'data', 'statblock', 'dto-json');
const yamlTestPath = path_1.default.join(__dirname, '..', '..', 'data', 'statblock', 'dto-yaml');
describe('YamlWriter', () => {
    const files = glob_1.glob.sync('*.json', { cwd: jsonTestPath });
    test.each(files)('should correctly convert %s to YAML', (file) => {
        const jsonReader = new json_1.JsonReader(model_1.Statblock.modelDTOAdapter);
        const yamlWriter = new yaml_1.YamlWriter();
        const jsonFilePath = path_1.default.join(jsonTestPath, file);
        const yamlFilePath = path_1.default.join(yamlTestPath, file.replace('.json', '.yaml'));
        const jsonContent = fs_1.default.readFileSync(jsonFilePath, 'utf-8');
        const expectedYamlContent = fs_1.default.readFileSync(yamlFilePath, 'utf-8');
        const creature = jsonReader.read(jsonContent);
        const actualYamlContent = yamlWriter.write(creature);
        const actualObject = (0, yaml_2.parse)(actualYamlContent);
        const expectedObject = (0, yaml_2.parse)(expectedYamlContent);
        expect(actualObject).toEqual(expectedObject);
    });
});
//# sourceMappingURL=YamlStatblockWriter.spec.js.map