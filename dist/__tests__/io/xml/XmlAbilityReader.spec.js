"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const glob_1 = require("glob");
const xml_1 = require("../../../io/xml");
const model_1 = require("../../../model");
const xmlTestPath = path_1.default.join(__dirname, '..', '..', 'data', 'ability', 'dto-xml');
const jsonTestPath = path_1.default.join(__dirname, '..', '..', 'data', 'ability', 'dto-json');
describe('XmlAbilityReader', () => {
    const files = glob_1.glob.sync('*.xml', { cwd: xmlTestPath });
    test.each(files)('should correctly read %s and convert to JSON', (file) => {
        const xmlReader = new xml_1.XmlReader(model_1.Ability.modelDTOAdapter);
        const xmlFilePath = path_1.default.join(xmlTestPath, file);
        const jsonFilePath = path_1.default.join(jsonTestPath, file.replace('.xml', '.json'));
        const xmlContent = fs_1.default.readFileSync(xmlFilePath, 'utf-8');
        const jsonContent = fs_1.default.readFileSync(jsonFilePath, 'utf-8');
        const creature = xmlReader.read(xmlContent);
        const actualJson = creature.toDTO();
        const expectedJson = JSON.parse(jsonContent);
        expect(actualJson).toEqual(expectedJson);
    });
});
//# sourceMappingURL=XmlAbilityReader.spec.js.map