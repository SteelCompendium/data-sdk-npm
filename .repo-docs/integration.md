# Integration

## Dependency Map

```
                    ┌───────────────────┐
                    │  Draw Steel TTRPG  │
                    │  (game content)    │
                    └────────┬──────────┘
                             │ authored as Markdown/JSON/YAML
                             ▼
                    ┌───────────────────┐
                    │ steel-compendium  │
                    │   -sdk (this repo) │
                    └────────┬──────────┘
                             │ npm package
                     ┌───────┴────────┐
                     ▼                ▼
            ┌──────────────┐  ┌────────────────────┐
            │ web-adapter  │  │ draw-steel-elements │
            │              │  │ (Obsidian plugin)   │
            └──────────────┘  └────────────────────┘
```

## Upstream Dependencies

| Source | What it provides | How we consume it | Coupling |
|--------|-----------------|-------------------|----------|
| Draw Steel game content | Statblocks, features, featureblocks | Authored as Markdown/JSON/YAML files passed to readers | loose (format-coupled) |
| npm registry | Runtime dependencies (ajv, gray-matter, js-yaml, yaml) | `npm install` | standard |

## Downstream Dependents

| Consumer | What they use | How they consume it | Coupling |
|----------|--------------|---------------------|----------|
| [web-adapter](https://github.com/SteelCompendium/web-adapter) | Models, readers/writers, schemas | npm import (`steel-compendium-sdk`) | tight |
| [draw-steel-elements](https://github.com/SteelCompendium/draw-steel-elements) | `YamlReader`, `Feature`, `Statblock`, `Featureblock` models | npm import (`steel-compendium-sdk`) — marshals YAML embedded in Obsidian markdown notes into domain models for plugin rendering | tight |
| Community tool developers | Models, IO, validation | npm import | loose |
| Data pipeline scripts | `sc-convert` CLI | CLI invocation | loose |

## API Surface

### npm Package Exports

| Export path | What it provides | Stability |
|-------------|-----------------|-----------|
| `steel-compendium-sdk` (main) | All models, IO, DTOs, schemas, validator | stable (Feature/Statblock/Featureblock); beta for the 10 content-type models/schemas — see below |
| `steel-compendium-sdk/model` | Domain models only | stable (Feature/Statblock/Featureblock); beta for the 10 content-type models — see below |
| `steel-compendium-sdk/dto` | DTOs only | stable (Feature/Statblock/Featureblock); beta for the 10 content-type DTOs — see below |
| `steel-compendium-sdk/schema` | JSON Schema files | stable (Feature/Statblock/Featureblock); beta for the 10 content-type schemas — see below |

### CLI

| Command | Stability |
|---------|-----------|
| `sc-convert --from <fmt> --to <fmt> --type <type> [--output <path>] <input>` | stable |
| `sc-convert --version` | stable |

### JSON Schemas

All schemas use JSON Schema draft 2019-09 with `unevaluatedProperties: false` for composability.

**Stability:** Feature/Statblock/Featureblock (+ shared sub-schemas) are stable. The 10
content-type schemas (Ancestry through Treasure) are **beta — subject to change without
notice**; see README.md § Schema stability for rationale.

| Schema | File | Stability |
|--------|------|-----------|
| Feature | `dist/schema/feature.schema.json` | stable |
| Statblock | `dist/schema/statblock.schema.json` | stable |
| Ancestry | `dist/schema/ancestry.schema.json` | beta |
| Career | `dist/schema/career.schema.json` | beta |
| Class | `dist/schema/class.schema.json` | beta |
| Complication | `dist/schema/complication.schema.json` | beta |
| Condition | `dist/schema/condition.schema.json` | beta |
| Culture | `dist/schema/culture.schema.json` | beta |
| Kit | `dist/schema/kit.schema.json` | beta |
| Perk | `dist/schema/perk.schema.json` | beta |
| Title | `dist/schema/title.schema.json` | beta |
| Treasure | `dist/schema/treasure.schema.json` | beta |

## Integration Testing

- **Local:** Tests use fixture files in `src/__tests__/data/` to verify round-trip conversion across all formats. No external services required.
- **CI:** Same as local.
