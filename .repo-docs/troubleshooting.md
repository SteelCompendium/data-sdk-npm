# Troubleshooting

## Do NOT

- **Do NOT** use `SteelCompendiumIdentifier.identify()` for production code -- the auto-detection logic is known to be flawed (see TODO in source). Use `SteelCompendiumIdentifier.parse(format, type)` with explicit format and type instead.
- **Do NOT** assume Markdown format is standard Markdown -- the readers/writers expect a very specific Steel Compendium blockquote/table format. Generic Markdown will not parse.
- **Do NOT** import from `src/` paths -- always import from the package exports (`steel-compendium-sdk`, `steel-compendium-sdk/model`, etc.)
- **Do NOT** delete `package-lock.json` -- it's gitignored, but if present locally it keeps dependency versions stable during development.

## Common Errors

### `npm publish` returns 403 or 404

**Cause:** The `NPM_PAT` environment variable is missing, expired, or doesn't have publish permissions.

**Fix:**
```sh
# Generate a new PAT at https://www.npmjs.com/settings/~/tokens
# Then set it:
export NPM_PAT=<your-token>
# The .npmrc file reads this variable automatically
```

### `Cannot release: 'git status' is not clean`

**Cause:** The `just release` command requires a clean git working tree.

**Fix:**
```sh
git add . && git commit -m "chore: pre-release cleanup"
# Or stash changes:
git stash
just release <version>
git stash pop
```

### Schema files missing from `dist/`

**Cause:** The build step copies schemas with `cp src/schema/*.json dist/schema/`. If `dist/schema/` doesn't exist or the build was interrupted, schemas won't be present.

**Fix:**
```sh
rm -rf dist && npm run build
```

### Markdown reader returns unexpected results

**Cause:** The Markdown format is very specific. Common issues:
- Missing frontmatter (`---` delimiters)
- Wrong heading level (feature titles need to match expected patterns)
- Missing blockquote markers (`>`) around statblock content

**Fix:** Compare input against known-good fixtures in `src/__tests__/data/`.

## FAQs

### What formats does sc-convert support?

JSON, YAML, and Markdown. XML was removed in v1.0.0.

### How do I know which model type my data is?

Check for these indicators:
- **Statblock:** has `stamina` + `level` fields, or Markdown contains `<br>Might`
- **Featureblock:** has `featureblock_type` field, or Markdown contains `- **EV:**`
- **Feature:** has `effects`, `cost`, or `feature_type` fields
- **Content types** (Ancestry, Career, Class, Complication, Condition, Culture, Kit, Perk, Title, Treasure): have a `type` field set to the type name (e.g., `"type": "class"`). Use `SteelCompendiumIdentifier.parse(format, type)` with the explicit type string for reliable detection.
