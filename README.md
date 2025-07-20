# data-sdk-npm

This repo is a suite of utilities for working with structured Draw Steel data.  

- The repo itself is an npm package: [steel-compendium-sdk](https://www.npmjs.com/package/steel-compendium-sdk)
  - [Typescript Models](src/model)
  - Readers and Writers (Serialization)
    - JSON
    - YAML
    - Markdown (Steel Compendium format)
- Schemas
  - [Ability JSON Schema](src/schema/ability.schema.json) ([Documentation](src/schema/ability.schema.md))
  - [Statblock JSON Schema](src/schema/statblock.schema.json) ([Documentation](src/schema/statblock.schema.md))

This code is also the backbone of the [Draw Steel Web Adapter](https://steelcompendium.io/web-adapter/) ([sourcecode](https://github.com/SteelCompendium/web-adapter))

## Future work

- Update Markdown standard to be compliant with changes from the final DS PDF
- Add XML support (reader, writer, schema, validator)
- Validator support for yaml
- Support more models?  (Let me know what you need)