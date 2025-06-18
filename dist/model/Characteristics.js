"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Characteristics = void 0;
const yaml_1 = require("yaml");
class Characteristics {
    constructor(might, agility, reason, intuition, presence) {
        this.might = might;
        this.agility = agility;
        this.reason = reason;
        this.intuition = intuition;
        this.presence = presence;
    }
    static from(data) {
        return new Characteristics(data.might ? data.might : 0, data.agility ? data.agility : 0, data.reason ? data.reason : 0, data.intuition ? data.intuition : 0, data.presence ? data.presence : 0);
    }
    static fromYaml(yaml) {
        return Characteristics.from((0, yaml_1.parse)(yaml));
    }
    static fromJson(json) {
        return Characteristics.from(JSON.parse(json));
    }
    toYaml() {
        return (0, yaml_1.stringify)(this);
    }
    toJson() {
        return JSON.stringify(this);
    }
}
exports.Characteristics = Characteristics;
//# sourceMappingURL=Characteristics.js.map