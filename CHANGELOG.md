# Changelog

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