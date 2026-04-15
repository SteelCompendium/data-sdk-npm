---
repo: data-sdk-npm
type: library
status: active
tech:
  - TypeScript
  - Jest
  - npm
updated: 2026-04-14
---

# data-sdk-npm

A TypeScript SDK for reading, writing, and converting structured Draw Steel TTRPG
data between JSON, YAML, and a custom Markdown format. Supports 13 model types:
Feature, Statblock, Featureblock, plus 10 content types (Ancestry, Career, Class,
Complication, Condition, Culture, Kit, Perk, Title, Treasure). Published as the
`steel-compendium-sdk` npm package and also provides the `sc-convert` CLI tool.

**This repo is not:** a game application, a content repository, or a web frontend.
It is a data serialization library. Key consumers include the
[web-adapter](https://github.com/SteelCompendium/web-adapter) and the
[draw-steel-elements](https://github.com/SteelCompendium/draw-steel-elements)
Obsidian plugin (which uses the SDK's YAML reader to marshal game data embedded
in Obsidian markdown notes).

## Quick Reference

| Action | Command |
|--------|---------|
| Install dependencies | `npm install` |
| Build | `npm run build` |
| Run tests | `npm run test` |
| Build + test | `just test` |
| Release a version | `just release <version>` |
| Run CLI (after build) | `npm run build && npm link && sc-convert --from json --to yaml <file>` |

| Resource | URL |
|----------|-----|
| npm package | https://www.npmjs.com/package/steel-compendium-sdk |
| Issue tracker | https://github.com/SteelCompendium/data-sdk-npm/issues |
| Bug report form | https://docs.google.com/forms/d/e/1FAIpQLSc6m-pZ0NLt2EArE-Tcxr-XbAPMyhu40ANHJKtyRvvwBd2LSw/viewform |

## Repo Structure

```
data-sdk-npm/
  src/
    cli/                  # sc-convert CLI tool
      sc-convert.ts
    dto/                  # Data Transfer Objects (serialization layer)
    io/                   # Readers and writers for each format
      json/               #   JSON reader/writer
      yaml/               #   YAML reader/writer
      markdown/           #   Steel Compendium Markdown reader/writer
      AutoDataReader.ts   #   Auto-detect format and read
      SteelCompendiumIdentifier.ts  # Format + model type detection
    model/                # Domain models (Feature, Statblock, Featureblock, + 10 content types)
    schema/               # JSON Schemas for validation (12 schemas, draft 2019-09)
    validation/           # Ajv-based schema validator (draft 2019-09)
    __tests__/            # Jest tests mirroring io/ structure
      data/               # Test fixtures (JSON, YAML, Markdown per model type)
      io/                 # Reader/writer tests
      validation/         # Validator tests
  dist/                   # Build output (gitignored)
  justfile                # Task runner (release, convert helpers)
  jest.config.js
  tsconfig.json
  package.json
```

## Reading Guide by Role

### Human Roles

| Role | Start here | Then read |
|------|-----------|-----------|
| **New to this repo** | This file | [project.md](project.md) |
| **Developer** | [development.md](development.md) | [architecture.md](architecture.md), [conventions.md](conventions.md) |
| **Architect** | [architecture.md](architecture.md) | [integration.md](integration.md) |

### Agent Roles

| Agent Role | Start here | Then read |
|------------|-----------|-----------|
| **Code review** | [conventions.md](conventions.md) | [architecture.md](architecture.md), [troubleshooting.md](troubleshooting.md) |
| **Bug fix / debug** | [troubleshooting.md](troubleshooting.md) | [development.md](development.md), [architecture.md](architecture.md) |
| **Feature implementation** | [architecture.md](architecture.md) | [conventions.md](conventions.md), [development.md](development.md) |
| **Dependency update** | [integration.md](integration.md) | [architecture.md](architecture.md), [ci-cd.md](ci-cd.md) |
| **Documentation** | This file | [project.md](project.md), [architecture.md](architecture.md) |

## Current Status

- **Health:** active development
- **Last significant change:** v3.0.0 (2026-04-14) — added 10 content type schemas/models/DTOs, upgraded to JSON Schema draft 2019-09 with `unevaluatedProperties`
- **Known blockers:** None

## Documents in This Directory

| File | Covers |
|------|--------|
| [project.md](project.md) | Product vision, domain context, glossary, audiences |
| [architecture.md](architecture.md) | System design, components, data flow, dependencies |
| [development.md](development.md) | Setup, workflows, testing, debugging |
| [integration.md](integration.md) | Upstream/downstream dependencies, npm package surface |
| [ci-cd.md](ci-cd.md) | Build, release process, versioning |
| [conventions.md](conventions.md) | Code style, naming, commit messages |
| [troubleshooting.md](troubleshooting.md) | Known issues, common errors, "Do NOT" warnings |
