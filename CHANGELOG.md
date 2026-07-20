# Changelog

## Unreleased

## 3.0.0

First **3.x** release. Versions 3.0.0, 3.1.0, and 3.2.0 were developed but never
published to npm (the published `latest` was 2.2.0), so their changes are
consolidated here into this single 3.0.0 entry.

**For existing consumers:** this is a major (breaking) bump from 2.2.0. If you depend
on a released version — a caret/tilde range (`^2.2.0`, `~2.2.0`), an exact pin, or a
dist-tag — you are **not** affected until you deliberately upgrade to `3.x`; npm will
not pull a new major into a `2.x` range. (Only a floating `*`/`latest` dependency, or
depending on the git branch directly, would pick this up automatically.) Read the
BREAKING items below before upgrading.

### Breaking

- Statblock field rename: `roles: string[]` and `ancestry: string[]` are **removed**,
  replaced by `role: string`, `organization: string`, and `keywords: string[]`. A
  Draw Steel statblock has exactly one combat role (Ambusher, Artillery, Brute,
  Controller, Defender, Harrier, Hexer, Mount, Support) and one organization tier
  (Minion, Horde, Platoon, Elite, Solo, Leader); the old `roles` array conflated those
  two single-valued axes, so this split is a normalization. `keywords` remains an array
  (creatures genuinely carry multiple keywords, e.g. "Human, Humanoid"). Schema `$id`
  bumped to `statblock.schema.json-3.0.0`; `required` grew to include `level`, `role`,
  `organization`, `keywords`.
- Statblock schema moved from JSON Schema **draft-07 to 2019-09**, and
  `additionalProperties: false` became `unevaluatedProperties: false`. The SDK's
  validator now instantiates Ajv from `ajv/dist/2019` — external validation against SDK
  schemas needs a 2019-09-capable Ajv.
- `FeatureDTO.name` is now optional (`name!: string` → `name?: string`), matching the
  model (optional since 1.0.0). Type-level break for DTO consumers reading `.name`
  unguarded.

### New models & schemas

- Ten new model families, each with DTO + JSON schema + validator registration:
  `Ancestry`, `Career`, `Class`, `Complication`, `Condition`, `Culture`, `Kit`,
  `Perk`, `Title`, `Treasure`.
- Featureblock schema registered in the SDK exports and validator (the model existed
  since 1.0.0 but was missing from `./schema` and the validator registry).

### Field additions (parity with what the steel-etl pipeline already emits)

- Statblock: optional `cost` (a summon's Essence cost, distinct from EV — Summoner
  book), optional `flavor` (read-aloud text), and fixture fields `statblock_kind`
  (`"fixture"`; non-creature variants that use the loose 2-column stat header and render
  via the featureblock path) and `terrain_type` (fixture classifier from the italic
  role line, e.g. `"Hazard"`).
- Featureblock: `intro` on the `richFeature` shape — lead-in prose before a feature's
  power roll/spec table (e.g. "As a maneuver, … make a **Might test**."), distinct from
  `body` (passive prose) and `trailing` (post-table notes).
- Card-data parity: `flavor` on Culture and Perk; `echelon` on Treasure;
  `Treasure.project_goal` now accepts a string or number (the ETL emits annotated goals
  like `"45 (yields 1d3 darts)"`).

### Fixes

- Declare the top-level `scc` key (optional `string`) on the ten entity
  schemas/DTOs/models where steel-etl emits it at the entity root — `Ancestry`,
  `Career`, `Class`, `Complication`, `Condition`, `Culture`, `Kit`, `Perk`, `Title`,
  `Treasure`. Previously undeclared, so every strict (`unevaluatedProperties: false`)
  validation of a real generated file failed on its own SCC code (data-sdk-npm#13).
  `Feature`/`Featureblock`/`Statblock` are unaffected — they already carry `scc` inside
  the untyped `metadata` object.
- `MarkdownStatblockReader` now warns (instead of silently dropping) when a statblock's
  organization/role cell contains more than one non-organization token, since a
  statblock is expected to have exactly one role.

### Internal

- `MarkdownStatblockReader` / `SteelCompendiumIdentifier` rework: the sc-md reader
  derives `organization`/`role` from the header row against the fixed organization
  set (MINION/HORDE/PLATOON/ELITE/SOLO/LEADER).

## 2.2.0

- Adds support for subtrait

## 2.1.5

- Fixes parsing of Feature effects with nested features

## 2.1.4

- Updates to publish the schemas

## 2.1.0

- Adds `--version` flag to `sc-convert`

## 2.0.0

- Adds `ability_type` to the Feature model (`Signature`, `Heroic`)
- [BREAKING] Parsing Features with `cost` of `Signature Ability` or `Villain Acton *` now populate the `ability_type` field instead
  - Unfortunately, this is technically a breaking change.  Sorry this didnt get bundled in the 1.0.0 release.

## 1.0.0

- [BREAKING] The `Ability` and `Trait` models have merged together into a `Feature` model.  Turns out an `Ability` is a superset of `Trait` and differentiating them in code isnt very useful and adds complexity.
  - New `feature_type` field added to differentiate between a trait and ability 
-  All models are getting a top-level `type` field that declares if its a `Feature`, `Featureblock`, or `Statblock`
- [BREAKING] Models with an existing `type` field had it renamed.  
  - Featureblock's `type` field renamed to `featureblock_type`
  - Ability's `type` field (for `Main Action`, `Maneuver`, etc) has been renamed to `usage`
- [BREAKING] The `traits` and `abilities` fields are replaced with a single `features` field
- [BREAKING] The `PowerRollEffect`, `TestEffect`, `MundaneEffect`, etc models are all getting merged together.  After parsing all the abilities in the final pdf release, its clear that Effects can come in a ton of different permutations and differentiating them isnt useful and just adds complexity.  
  - Now there is a single `Effect` class which supports any permutation of the effect fields
- The `Effect` model supports the `features` field which will add support for Features that grant abilities
- `t1`, `t2`, and `t3` are getting renamed to `tier1`, `tier2`, and `tier3`
  - Reading in alternate forms (`t1`, `≤11`, etc) is still supported
- [BREAKING] `meleeDistance` and `rangedDistance` are removed from the Statblock model.  These were cut from the final pdf.
- [BREAKING] Support for xml has been removed across the board.  Juice to maintain it isnt worth the squeeze.
- The Feature (previously Ability) model's `name` field is now optional (to support unnamed features nested under an Effect)
- Fixes to the Identifier to function better
- Schema updates to account for the above changes
- The `metadata` field is added to all models

## 0.0.44

- Adds bin dir to package files

## 0.0.43

- Adds leniency for effects without colons

## 0.0.42

- Properly exports `MarkdownFeatureblockWriter` and `MarkdownFeatureblockReader`

## 0.0.41

- Updates Ability reader to handle name+cost effects better

## 0.0.40

- Avoids empty `stats` array in Featureblocks
- [DEPRECATION] The XML format is Deprecated and scheduled for removal in `1.0.0` release
  - If there is a need for xml, the user likely needs it in a highly specific format for their use case and will likely
    need to convert from our data format any.  Since XML is annoying to build for, we are just going to drop support for
    it until a significant demand for it is made.  Let us know if you have a need for XML.

## 0.0.39

- Corrects bug that produced empty `name` for abilities

## 0.0.38

- Adds support for Featureblocks
- Ability and Traits now support the `icon` (`string`) field!
- Lots of bugfixes with serialization
- Minor fix to identification (its still not good)

## 0.0.37

- Corrects a bug with TestEffects being parsed with the name in the effect
- TestEffects now support a `name` and `cost` field
- Effects with name "Effect" are no longer parsed without populating the `name` field

## 0.0.36

- Adds a new "Effect" type: Test Effects
  - Use case is to handle abilities with an effect where the target rolls a Power Roll. Like this:

```markdown
> ☠️ **Howl (Villain Action 1)**
>
> | **Area**       |                         **-** |
> | -------------- | ----------------------------: |
> | **📏 5 burst** | **🎯 Each enemy in the area** |
>
> **Effect:** Each target makes an Intuition test.
>
> - **≤11:** The target must move their speed in a straight line away from the werewolf; frightened (save ends)
> - **12-16:** Frightened (EoT)
> - **17+:** No effect
```

## 0.0.35

- Villain action moved to cost
- Support for writing icons in markdown
- Readers/writers updated to support new format
- Test data updated

## 0.0.34

- Adds support for `sc-convert` to convert statblocks (except xml)

## 0.0.33

- Updates the markdown reader/writer to support the new format

## 0.0.31

- Markdown ability reader updated to support titles as low as H3

## 0.0.30

- When converting to xml, corrects extension to `.xml`

## 0.0.29

- Correctly exports xml package

## 0.0.28

- Adds support for metadata in abilities

## 0.0.27

- Adds support for reader/writing abilities as XML

## 0.0.26

- Wires in the Identifier to automatically figure out the model in `sc-convert`

## 0.0.25

- `sc-convert` will properly ignore `index.md` files regardless of casing

## 0.0.24

- Better handling of "feature"-type abilities

## 0.0.23

- Ignores `index.md` files in `sc-convert` cli

## 0.0.22

- Adds cli utility `sc-convert`

## 0.0.21

- Changes `stamina` field to a string because the Familiar statblock

## 0.0.20

- Adds new fields to statblocks:
  - movement (string)
  - melee distance (integer)
  - ranged distance (integer)

## 0.0.19

- Adds support for markdown reading/writing for abilities and statblocks

## 0.0.17

- Extractor updated to improve truncating statblocks

## 0.0.16

- Fixes issue in removing OCR errors in certain strings

## 0.0.15

- Adds `PrereleasePdfStatblockExtractor` to extract statblocks from pdf texts

## 0.0.14

- Schema + docs cleanup
  - The `type` field in `Trait` is removed