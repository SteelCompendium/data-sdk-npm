import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';
import { Effects } from '../../model/Effects';
import { effectFromDTO } from '../../model/EffectFactory';

const testDataDir = path.join(__dirname, 'test-data', 'effect');

const effectTypes = fs.readdirSync(testDataDir);

describe('Effect Data-Driven Tests', () => {

    effectTypes.forEach(effectType => {

        const effectTestDataDir = path.join(testDataDir, effectType);
        const inputDir = path.join(effectTestDataDir, 'input');
        const outputDir = path.join(effectTestDataDir, 'output');

        if (!fs.existsSync(inputDir) || !fs.existsSync(outputDir)) {
            return;
        }

        describe(effectType, () => {
            const inputFiles = fs.readdirSync(inputDir);

            inputFiles.forEach(inputFile => {
                const inputFilePath = path.join(inputDir, inputFile);
                const fileExtension = path.extname(inputFile);
                const baseName = path.basename(inputFile, fileExtension);

                if (fileExtension === '.yaml' || fileExtension === '.yml') {
                    test(`${baseName}.yaml to JSON`, () => {
                        const inputYaml = fs.readFileSync(inputFilePath, 'utf8');
                        const parsed = parse(inputYaml);
                        const effects = Array.isArray(parsed) ? Effects.fromDTO(parsed).effects : [effectFromDTO(parsed)];
                        const outputJson = JSON.stringify(effects.length > 1 ? effects : effects[0], null, 2);
                        const expectedJsonPath = path.join(outputDir, `${baseName}.json`);
                        const expectedJson = fs.readFileSync(expectedJsonPath, 'utf8');
                        expect(JSON.parse(outputJson)).toEqual(JSON.parse(expectedJson));
                    });
                }

                if (fileExtension === '.json') {
                    test(`${baseName}.json to YAML`, () => {
                        const inputJson = fs.readFileSync(inputFilePath, 'utf8');
                        const parsed = JSON.parse(inputJson);
                        const effects = Array.isArray(parsed) ? Effects.fromDTO(parsed).effects : [effectFromDTO(parsed)];
                        const outputYaml = parse(JSON.stringify(effects.length > 1 ? effects : effects[0]));
                        const expectedYamlPath = path.join(outputDir, `${baseName}.yaml`);
                        const expectedYaml = fs.readFileSync(expectedYamlPath, 'utf8');
                        expect(outputYaml).toEqual(parse(expectedYaml));
                    });
                }
            });
        });
    });
}); 