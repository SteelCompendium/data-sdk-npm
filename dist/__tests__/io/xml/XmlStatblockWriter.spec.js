"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const glob_1 = require("glob");
const json_1 = require("../../../io/json");
const xml_1 = require("../../../io/xml");
const model_1 = require("../../../model");
const fast_xml_parser_1 = require("fast-xml-parser");
const jsonTestPath = path_1.default.join(__dirname, '..', '..', 'data', 'statblock', 'dto-json');
const xmlTestPath = path_1.default.join(__dirname, '..', '..', 'data', 'statblock', 'dto-xml');
describe('XmlStatblockWriter', () => {
    const files = glob_1.glob.sync('*.json', { cwd: jsonTestPath });
    test.each(files)('should correctly convert %s to XML', (file) => {
        const jsonReader = new json_1.JsonReader(model_1.Statblock.modelDTOAdapter);
        const xmlWriter = new xml_1.XmlWriter('statblock');
        const jsonFilePath = path_1.default.join(jsonTestPath, file);
        const xmlFilePath = path_1.default.join(xmlTestPath, file.replace('.json', '.xml'));
        const jsonContent = fs_1.default.readFileSync(jsonFilePath, 'utf-8');
        const expectedXmlContent = fs_1.default.readFileSync(xmlFilePath, 'utf-8');
        const creature = jsonReader.read(jsonContent);
        const actualXmlContent = xmlWriter.write(creature);
        const parser = new fast_xml_parser_1.XMLParser();
        const actualObject = parser.parse(actualXmlContent);
        const expectedObject = parser.parse(expectedXmlContent);
        expect(actualObject).toEqual(expectedObject);
    });
});
//# sourceMappingURL=XmlStatblockWriter.spec.js.map