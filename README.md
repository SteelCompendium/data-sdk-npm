# data-sdk-npm

This repo is a suite of utilities for working with structured Draw Steel data.  

- The repo itself is an npm package: [npmjs.com - steel-compendium-sdk](https://www.npmjs.com/package/steel-compendium-sdk)
  - [Typescript Models](src/model)
  - Readers and Writers (Serialization)
    - JSON
    - YAML
    - Markdown (Steel Compendium format)
- Schemas
  - [Ability JSON Schema](src/schema/ability.schema.json) ([Documentation](src/schema/ability.schema.md))
  - [Statblock JSON Schema](src/schema/statblock.schema.json) ([Documentation](src/schema/statblock.schema.md))

This code is also the backbone of the [Draw Steel Web Adapter](https://steelcompendium.io/web-adapter/) ([sourcecode](https://github.com/SteelCompendium/web-adapter))

Please use this [form to report bugs](https://docs.google.com/forms/d/e/1FAIpQLSc6m-pZ0NLt2EArE-Tcxr-XbAPMyhu40ANHJKtyRvvwBd2LSw/viewform?usp=sharing&ouid=105036387964900154878) if you find them!

## Development

### Quick Start 

- Test: `npm run test`
- Publish version
  - Update `CHANGELOG.md` with release notes
  - Update `pacakge.json` with new version
  - `npm publish`

Run the `sc-convert` cli tool with:
```bash
npm run build && npm link && sc-convert --from json --to xml ./src/__tests__/data/ability/dto-json/blessing_of_the_blade.json --output ./tmp
```

### Future work

- Update Markdown standard to be compliant with changes from the final DS PDF
- Add XML support (reader, writer, schema, validator)
- Validator support for yaml
- Support more models?  (Let me know what you need)
