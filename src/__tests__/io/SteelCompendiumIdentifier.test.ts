import * as fs from 'fs';
import * as path from 'path';
import { SteelCompendiumIdentifier, SteelCompendiumFormat } from '../..';

describe('SteelCompendiumIdentifier', () => {
    const dataDir = path.join(__dirname, '../../__tests__/data');

    const testCases = [
        { file: 'ability.json', expectedFormat: SteelCompendiumFormat.Json },
        { file: 'ability.yaml', expectedFormat: SteelCompendiumFormat.Yaml },
        { file: 'statblock.json', expectedFormat: SteelCompendiumFormat.Json },
        { file: 'statblock.yaml', expectedFormat: SteelCompendiumFormat.Yaml },
        { file: 'prerelease-ability.txt', expectedFormat: SteelCompendiumFormat.PrereleasePdfAbilityText },
        { file: 'prerelease-statblock.txt', expectedFormat: SteelCompendiumFormat.PrereleasePdfStatblockText },
    ];

    testCases.forEach(({ file, expectedFormat }) => {
        it(`should identify ${file} as ${expectedFormat}`, () => {
            const filePath = path.join(dataDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
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