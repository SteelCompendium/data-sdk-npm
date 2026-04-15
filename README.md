# data-sdk-npm

A TypeScript SDK for reading, writing, and converting structured Draw Steel TTRPG data between JSON, YAML, and a custom Markdown format.

- npm package: [steel-compendium-sdk](https://www.npmjs.com/package/steel-compendium-sdk)
- [Bug report form](https://docs.google.com/forms/d/e/1FAIpQLSc6m-pZ0NLt2EArE-Tcxr-XbAPMyhu40ANHJKtyRvvwBd2LSw/viewform)

## Models

13 typed domain models covering all Draw Steel game entities:

- **Structured types:** [Feature](src/model/Feature.ts), [Statblock](src/model/Statblock.ts), [Featureblock](src/model/Featureblock.ts)
- **Content types:** [Ancestry](src/model/Ancestry.ts), [Career](src/model/Career.ts), [Class](src/model/Class.ts), [Complication](src/model/Complication.ts), [Condition](src/model/Condition.ts), [Culture](src/model/Culture.ts), [Kit](src/model/Kit.ts), [Perk](src/model/Perk.ts), [Title](src/model/Title.ts), [Treasure](src/model/Treasure.ts)

## Serialization

| Format | Reader | Writer | Supported types |
|--------|--------|--------|-----------------|
| JSON | `JsonReader` | `JsonWriter` | All 13 types |
| YAML | `YamlReader` | `YamlWriter` | All 13 types |
| Markdown | `MarkdownFeatureReader`, `MarkdownStatblockReader`, `MarkdownFeatureblockReader` | `MarkdownFeatureWriter`, `MarkdownStatblockWriter`, `MarkdownFeatureblockWriter` | Feature, Statblock, Featureblock |

## Schemas

12 JSON Schemas (draft 2019-09 with `unevaluatedProperties: false` for composability):

| Schema | File |
|--------|------|
| Feature | [feature.schema.json](src/schema/feature.schema.json) |
| Statblock | [statblock.schema.json](src/schema/statblock.schema.json) |
| Ancestry | [ancestry.schema.json](src/schema/ancestry.schema.json) |
| Career | [career.schema.json](src/schema/career.schema.json) |
| Class | [class.schema.json](src/schema/class.schema.json) |
| Complication | [complication.schema.json](src/schema/complication.schema.json) |
| Condition | [condition.schema.json](src/schema/condition.schema.json) |
| Culture | [culture.schema.json](src/schema/culture.schema.json) |
| Kit | [kit.schema.json](src/schema/kit.schema.json) |
| Perk | [perk.schema.json](src/schema/perk.schema.json) |
| Title | [title.schema.json](src/schema/title.schema.json) |
| Treasure | [treasure.schema.json](src/schema/treasure.schema.json) |

## Development

### Quick Start

```bash
npm install
npm run build
npm run test
```

### CLI

```bash
npm run build && npm link
sc-convert --from markdown --to json --type feature input.md --output ./tmp
sc-convert --from json --to yaml --type statblock input.json
sc-convert --version
```

### Release

1. Update `CHANGELOG.md` with release notes
2. Run `just release <version>` (or manually update `package.json` version and `npm publish`)

### Future Work

- Update Markdown standard for final Draw Steel PDF format
- Validator support for YAML
- Markdown readers/writers for content types (currently JSON/YAML only)
