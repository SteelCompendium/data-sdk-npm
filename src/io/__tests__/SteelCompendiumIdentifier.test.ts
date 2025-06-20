import * as fs from 'fs';
import * as path from 'path';
import { SteelCompendiumIdentifier, SteelCompendiumFormat } from '../..';

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
            if (filePath.includes('ability')) {
                return SteelCompendiumFormat.PrereleasePdfAbilityText;
            }
            if (filePath.includes('statblock')) {
                return SteelCompendiumFormat.PrereleasePdfStatblockText;
            }
        }
        return SteelCompendiumFormat.Unknown;
    };

    const allFiles = getTestFiles(dataDir);

    allFiles.forEach(file => {
        const expectedFormat = getExpectedFormat(file);
        if (expectedFormat === SteelCompendiumFormat.Unknown) {
            return;
        }

        it(`should identify ${path.relative(dataDir, file)} as ${expectedFormat}`, () => {
            const content = fs.readFileSync(file, 'utf-8');
            const result = SteelCompendiumIdentifier.identify(content);
            expect(result.format).toBe(expectedFormat);
        });
    });

    it('should return Unknown for an unidentifiable format', () => {
        const content = 'this is not a valid format';
        const result = SteelCompendiumIdentifier.identify(content);
        expect(result.format).toBe(SteelCompendiumFormat.Unknown);
    });
}); 