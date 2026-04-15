# Development

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | >= 18 | https://nodejs.org/ |
| npm | (bundled with Node) | -- |
| just | any | https://github.com/casey/just |

`just` is optional -- it's only needed for the `just release` and `just convert` helpers.

## Setup

1. Clone the repository:
   ```sh
   git clone git@github.com:SteelCompendium/data-sdk-npm.git
   cd data-sdk-npm
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Build:
   ```sh
   npm run build
   ```

4. Verify setup:
   ```sh
   npm run test
   ```

### Required Environment Variables

| Variable | Description | Required | Default |
|----------|------------|----------|---------|
| NPM_PAT | npm Personal Access Token for publishing | Only for `npm publish` | -- |

## Common Workflows

### Running Tests

```sh
npm run test
```

Or build + test together:
```sh
just test
```

### Running the CLI

```sh
npm run build && npm link
sc-convert --from markdown --to json --type feature path/to/input.md --output ./tmp
sc-convert --version
```

### Adding a New Model Type

1. Create the model class in `src/model/` extending `SteelCompendiumModel`
2. Create the DTO class in `src/dto/` extending `SteelCompendiumDTO`
3. If the type needs Markdown support, create reader/writer in `src/io/markdown/`. For content types (like Ancestry, Career, etc.), JSON/YAML support is automatic via `ModelDTOAdapter`.
4. Register the new type in `SteelCompendiumIdentifier`: add to `CONTENT_TYPE_MAP` (for content types) or add explicit cases in `parse()` (for structured types like Feature/Statblock)
5. Export from the barrel files (`src/model/index.ts`, `src/dto/index.ts`)
6. Add a JSON Schema in `src/schema/` (draft 2019-09, `unevaluatedProperties: false`) and register it in `src/validation/validator.ts` and `src/schema/index.ts`
7. Add test fixtures in `src/__tests__/data/{type}/` (dto-json, dto-yaml, sc-md if applicable)
8. Add reader/writer tests in `src/__tests__/io/`

### Adding a New Field to an Existing Model

1. Add the field to the model class in `src/model/`
2. Add the corresponding field to the DTO class in `src/dto/`
3. Update `fromDTO()` and `toDTO()` / `partialFromModel()` mappings
4. Update Markdown readers and writers to handle the new field
5. Update test fixtures and add new test cases
6. Update JSON Schema in `src/schema/` if applicable

## Testing

### Test Strategy

| Type | Framework | Location | Runs on |
|------|-----------|----------|---------|
| Unit/Integration | Jest + ts-jest | `src/__tests__/` | local + CI |

Tests are fixture-driven: each model type has test data in three formats
(dto-json, dto-yaml, sc-md) under `src/__tests__/data/`. Tests read fixtures,
parse them, and verify round-trip conversion.

### Running Tests

```sh
# All tests
npm run test

# Specific test file
npx jest src/__tests__/io/markdown/MarkdownFeatureReader.test.ts

# Watch mode
npx jest --watch
```

### Writing Tests

- Test files go in `src/__tests__/io/` mirroring the source structure
- Test file naming: `*.test.ts` or `*.spec.ts`
- Fixture data goes in `src/__tests__/data/{model-type}/{format}/`
- Tests should verify round-trip: read from one format, write to another, read back, compare

### Coverage Requirements

No formal coverage threshold configured, but all readers and writers should have tests.

## Debugging

### Common Debug Commands

```sh
# Inspect a parsed model
npx ts-node -e "
  const {MarkdownFeatureReader} = require('./src/io/markdown');
  const fs = require('fs');
  const r = new MarkdownFeatureReader();
  console.log(JSON.stringify(r.read(fs.readFileSync('path/to/file.md','utf8')), null, 2));
"

# Validate a JSON file against schema
npx ts-node -e "
  const {default: validator} = require('./src/validation/validator');
  const fs = require('fs');
  validator.validateJSON(fs.readFileSync('path/to/file.json','utf8'), 'feature.schema.json')
    .then(r => console.log(r));
"
```
