test:
    npm run build && npm run test

# Checks: NPM_PAT is set (.npmrc reads the token from it), npm accepts it, and its user
# has read-write access to this package. `release` runs this first, so the common auth
# failures stop before any git change. Can't detect a read-only granular token or a
# publish-time 2FA prompt short of publishing; `release` handles those by publishing
# before it pushes.
#
# Verifies npm auth can publish this package (run automatically by `release`)
check-auth:
    #!/usr/bin/env bash
    set -euo pipefail
    pkg="$(jq -r .name package.json)"
    if [[ -z "${NPM_PAT:-}" ]]; then
        echo >&2 "Auth check failed: NPM_PAT is not set (.npmrc reads the publish token from it)."
        echo >&2 "  Create a token at https://www.npmjs.com/settings/~/tokens, then: export NPM_PAT=<token>"
        exit 1
    fi
    if ! user="$(npm whoami 2>/dev/null)"; then
        echo >&2 "Auth check failed: npm rejected NPM_PAT (expired or revoked?)."
        echo >&2 "  Regenerate it at https://www.npmjs.com/settings/~/tokens, then: export NPM_PAT=<token>"
        exit 1
    fi
    access="$(npm access list collaborators "$pkg" "$user" --json 2>/dev/null | jq -r --arg u "$user" '.[$u] // empty')"
    if [[ "$access" != "read-write" ]]; then
        echo >&2 "Auth check failed: npm user '$user' has '${access:-no}' access to $pkg; publishing needs read-write."
        exit 1
    fi
    echo >&2 "npm auth OK: $user can publish $pkg"

# Creates a release (make sure changelog is already setup)
release version: check-auth
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ `git status --porcelain` ]]; then
        echo "Cannot release: 'git status' is not clean.  Commit/push or stash changes first"
        exit 1
    fi
    # The push runs AFTER the publish, so it must not be able to fail on a stale branch.
    if ! git rev-parse --abbrev-ref '@{u}' >/dev/null 2>&1; then
        echo >&2 "Cannot release: branch '$(git branch --show-current)' has no upstream to push to."
        exit 1
    fi
    git fetch --quiet
    if [[ "$(git rev-list --count 'HEAD..@{u}')" != 0 ]]; then
        echo >&2 "Cannot release: branch is behind its upstream. Pull first."
        exit 1
    fi
    jq '.version = "{{version}}"' package.json > tmp.json && mv tmp.json package.json
    git add .
    git commit --allow-empty -am "Prepares for release '{{version}}'"
    # Publish BEFORE pushing: if npm refuses (403, 2FA, version already taken), drop the
    # local release commit so nothing half-released reaches origin.
    if ! npm publish; then
        git reset --keep HEAD~1
        echo >&2 "npm publish failed; dropped the local release commit. Nothing was pushed."
        exit 1
    fi
    if ! git push; then
        echo >&2 "Published {{version}} to npm, but git push failed. Push the release commit by hand."
        exit 1
    fi

# features
convert_test_features_from_md_to_json:
    rm -rf "./tmp"
    just convert markdown json feature "src/__tests__/data/feature/sc-md" "./tmp"

convert_test_features_from_md_to_yaml:
    rm -rf "./tmp"
    just convert markdown yaml feature "src/__tests__/data/feature/sc-md" "./tmp"

# statblocks
convert_statblocks_from_json_to_md:
    rm -rf "./tmp"
    just convert json markdown statblock "src/__tests__/data/statblock/dto-json" "./tmp"

convert_test_statblocks_from_md_to_json:
    rm -rf "./tmp"
    just convert markdown json statblock "src/__tests__/data/statblock/sc-md" "./tmp"

convert_test_statblocks_from_md_to_yaml:
    rm -rf "./tmp"
    just convert markdown yaml statblock "src/__tests__/data/statblock/sc-md" "./tmp"

# Featureblocks
convert_test_featureblocks_from_md_to_json:
    rm -rf "./tmp"
    just convert markdown json featureblock "src/__tests__/data/featureblock/sc-md" "./tmp"

convert_test_featureblocks_from_md_to_yaml:
    rm -rf "./tmp"
    just convert markdown yaml featureblock "src/__tests__/data/featureblock/sc-md" "./tmp"

# generic
convert from to type input_dpath output_dpath:
    #!/usr/bin/env bash
    set -euo pipefail
    echo >&2 "Converting from '{{from}}' to '{{to}}'"
    echo >&2 "    input dir:  '{{input_dpath}}'"
    echo >&2 "    output dir: '{{output_dpath}}'"
    npm run build
    npm link
    mkdir -p "{{output_dpath}}"
    find "{{input_dpath}}" -type f | while read -r fpath; do
        file_name=$(basename "$fpath")
        name="${file_name%.*}"
        sc-convert --from "{{from}}" --to "{{to}}" --type "{{type}}" --output "{{output_dpath}}/${name}.{{to}}" "$fpath"
    done

