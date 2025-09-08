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

