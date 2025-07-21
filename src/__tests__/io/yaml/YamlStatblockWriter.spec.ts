import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import { JsonReader } from '../../../io/json';
import { YamlWriter } from '../../../io/yaml';
import { Statblock } from '../../../model';
import { parse } from 'yaml';

const jsonTestPath = path.join(__dirname, '..', '..', 'data', 'statblock', 'dto-json');
const yamlTestPath = path.join(__dirname, '..', '..', 'data', 'statblock', 'dto-yaml');

describe('YamlWriter', () => {
    const files = glob.sync('*.json', { cwd: jsonTestPath });

    test.each(files)('should correctly convert %s to YAML', (file) => {
        const jsonReader = new JsonReader(Statblock.modelDTOAdapter);
        const yamlWriter = new YamlWriter();

        const jsonFilePath = path.join(jsonTestPath, file);
        const yamlFilePath = path.join(yamlTestPath, file.replace('.json', '.yaml'));

        const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
        const expectedYamlContent = fs.readFileSync(yamlFilePath, 'utf-8');

        const creature = jsonReader.read(jsonContent);
        const actualYamlContent = yamlWriter.write(creature);

        const actualObject = parse(actualYamlContent);
        const expectedObject = parse(expectedYamlContent);

        expect(actualObject).toEqual(expectedObject);
    });
}); 