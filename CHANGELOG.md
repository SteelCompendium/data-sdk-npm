# Changelog

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