"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrereleasePdfStatblockExtractor = void 0;
const PrereleasePdfStatblockReader_1 = require("./PrereleasePdfStatblockReader");
class PrereleasePdfStatblockExtractor {
    constructor() {
        this.statblockReader = new PrereleasePdfStatblockReader_1.PrereleasePdfStatblockReader();
    }
    extract(text) {
        const statblocks = this.extractText(text);
        return statblocks.map(this.statblockReader.read);
    }
    extractText(text) {
        const lines = text.split(/\r?\n/);
        const statblockStarts = [];
        const statblockHeaderRegex = /l\s?evel\s+\d+[^\+]/i;
        lines.forEach((line, index) => {
            var _a;
            if (statblockHeaderRegex.test(line)) {
                // To be a statblock header, it must also have a name
                const lineWithNext = line + "\n" + ((_a = lines[index + 1]) !== null && _a !== void 0 ? _a : "");
                try {
                    const statblock = this.statblockReader.read(lineWithNext);
                    if (statblock.name && statblock.roles.length > 0) {
                        // const existing = statblockStarts.find(s => s.name === statblock.name);
                        // if (!existing) {
                        statblockStarts.push({ name: statblock.name, index });
                        // }
                    }
                }
                catch (e) {
                    // Not a valid statblock header, ignore
                }
            }
        });
        return statblockStarts.map(({ name, index }, i) => {
            const start = index;
            const end = i < statblockStarts.length - 1 ? statblockStarts[i + 1].index : lines.length;
            const block = lines.slice(start, end).join("\n");
            return block;
        });
    }
}
exports.PrereleasePdfStatblockExtractor = PrereleasePdfStatblockExtractor;
//# sourceMappingURL=PrereleasePdfStatblockExtractor.js.map