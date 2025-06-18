import { Trait } from '../../model/Trait';
import * as fs from 'fs';
import * as path from 'path';

const testDataDir = path.join(__dirname, 'test-data', 'trait');
const inputDir = path.join(testDataDir, 'input');
const outputDir = path.join(testDataDir, 'output');

describe('Trait Data-Driven Tests', () => {

    const inputFiles = fs.readdirSync(inputDir);

    inputFiles.forEach(inputFile => {
        const inputFilePath = path.join(inputDir, inputFile);
        const fileExtension = path.extname(inputFile);
        const baseName = path.basename(inputFile, fileExtension);

        if (fileExtension === '.yaml' || fileExtension === '.yml') {
            test(`${baseName}.yaml to JSON`, () => {
                const inputYaml = fs.readFileSync(inputFilePath, 'utf8');
                const trait = Trait.fromYaml(inputYaml);
                const outputJson = trait.toJson();
                const expectedJsonPath = path.join(outputDir, `${baseName}.json`);
                const expectedJson = fs.readFileSync(expectedJsonPath, 'utf8');
                expect(JSON.parse(outputJson)).toEqual(JSON.parse(expectedJson));
            });
        }

        if (fileExtension === '.json') {
            test(`${baseName}.json to YAML`, () => {
                const inputJson = fs.readFileSync(inputFilePath, 'utf8');
                const trait = Trait.fromJson(inputJson);
                const outputYaml = trait.toYaml();
                const expectedYamlPath = path.join(outputDir, `${baseName}.yaml`);
                const expectedYaml = fs.readFileSync(expectedYamlPath, 'utf8');
                expect(outputYaml).toEqual(expectedYaml);
            });
        }
    });
});
