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
                        statblockStarts.push({ name: statblock.name, index });
                    }
                }
                catch (e) {
                    // Not a valid statblock header, ignore
                }
            }
        });
        return statblockStarts.map(({ index }, i) => {
            const start = index;
            const nextStatblockStart = i < statblockStarts.length - 1 ? statblockStarts[i + 1].index : lines.length;
            let end = nextStatblockStart;
            for (let j = start + 1; j < nextStatblockStart; j++) {
                const line = lines[j].trim();
                if (line.length === 0) {
                    continue;
                }
                const isAllCaps = line.toUpperCase() === line && /[A-Z]/.test(line);
                const isStatblockHeader = statblockHeaderRegex.test(line);
                if (isAllCaps && !isStatblockHeader) {
                    end = j;
                    break;
                }
            }
            const block = lines
                .slice(start, end)
                .filter(line => !line.includes("MCDM Productions"))
                .join("\n");
            return block;
        });
    }
}
exports.PrereleasePdfStatblockExtractor = PrereleasePdfStatblockExtractor;
//# sourceMappingURL=PrereleasePdfStatblockExtractor.js.map