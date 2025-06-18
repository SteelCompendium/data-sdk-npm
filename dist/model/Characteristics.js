"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Characteristics = void 0;
class Characteristics {
    constructor(might, agility, reason, intuition, presence) {
        this.might = might;
        this.agility = agility;
        this.reason = reason;
        this.intuition = intuition;
        this.presence = presence;
    }
    static fromStatblockDTO(dto) {
        var _a, _b, _c, _d, _e;
        return new Characteristics((_a = dto.might) !== null && _a !== void 0 ? _a : 0, (_b = dto.agility) !== null && _b !== void 0 ? _b : 0, (_c = dto.reason) !== null && _c !== void 0 ? _c : 0, (_d = dto.intuition) !== null && _d !== void 0 ? _d : 0, (_e = dto.presence) !== null && _e !== void 0 ? _e : 0);
    }
}
exports.Characteristics = Characteristics;
//# sourceMappingURL=Characteristics.js.map