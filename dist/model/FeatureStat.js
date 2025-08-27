"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureStat = void 0;
class FeatureStat {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
    static fromDTO(data) {
        return new FeatureStat(data.name, data.value);
    }
    toDTO() {
    }
}
exports.FeatureStat = FeatureStat;
//# sourceMappingURL=FeatureStat.js.map