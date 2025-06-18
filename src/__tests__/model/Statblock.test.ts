import { Statblock } from '../../model/Statblock';
import * as fs from 'fs';
import * as path from 'path';
import { YamlReader } from '../../io/yaml';
import { JsonWriter } from '../../io/json';
import { JsonReader } from '../../io/json';
import { YamlWriter } from '../../io/yaml';

const testDataDir = path.join(__dirname, 'test-data', 'statblock');
const inputDir = path.join(testDataDir, 'input');
const outputDir = path.join(testDataDir, 'output');

describe('Statblock Data-Driven Tests', () => {

    const inputFiles = fs.readdirSync(inputDir);

    inputFiles.forEach(inputFile => {
        const inputFilePath = path.join(inputDir, inputFile);
        const fileExtension = path.extname(inputFile);
        const baseName = path.basename(inputFile, fileExtension);

        if (fileExtension === '.yaml' || fileExtension === '.yml') {
            test(`${baseName}.yaml to JSON`, () => {
                const inputYaml = fs.readFileSync(inputFilePath, 'utf8');
                const statblock = Statblock.read(new YamlReader(), inputYaml);
                const outputJson = new JsonWriter().write(statblock);
                const expectedJsonPath = path.join(outputDir, `${baseName}.json`);
                const expectedJson = fs.readFileSync(expectedJsonPath, 'utf8');
                expect(JSON.parse(outputJson)).toEqual(JSON.parse(expectedJson));
            });
        }

        if (fileExtension === '.json') {
            test(`${baseName}.json to YAML`, () => {
                const inputJson = fs.readFileSync(inputFilePath, 'utf8');
                const statblock = Statblock.read(new JsonReader(), inputJson);
                const outputYaml = new YamlWriter().write(statblock);
                const expectedYamlPath = path.join(outputDir, `${baseName}.yaml`);
                const expectedYaml = fs.readFileSync(expectedYamlPath, 'utf8');
                expect(outputYaml).toEqual(expectedYaml);
            });
        }
    });
}); 