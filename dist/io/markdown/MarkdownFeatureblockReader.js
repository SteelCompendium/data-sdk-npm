"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownFeatureblockReader = void 0;
const gray_matter_1 = __importDefault(require("gray-matter"));
const IDataReader_1 = require("../IDataReader");
const Featureblock_1 = require("../../model/Featureblock");
const steel_compendium_sdk_1 = require("steel-compendium-sdk");
const model_1 = require("../../model");
class MarkdownFeatureblockReader extends IDataReader_1.IDataReader {
    constructor() {
        super(...arguments);
        this.abilityReader = new steel_compendium_sdk_1.MarkdownAbilityReader();
    }
    read(source) {
        var _a, _b, _c;
        const { data: fm, content } = (0, gray_matter_1.default)(source);
        // 1) Title & inline meta (name, level, type)
        const title = (_a = this.findFirstHeader(content)) !== null && _a !== void 0 ? _a : String((_c = (_b = fm === null || fm === void 0 ? void 0 : fm.item_name) !== null && _b !== void 0 ? _b : fm === null || fm === void 0 ? void 0 : fm.title) !== null && _c !== void 0 ? _c : "").trim();
        if (!title) {
            throw new Error("FeatureblockMarkdownReader: could not find a title/header.");
        }
        const { name, level, type } = this.parseTitle(title);
        // 2) Slice content into pre-feature (flavor / stats) and features (blockquote groups)
        const blocks = this.splitIntoBlocks(content);
        const preFeature = blocks.pre.trim();
        const featureBlocks = blocks.blocks;
        // 3) Stats bullets → top-level + stats[]
        const statsBullets = this.extractStatsBullets(preFeature);
        const ev = this.pickStat(statsBullets, "EV");
        const stamina = this.pickStat(statsBullets, "Stamina");
        const size = this.pickStat(statsBullets, "Size");
        // Remaining non-core bullets → stats[]
        const coreKeys = new Set(["ev", "stamina", "size"]);
        const extras = statsBullets.filter(kv => !coreKeys.has(normalizeKey(kv.key)));
        // 4) Flavor (preFeature without the bullet list)
        const flavor = this.extractFlavor(preFeature);
        // 5) Feature callouts (blockquote groups) → Ability[]
        const features = featureBlocks.map(md => this.abilityReader.read(md));
        return new Featureblock_1.Featureblock({
            name,
            type,
            level,
            ev,
            stamina,
            size,
            flavor: flavor || undefined,
            stats: extras.length ? extras.map(kv => new model_1.FeatureStat(kv.key, kv.value)) : [],
            features,
        });
    }
    // ----- helpers -----
    findFirstHeader(md) {
        // prefer the first non-frontmatter header (any level)
        const m = md.match(/^(#{1,6})\s+(.+?)\s*$/m);
        return m ? m[2].trim() : null;
    }
    parseTitle(title) {
        // Examples:
        // "Pressure Plate (Level 1 Trigger Support)" -> name="Pressure Plate", level=1, type="Trigger Support"
        // "Tree of Might (Level 5 Hazard Hexer)"     -> name="Tree of Might", level=5, type="Hazard Hexer"
        // "Ajax's Malice (Malice Features)"          -> name="Ajax's Malice", type="Malice Features"
        const paren = title.match(/^(.*)\s*\(([^)]+)\)\s*$/);
        if (!paren)
            return { name: title.trim() };
        const base = paren[1].trim();
        const inside = paren[2].trim();
        const lvl = inside.match(/Level\s+(\d+)\s*(.*)$/i);
        if (lvl) {
            const level = parseInt(lvl[1], 10);
            const tail = (lvl[2] || "").trim();
            const type = tail || undefined;
            return { name: base, level: Number.isFinite(level) ? level : undefined, type };
        }
        return { name: base, type: inside };
    }
    splitIntoBlocks(md) {
        // We treat contiguous blockquote groups (lines beginning with '>') as one feature block.
        // HTML comments like <!-- --> may separate groups; we ignore them but preserve grouping.
        const lines = md.split(/\r?\n/);
        // Skip up to & including the first header line – we only want the body
        let i = 0;
        while (i < lines.length && !/^#{1,6}\s+/.test(lines[i]))
            i++;
        if (i < lines.length)
            i++; // skip the header line itself
        const preLines = [];
        const blocks = [];
        let buf = [];
        let insideBQ = false;
        const flush = () => {
            if (buf.length) {
                // keep only lines beginning with '>' or '>' + space, strip leading '>'
                const bq = buf
                    .map(l => l.replace(/^>\s?/, ""))
                    .join("\n")
                    .trim();
                if (bq)
                    blocks.push(bq);
                buf = [];
            }
        };
        for (; i < lines.length; i++) {
            const line = lines[i];
            if (/^\s*<!--.*?-->\s*$/.test(line)) {
                // comment; treat as separator if we were inside a blockquote
                if (insideBQ) {
                    flush();
                    insideBQ = false;
                }
                else {
                    preLines.push(line);
                }
                continue;
            }
            if (/^\s*>/.test(line)) {
                buf.push(line);
                insideBQ = true;
            }
            else {
                if (insideBQ) {
                    // blockquote ended
                    flush();
                    insideBQ = false;
                }
                preLines.push(line);
            }
        }
        // tail
        if (insideBQ)
            flush();
        return { pre: preLines.join("\n"), blocks };
    }
    extractStatsBullets(md) {
        // Matches bullets like: - **EV:** 2
        // Also allows other keys e.g. "Typical Space", "Link", "Immunity", etc.
        const out = [];
        const re = /^-\s*\*\*([^*]+?):\*\*\s*(.+?)\s*$/gm;
        let m;
        while ((m = re.exec(md)) !== null) {
            out.push({ key: cleanupKey(m[1]), value: m[2].trim() });
        }
        return out;
        function cleanupKey(k) {
            return k.replace(/\s+/g, " ").trim();
        }
    }
    pickStat(stats, key) {
        const k = normalizeKey(key);
        const hit = stats.find(s => normalizeKey(s.key) === k);
        return hit === null || hit === void 0 ? void 0 : hit.value;
    }
    extractFlavor(pre) {
        // Flavor is the paragraph(s) after the header and before the first bullet list
        // Remove frontmatter-ish comments and blank lines around
        const body = pre.replace(/^\s*<!--.*?-->\s*$/gm, "").trim();
        // If there are bullets, cut them off
        const idx = body.search(/^\s*-\s+\*\*/m);
        const flavor = idx >= 0 ? body.slice(0, idx) : body;
        return flavor.trim();
    }
}
exports.MarkdownFeatureblockReader = MarkdownFeatureblockReader;
// small helpers
function normalizeKey(k) {
    return k.replace(/\s+/g, " ").trim().toLowerCase();
}
//# sourceMappingURL=MarkdownFeatureblockReader.js.map