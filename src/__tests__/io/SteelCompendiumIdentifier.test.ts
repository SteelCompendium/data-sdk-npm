import * as fs from 'fs';
import * as path from 'path';
import { SteelCompendiumIdentifier, SteelCompendiumFormat, Ability, Statblock } from '../..';

describe('SteelCompendiumIdentifier', () => {
    const dataDir = path.join(__dirname, '../../__tests__/data');

    const getTestFiles = (dir: string): string[] => {
        let files: string[] = [];
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                files = files.concat(getTestFiles(fullPath));
            } else {
                files.push(fullPath);
            }
        }
        return files;
    };

    const getExpectedFormat = (filePath: string): SteelCompendiumFormat => {
        if (filePath.includes('dto-json')) {
            return SteelCompendiumFormat.Json;
        }
        if (filePath.includes('dto-yaml')) {
            return SteelCompendiumFormat.Yaml;
        }
        if (filePath.includes('prerelease-pdf')) {
            return SteelCompendiumFormat.PrereleasePdfText;
        }
        return SteelCompendiumFormat.Unknown;
    };

    const getExpectedModel = (filePath: string): typeof Ability | typeof Statblock | null => {
        if (filePath.includes('ability')) {
            return Ability;
        }
        if (filePath.includes('statblock')) {
            return Statblock;
        }
        return null;
    };

    const allFiles = getTestFiles(dataDir);

    allFiles.forEach(file => {
        const expectedFormat = getExpectedFormat(file);
        if (expectedFormat === SteelCompendiumFormat.Unknown) {
            return;
        }
        const expectedModel = getExpectedModel(file);
        if (expectedModel === null) {
            return;
        }

        it(`should identify ${path.relative(dataDir, file)} as ${expectedFormat} and model ${expectedModel.name}`, () => {
            const content = fs.readFileSync(file, 'utf-8');
            const result = SteelCompendiumIdentifier.identify(content);
            expect(result.format).toBe(expectedFormat);
            expect(result.model).toBe(expectedModel);
        });
    });

    it('should return Unknown for an unidentifiable format', () => {
        const content = 'this is not a valid format';
        const result = SteelCompendiumIdentifier.identify(content);
        expect(result.format).toBe(SteelCompendiumFormat.Unknown);
        expect(result.model).toBeNull();
    });
}); 