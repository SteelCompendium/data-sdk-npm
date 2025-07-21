import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import { YamlReader } from '../../../io/yaml';
import { Statblock } from '../../../model';

const yamlTestPath = path.join(__dirname, '..', '..', 'data', 'statblock', 'dto-yaml');
const jsonTestPath = path.join(__dirname, '..', '..', 'data', 'statblock', 'dto-json');

describe('YamlReader', () => {
    const files = glob.sync('*.yaml', { cwd: yamlTestPath });

    test.each(files)('should correctly read %s and convert to JSON', (file) => {
        const yamlReader = new YamlReader(Statblock.modelDTOAdapter);

        const yamlFilePath = path.join(yamlTestPath, file);
        const jsonFilePath = path.join(jsonTestPath, file.replace('.yaml', '.json'));

        const yamlContent = fs.readFileSync(yamlFilePath, 'utf-8');
        const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');

        const creature = yamlReader.read(yamlContent);
        const actualJson = creature.toDTO();

        const expectedJson = JSON.parse(jsonContent);

        expect(actualJson).toEqual(expectedJson);
    });
}); 