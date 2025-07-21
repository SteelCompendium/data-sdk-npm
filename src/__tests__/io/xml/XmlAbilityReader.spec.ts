import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import { XmlReader } from '../../../io/xml';
import {Ability, Statblock} from '../../../model';

const xmlTestPath = path.join(__dirname, '..', '..', 'data', 'ability', 'dto-xml');
const jsonTestPath = path.join(__dirname, '..', '..', 'data', 'ability', 'dto-json');

describe('XmlAbilityReader', () => {
    const files = glob.sync('*.xml', { cwd: xmlTestPath });

    test.each(files)('should correctly read %s and convert to JSON', (file) => {
        const xmlReader = new XmlReader(Ability.modelDTOAdapter);

        const xmlFilePath = path.join(xmlTestPath, file);
        const jsonFilePath = path.join(jsonTestPath, file.replace('.xml', '.json'));

        const xmlContent = fs.readFileSync(xmlFilePath, 'utf-8');
        const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');

        const creature = xmlReader.read(xmlContent);
        const actualJson = creature.toDTO();

        const expectedJson = JSON.parse(jsonContent);

        expect(actualJson).toEqual(expectedJson);
    });
}); 