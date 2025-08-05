convert_statblocks_from_json_to_md:
    just convert json markdown "src/__tests__/data/statblock/dto-json" "./tmp"

convert from to input_dpath output_dpath:
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
        sc-convert --from "{{from}}" --to "{{to}}" --output "{{output_dpath}}/${name}.{{to}}" "$fpath"
    done

