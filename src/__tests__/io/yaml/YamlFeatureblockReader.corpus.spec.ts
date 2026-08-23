import path from 'path';
import fs from 'fs';
import { parse } from 'yaml';
import { glob } from 'glob';
import { YamlReader } from '../../../io/yaml';
import { Feature, Featureblock, FeatureType } from '../../../model';

/**
 * SC-155 regression corpus.
 *
 * These fixtures are VERBATIM copies of real steel-etl `gen` output (not hand-authored):
 *   - corpus-yaml/goblin-malice.yaml <- data-unified en/books/monsters/yaml/monster/goblin/goblin-malice.yaml
 *   - corpus-yaml/dart-trap.yaml     <- data-unified en/books/monsters/yaml/dynamic-terrain/mechanisms/dart-trap.yaml
 * (generated via `steel-etl gen --config pipeline.yaml --book mcdm.monsters.v1`, 2026-08-23)
 *
 * Every `features[]` entry steel-etl emits conforms to featureblock.schema.json's
 * `richFeature` shape (name/icon/cost/usage/keywords/distance/target/power_roll/
 * sections/enhancements/intro/body/trailing) — that shape has NO `feature_type`
 * property (`richFeature` sets `unevaluatedProperties: false` and doesn't list it),
 * so real corpus entries never carry one.
 *
 * Every hand-authored fixture in this repo's OTHER featureblock test data
 * (`data/featureblock/dto-yaml`, `dto-json`) declares `feature_type` on every entry,
 * which is why those fixtures never caught SC-155: `Feature.fromDTO`'s no-feature_type
 * fallback branch (`dto.isTrait()`) was never exercised by them. It's the fallback path
 * that actually breaks on real (plain-object, non-FeatureDTO-instance) data — this spec
 * exercises exactly that path via the real reader entrypoint (YamlReader ->
 * Featureblock.modelDTOAdapter -> Featureblock.fromDTO -> Feature.fromDTO), the same
 * seam every real consumer (the DSE plugin included) goes through.
 */
const corpusDir = path.join(__dirname, '..', '..', 'data', 'featureblock', 'corpus-yaml');

// A richFeature entry is an "ability" iff it declares any of keywords/usage/distance/
// target (matches Feature.isTrait's contract); everything else is a "trait". Computed
// independently from the raw YAML so this test doesn't just restate the code under test.
function expectedFeatureTypes(raw: any): FeatureType[] {
    return raw.features.map((f: any) => {
        const isAbility = (Array.isArray(f.keywords) && f.keywords.length > 0) || !!f.usage || !!f.distance || !!f.target;
        return isAbility ? FeatureType.Ability : FeatureType.Trait;
    });
}

describe('YamlReader(Featureblock) against real steel-etl corpus output (SC-155)', () => {
    const files = glob.sync('*.yaml', { cwd: corpusDir });

    // Guard against an empty glob silently passing (e.g. a typo'd path) — this suite's
    // whole point is exercising the real fixtures, so it must fail loudly if it isn't.
    test('corpus fixtures are present', () => {
        expect(files.length).toBeGreaterThan(0);
    });

    test.each(files)('reads %s without throwing and derives feature_type per entry', (file) => {
        const yamlContent = fs.readFileSync(path.join(corpusDir, file), 'utf-8');
        const raw = parse(yamlContent);

        // None of the corpus entries declare feature_type — confirms the fixture is
        // actually exercising the fallback branch this test is meant to cover.
        expect(raw.features.every((f: any) => f.feature_type === undefined)).toBe(true);

        const reader = new YamlReader(Featureblock.modelDTOAdapter);

        let featureblock: Featureblock;
        expect(() => {
            featureblock = reader.read(yamlContent);
        }).not.toThrow();

        featureblock = reader.read(yamlContent);
        expect(featureblock).toBeInstanceOf(Featureblock);
        expect(featureblock.features).toHaveLength(raw.features.length);

        const expected = expectedFeatureTypes(raw);
        featureblock.features.forEach((f, i) => {
            expect(f.feature_type).toBe(expected[i]);
        });
    });

    test('goblin-malice.yaml: three malice traits, none are abilities', () => {
        const yamlContent = fs.readFileSync(path.join(corpusDir, 'goblin-malice.yaml'), 'utf-8');
        const featureblock = new YamlReader(Featureblock.modelDTOAdapter).read(yamlContent);

        expect(featureblock.name).toBe('Goblin Malice');
        expect(featureblock.features.map(f => f.name)).toEqual(['Goblin Mode', 'Tiny Stabs', 'Swamp Stink']);
        expect(featureblock.features.every(f => f.feature_type === FeatureType.Trait)).toBe(true);
        expect(featureblock.features.every(f => f.isTrait())).toBe(true);
    });

    test('dart-trap.yaml: mixes traits (Deactivate/Activate/Upgrades/Hidden) with one ability (Dart)', () => {
        const yamlContent = fs.readFileSync(path.join(corpusDir, 'dart-trap.yaml'), 'utf-8');
        const featureblock = new YamlReader(Featureblock.modelDTOAdapter).read(yamlContent);

        const byName = new Map(featureblock.features.map(f => [f.name, f]));
        expect(byName.get('Deactivate')?.feature_type).toBe(FeatureType.Trait);
        expect(byName.get('Activate')?.feature_type).toBe(FeatureType.Trait);
        expect(byName.get('Upgrades')?.feature_type).toBe(FeatureType.Trait);
        expect(byName.get('Hidden')?.feature_type).toBe(FeatureType.Trait);

        const dart = byName.get('Dart');
        expect(dart?.feature_type).toBe(FeatureType.Ability);
        expect(dart?.isTrait()).toBe(false);
    });
});

// Sanity check that Feature.fromDTO's fallback now uses the static, duck-typed
// Feature.isTrait rather than assuming `dto` is a live FeatureDTO instance (the actual
// SC-155 defect: `dto.isTrait()` throws `TypeError: dto.isTrait is not a function` on a
// plain object).
describe('Feature.fromDTO fallback on a plain (non-FeatureDTO-instance) object (SC-155)', () => {
    test('derives trait for a plain object with no feature_type and no ability markers', () => {
        const plain = { name: 'Reflexive Ward', body: 'Reduces incoming damage by 2.' };
        expect(() => Feature.fromDTO(plain as any)).not.toThrow();
        expect(Feature.fromDTO(plain as any).feature_type).toBe(FeatureType.Trait);
    });

    test('derives ability for a plain object with no feature_type but ability markers', () => {
        const plain = { name: 'Dart', usage: 'Free triggered action', distance: 'Ranged 5', target: 'One creature' };
        expect(() => Feature.fromDTO(plain as any)).not.toThrow();
        expect(Feature.fromDTO(plain as any).feature_type).toBe(FeatureType.Ability);
    });
});
