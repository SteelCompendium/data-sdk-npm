# Project Context

## Product Overview

The Steel Compendium Data SDK is a TypeScript library for working with Draw Steel
TTRPG game data. It provides typed models, multi-format serialization (JSON, YAML,
Markdown), JSON Schema validation, and a CLI conversion tool. It was built so that
community tools can programmatically read and write game content in a standardized
format without reimplementing parsers.

## Domain Context

Draw Steel is a tabletop role-playing game. The game defines creatures via
**statblocks** (stat sheets with attributes, features, and abilities) and
character/creature capabilities via **features** (abilities, traits, and subtraits).
Groups of features are bundled into **featureblocks**.

The SDK models these game entities and handles conversion between three
serialization formats: JSON (canonical), YAML (human-friendly), and a custom
Markdown format specific to the Steel Compendium project.

### Key Concepts

- **Statblock** -- A creature's full stat sheet: name, level, roles, ancestry, stamina, speed, characteristics (might/agility/reason/intuition/presence), and a list of features.
- **Feature** -- A single ability, trait, or subtrait. Abilities have keywords, usage, distance, target, and effects. Traits are features without those fields.
- **Featureblock** -- A named group of features, often tied to a character class level or monster type. Has its own stats (EV, stamina, size) plus a feature list.
- **Effect** -- Part of a feature. Can include power roll tiers (tier1/tier2/tier3/crit), named sub-effects, and nested features.
- **Characteristics** -- The five core attributes: might, agility, reason, intuition, presence.
- **DTO (Data Transfer Object)** -- The serialization-layer representation. DTOs map 1:1 to JSON/YAML fields (snake_case). Models are the domain-layer representation (camelCase).
- **Steel Compendium Markdown** -- A specific Markdown format using blockquotes, bold headers, and tables to represent features and statblocks. Not generic Markdown.

## Glossary

| Term | Definition |
|------|-----------|
| ability | A feature with keywords, usage, distance, and target fields |
| characteristics | The five core attributes of a statblock (might, agility, reason, intuition, presence) |
| DTO | Data Transfer Object -- flat serialization representation of a model |
| effect | A sub-element of a feature containing the mechanical outcome, optionally with power roll tiers |
| EV | Encounter Value -- a numeric difficulty rating for statblocks and featureblocks |
| feature | The unified model for abilities, traits, and subtraits |
| featureblock | A named collection of features with optional stats |
| free strike | A specific game mechanic attribute on statblocks |
| model | The domain-layer TypeScript class (Feature, Statblock, Featureblock) |
| power roll | A dice mechanic producing tier1/tier2/tier3/crit outcomes |
| sc-convert | The CLI tool bundled with this SDK |
| statblock | A creature's complete game statistics |
| subtrait | A feature nested under another trait |
| trait | A feature without keywords, usage, distance, or target |

## Audiences

| Audience | What they need | How they interact |
|----------|---------------|-------------------|
| Tool developers | Read/write Draw Steel data in their apps | npm package import |
| Data pipeline operators | Convert between formats at scale | `sc-convert` CLI |
| Web adapter | Serialize/deserialize for web UI | npm package import (steel-compendium-sdk) |
| draw-steel-elements Obsidian plugin | Deserialize YAML in markdown notes into domain models for rendering | npm package import — uses `YamlReader` + `Feature`, `Statblock`, `Featureblock` models |
| Content contributors | Validate authored content | JSON Schema validation |

## Feature Inventory

### Shipped

- TypeScript domain models (Feature, Statblock, Featureblock, Effect, Characteristics)
- JSON reader/writer (generic, works for all model types)
- YAML reader/writer (generic, works for all model types)
- Markdown reader/writer (format-specific per model type)
- Auto-detection of format and model type (`SteelCompendiumIdentifier`)
- `sc-convert` CLI for batch format conversion
- JSON Schema validation for features and statblocks (via Ajv)
- Subtrait support (v2.2.0)

### Planned / Backlog

- Update Markdown standard for final Draw Steel PDF format
- YAML validator support
- Additional model types (community-driven)

## Constraints and Risks

- **Markdown format is non-standard:** The Markdown format is specific to Steel Compendium and uses blockquotes, bold headers, and tables in a particular way. Changes to this format are breaking.
- **Auto-identification is unreliable:** `SteelCompendiumIdentifier.identify()` has a known TODO in code noting the logic is flawed. The `parse()` method (explicit format + type) is reliable.
- **cjs output only:** The build targets CommonJS (`module: commonjs`), which may cause issues for ESM-only consumers.
