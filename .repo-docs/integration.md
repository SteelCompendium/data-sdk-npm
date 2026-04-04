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
| `steel-compendium-sdk` (main) | All models, IO, DTOs, schemas, validator | stable |
| `steel-compendium-sdk/model` | Domain models only | stable |
| `steel-compendium-sdk/dto` | DTOs only | stable |
| `steel-compendium-sdk/schema` | JSON Schema files | stable |

### CLI

| Command | Stability |
|---------|-----------|
| `sc-convert --from <fmt> --to <fmt> --type <type> [--output <path>] <input>` | stable |
| `sc-convert --version` | stable |

### JSON Schemas

| Schema | File |
|--------|------|
| Feature | `dist/schema/feature.schema.json` |
| Statblock | `dist/schema/statblock.schema.json` |

## Integration Testing

- **Local:** Tests use fixture files in `src/__tests__/data/` to verify round-trip conversion across all formats. No external services required.
- **CI:** Same as local.
