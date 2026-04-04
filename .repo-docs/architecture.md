# Architecture

## System Overview

The SDK follows a three-layer architecture: **Model** (domain types) <-> **DTO**
(serialization types) <-> **IO** (readers/writers). Models use camelCase and
contain domain logic. DTOs use snake_case and map directly to JSON/YAML fields.
IO classes handle parsing and serialization for each format.

```
Input (JSON/YAML/Markdown string)
  --> IO layer: Reader parses string into DTO
    --> DTO layer: DTO.toModel() converts to domain Model
      --> Application uses Model
    --> DTO layer: Model.toDTO() converts back
  --> IO layer: Writer serializes DTO to string
Output (JSON/YAML/Markdown string)
```

## Components

### src/model/ (Domain Models)

- **Responsibility:** Domain types with validation and conversion logic. Base class `SteelCompendiumModel` provides `read()`, `write()`, `toJson()`, `toYaml()` convenience methods.
- **Location:** `src/model/`
- **Depends on:** `src/dto/` (for DTO conversion)
- **Depended on by:** `src/io/`, `src/cli/`, consumers of the npm package
- **Key classes:** `Feature`, `Statblock`, `Featureblock`, `Effect`, `Characteristics`, `FeatureStat`

### src/dto/ (Data Transfer Objects)

- **Responsibility:** Flat serialization representations that map 1:1 to JSON/YAML fields. Handle snake_case <-> camelCase translation. Each DTO has `toModel()` and `partialFromModel()` static methods.
- **Location:** `src/dto/`
- **Depends on:** `src/model/`
- **Depended on by:** `src/io/`
- **Key classes:** `FeatureDTO`, `StatblockDTO`, `FeatureblockDTO`, `SteelCompendiumDTO` (base)

### src/io/ (Readers and Writers)

- **Responsibility:** Format-specific serialization. Abstract base classes `IDataReader<M>` and `IDataWriter<M>` define the interface. Each format has concrete implementations.
- **Location:** `src/io/`
- **Depends on:** `src/model/`, `src/dto/`
- **Depended on by:** `src/cli/`, consumers of the npm package

| Format | Reader | Writer | Notes |
|--------|--------|--------|-------|
| JSON | `JsonReader` (generic) | `JsonWriter` (generic) | Works for all model types via `ModelDTOAdapter` |
| YAML | `YamlReader` (generic) | `YamlWriter` (generic) | Same adapter pattern as JSON. Also used by the draw-steel-elements Obsidian plugin to deserialize YAML from markdown notes. |
| Markdown | `MarkdownFeatureReader`, `MarkdownStatblockReader`, `MarkdownFeatureblockReader` | `MarkdownFeatureWriter`, `MarkdownStatblockWriter`, `MarkdownFeatureblockWriter` | Format-specific per model type |

### src/io/SteelCompendiumIdentifier.ts (Format Detection)

- **Responsibility:** Detect format (JSON/YAML/Markdown) and model type (Feature/Statblock/Featureblock) from input data. `parse()` uses explicit format + type. `identify()` auto-detects (unreliable).
- **Location:** `src/io/SteelCompendiumIdentifier.ts`
- **Depends on:** All reader classes
- **Depended on by:** `src/cli/`, `AutoDataReader`

### src/schema/ (JSON Schemas)

- **Responsibility:** JSON Schema definitions for Feature and Statblock. Exported as part of the npm package.
- **Location:** `src/schema/`
- **Depends on:** nothing
- **Depended on by:** `src/validation/`

### src/validation/ (Schema Validator)

- **Responsibility:** Ajv-based JSON Schema validation. Singleton `validator` export with `validateJSON()` method.
- **Location:** `src/validation/`
- **Depends on:** `src/schema/`, `ajv`
- **Depended on by:** consumers of the npm package

### src/cli/ (CLI Tool)

- **Responsibility:** `sc-convert` command-line tool for batch format conversion. Parses args, detects format, reads input, writes output.
- **Location:** `src/cli/sc-convert.ts`
- **Depends on:** `src/io/`, `src/model/`
- **Depended on by:** nothing (end-user entry point)

## Data Flow

### Reading (JSON -> Model)

```
JSON string
  --> JsonReader.read(source)
    --> JSON.parse(source)
    --> ModelDTOAdapter(parsed) creates DTO
    --> DTO.toModel() creates Model
  --> returns Feature | Statblock | Featureblock
```

### Reading (Markdown -> Model)

```
Markdown string
  --> MarkdownFeatureReader.read(source)
    --> gray-matter extracts frontmatter + body
    --> Custom parser extracts fields from blockquote/table structure
    --> Constructs Feature directly (no DTO intermediate)
  --> returns Feature
```

### Writing (Model -> any format)

```
Model.write(writer)
  --> Writer.write(model)
    --> model.toDTO() converts to DTO
    --> Serializes DTO to target format string
  --> returns string
```

### CLI conversion

```
sc-convert --from markdown --to json --type feature input.md --output out.json
  --> parseArgs()
  --> SteelCompendiumIdentifier.parse(from, type) -> reader
  --> reader.read(fileContents) -> model
  --> writer.write(model) -> outputString
  --> write to file or stdout
```

## Dependencies

| Dependency | Purpose | Why this one |
|------------|---------|-------------|
| ajv | JSON Schema validation | Industry standard JSON Schema validator for JS |
| fast-xml-parser | XML parsing (legacy) | Still in dependencies but XML support removed in 1.0.0 |
| gray-matter | YAML frontmatter extraction from Markdown | Standard frontmatter parser, used by Markdown readers |
| js-yaml | YAML parsing/serialization | Mature YAML library for Node.js |
| yaml | YAML parsing (v2) | Used alongside js-yaml for certain operations |
| typescript | TypeScript compiler | Language of the project |
| jest / ts-jest | Testing framework | Standard TypeScript testing stack |

## Extension Points

- **To add a new model type:** Create model in `src/model/`, DTO in `src/dto/`, add Markdown reader/writer in `src/io/markdown/`, register in `SteelCompendiumIdentifier.parse()`, and export from barrel files.
- **To add a new serialization format:** Create a reader extending `IDataReader<M>` and writer extending `IDataWriter<M>` in a new `src/io/{format}/` directory. Register in `SteelCompendiumIdentifier` and update `sc-convert`.
- **To add a new JSON Schema:** Add `.schema.json` file in `src/schema/`, register it in `src/validation/validator.ts`, and update the build script to copy it to `dist/schema/`.

## Constraints

- Build outputs CommonJS only (`module: commonjs` in tsconfig)
- JSON Schemas are copied to `dist/schema/` as a post-build step (not compiled)
- Markdown format is project-specific and not a standard -- readers/writers are tightly coupled to the Steel Compendium Markdown conventions
