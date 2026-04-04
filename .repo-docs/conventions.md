# Conventions

## File and Directory Naming

| Category | Pattern | Example |
|----------|---------|---------|
| Source files | PascalCase.ts | `MarkdownFeatureReader.ts` |
| Test files | PascalCase.test.ts or PascalCase.spec.ts | `MarkdownFeatureReader.test.ts` |
| Schema files | kebab-case.schema.json | `feature.schema.json` |
| Test fixtures | snake_case.{json,yaml,md} | `goblin_warrior.json` |

### Directory Structure Conventions

- `src/io/{format}/` -- one directory per serialization format
- `src/__tests__/` mirrors the `src/` structure
- `src/__tests__/data/{model-type}/{format}/` -- fixture data organized by model type and format
- Barrel `index.ts` files in each directory re-export public API

## Code Style

### Formatting

- No formatter configured (no prettier/eslint config in repo)
- TypeScript strict mode enabled

### Language-Specific Conventions

- Models use `public constructor(source: Partial<T>)` + `Object.assign(this, source)` pattern
- Non-null assertion (`!`) used on required fields that are assigned via `Object.assign`
- DTOs use snake_case field names to match JSON/YAML serialization
- Models use camelCase field names
- Abstract classes prefixed with `I` (`IDataReader`, `IDataWriter`, `IDataExtractor`)
- Each model has a static `modelDTOAdapter` for generic reader construction
- Base class `SteelCompendiumModel<D>` provides `read()`, `write()`, `toJson()`, `toYaml()` convenience methods
- Singleton pattern for validator (`const validator = new Validator(); export default validator;`)

## Commit Messages

Pattern observed from git history:

```
<description>
```

No conventional commit prefixes used. Messages are short, imperative descriptions.
Version preparation commits follow: `Prepares for release '<version>'`.

Examples from history:
- `Updates to support subtrait`
- `Fixes for nested features`
- `Adds --version flag to sc-convert (2.1.0)`
- `Prepares for release '2.2.0'`

## Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Model classes | PascalCase noun | `Feature`, `Statblock`, `Featureblock` |
| DTO classes | PascalCase + DTO suffix | `FeatureDTO`, `StatblockDTO` |
| Reader/Writer classes | PascalCase + Reader/Writer | `JsonReader`, `MarkdownFeatureWriter` |
| Model fields | camelCase | `freeStrike`, `abilityType` |
| DTO fields | snake_case | `free_strike`, `ability_type` |
| Enums | PascalCase | `FeatureType.Ability` |
| Static constants | UPPER_SNAKE | `STATBLOCK_TYPE`, `FEATURE_TYPE` |
| Type parameters | Single uppercase letter | `M extends SteelCompendiumModel<any>` |
