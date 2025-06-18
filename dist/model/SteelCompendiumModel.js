"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteelCompendiumModel = void 0;
class SteelCompendiumModel {
    static read(reader, source) {
        return reader.read(source);
    }
    write(writer) {
        return writer.write(this);
    }
    toJson() {
        const { JsonWriter } = require("../io");
        return this.write(new JsonWriter());
    }
    toYaml() {
        const { YamlWriter } = require("../io");
        return this.write(new YamlWriter());
    }
}
exports.SteelCompendiumModel = SteelCompendiumModel;
//# sourceMappingURL=SteelCompendiumModel.js.map