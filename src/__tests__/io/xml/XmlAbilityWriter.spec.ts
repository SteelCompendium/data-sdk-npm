import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import { JsonReader } from '../../../io/json';
import { XmlWriter } from '../../../io/xml';
import { Statblock } from '../../../model';
import { XMLParser } from 'fast-xml-parser';

const jsonTestPath = path.join(__dirname, '..', '..', 'data', 'ability', 'dto-json');
const xmlTestPath = path.join(__dirname, '..', '..', 'data', 'ability', 'dto-xml');

describe('XmlAbilityWriter', () => {
    const files = glob.sync('*.json', { cwd: jsonTestPath });

    test.each(files)('should correctly convert %s to XML', (file) => {
        const jsonReader = new JsonReader(Statblock.modelDTOAdapter);
        const xmlWriter = new XmlWriter('ability');

        const jsonFilePath = path.join(jsonTestPath, file);
        const xmlFilePath = path.join(xmlTestPath, file.replace('.json', '.xml'));

        const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
        const expectedXmlContent = fs.readFileSync(xmlFilePath, 'utf-8');

        const creature = jsonReader.read(jsonContent);
        const actualXmlContent = xmlWriter.write(creature);

        const parser = new XMLParser();
        const actualObject = parser.parse(actualXmlContent);
        const expectedObject = parser.parse(expectedXmlContent);

        expect(actualObject).toEqual(expectedObject);
    });
}); 