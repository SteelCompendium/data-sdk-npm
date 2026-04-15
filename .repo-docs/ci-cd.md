# CI/CD and Release

## Build Process

```sh
# Full build (compiles TypeScript + copies schemas to dist/)
npm run build

# This runs: tsc && mkdir -p dist/schema && cp src/schema/*.json dist/schema/
```

### Build Artifacts

| Artifact | Location | Purpose |
|----------|----------|---------|
| Compiled JS + type declarations | `dist/` | npm package distribution |
| JSON Schemas | `dist/schema/` | Shipped with the npm package for consumers |

## Branch Strategy

| Branch | Purpose | Protection |
|--------|---------|------------|
| `main` | Production-ready, published code | -- |
| Feature branches | `cli`, `featureBlock`, `format-v2`, `metadata`, `v2`, `xml` | None |

No CI pipeline detected in the repo. Build and test are run manually.

## Release Process

### Versioning

- **Scheme:** semver (3.0.0)
- **Current version source:** `package.json` `version` field

### Creating a Release

Prerequisites: `NPM_PAT` environment variable must be set (see `.npmrc`).

1. Ensure `git status` is clean (no uncommitted changes)
2. Update `CHANGELOG.md` with release notes
3. Run:
   ```sh
   just release <version>
   ```
   This does:
   - Updates version in `package.json`
   - Commits: `Prepares for release '<version>'`
   - Pushes to origin
   - Runs `npm publish`

### Manual Release (without just)

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. `git add . && git commit -m "Prepares for release '<version>'"`
4. `git push`
5. `npm publish`

### Rollback

1. `npm unpublish steel-compendium-sdk@<version>` (within 72 hours)
2. Or publish a patch version with the fix
