"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownFeatureblockWriter = void 0;
const IDataWriter_1 = require("../IDataWriter");
const MarkdownAbilityWriter_1 = require("./MarkdownAbilityWriter");
class MarkdownFeatureblockWriter extends IDataWriter_1.IDataWriter {
    constructor() {
        super(...arguments);
        this.abilityWriter = new MarkdownAbilityWriter_1.MarkdownAbilityWriter();
    }
    write(data) {
        var _a, _b;
        const parts = [];
        // 1) Title: "###### Name (Level X Type)" | "###### Name (Type)" | "###### Name"
        const meta = [];
        if (isFiniteNum(data.level))
            meta.push(`Level ${data.level}`);
        if (data.type && data.type.trim())
            meta.push(data.type.trim());
        const title = meta.length ? `${data.name} (${meta.join(" ")})` : data.name;
        parts.push(`###### ${title}`);
        // 2) Optional flavor (before stats)
        if (data.flavor && data.flavor.trim()) {
            parts.push("");
            parts.push(data.flavor.trim());
        }
        // 3) Stats bullets
        const bullets = [];
        if (truthy(data.ev))
            bullets.push(["EV", String(data.ev).trim()]);
        if (truthy(data.stamina))
            bullets.push(["Stamina", String(data.stamina).trim()]);
        if (truthy(data.size))
            bullets.push(["Size", String(data.size).trim()]);
        (_a = data.stats) === null || _a === void 0 ? void 0 : _a.forEach(s => bullets.push([s.name, s.value]));
        // type KV = Record<string, unknown>;
        //
        // // Normalize to an array of objects
        // const statsArr: KV[] = Array.isArray(data.stats)
        //     ? (data.stats as KV[])
        //     : data.stats && typeof data.stats === "object"
        //         ? [data.stats as KV]
        //         : [];
        //
        // const core = new Set(["ev", "stamina", "size"]);
        //
        // const extras: Array<[string, string]> = [];
        // for (const obj of statsArr) {
        //     for (const [k, v] of Object.entries(obj)) {
        //         const nk = normalizeKey(k);
        //         if (core.has(nk)) continue;
        //
        //         const val = toInline(v);
        //         if (!val) continue;
        //
        //         extras.push([k, val]);
        //     }
        // }
        // // Sort extras by key for stable output
        // extras.sort((a, b) => a[0].localeCompare(b[0]));
        //
        // const allStats = bullets.concat(extras);
        if (bullets.length) {
            parts.push("");
            for (const [k, v] of bullets) {
                parts.push(`- **${k}:** ${v}`);
            }
        }
        // 4) Features (each as a contiguous blockquote group)
        if (((_b = data.features) !== null && _b !== void 0 ? _b : []).length) {
            for (const ability of data.features) {
                parts.push("");
                parts.push("<!-- -->");
                parts.push(this.abilityWriter.write(ability, true).trimEnd());
            }
        }
        return parts.join("\n").trimEnd() + "\n";
    }
}
exports.MarkdownFeatureblockWriter = MarkdownFeatureblockWriter;
/* -------------------------- helpers -------------------------- */
function isFiniteNum(n) {
    return typeof n === "number" && Number.isFinite(n);
}
function truthy(v) {
    return !(v === undefined || v === null || (typeof v === "string" && v.trim() === ""));
}
function toInline(v) {
    if (v === null || v === undefined)
        return "";
    if (Array.isArray(v))
        return v.map(toInline).filter(Boolean).join(", ");
    if (typeof v === "object") {
        // keep it compact but readable
        try {
            return JSON.stringify(v);
        }
        catch (_a) {
            return String(v);
        }
    }
    return String(v).trim();
}
function normalizeKey(k) {
    return k.replace(/\s+/g, " ").trim().toLowerCase();
}
//# sourceMappingURL=MarkdownFeatureblockWriter.js.map