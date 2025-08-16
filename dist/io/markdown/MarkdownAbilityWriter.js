"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownAbilityWriter = void 0;
const Effect_1 = require("../../model/Effect");
const model_1 = require("../../model");
const model_2 = require("../../model");
const yaml = __importStar(require("js-yaml"));
class MarkdownAbilityWriter {
    write(data, for_statblock = false) {
        // Basically trying to differentiate abilities and features here. If there are keywords, its an ability
        const includeEffectsToken = !!(data.keywords && data.keywords.length > 0);
        const parts = [];
        const linePrefix = for_statblock ? '> ' : '';
        if (data.metadata && Object.keys(data.metadata).length > 0) {
            const yamlString = yaml.dump(data.metadata);
            parts.push(`---\n${yamlString.trim()}\n---`);
        }
        if (data.name) {
            const prefix = '**';
            const suffix = '**';
            const iconPrefix = for_statblock ? this.getIconPrefix(data) : '';
            let title = `${iconPrefix}${prefix}${data.name}`;
            if (data.cost) {
                title += ` (${data.cost})`;
            }
            title += `${suffix}`;
            parts.push(title);
        }
        if (data.flavor) {
            parts.push(`*${data.flavor}*`);
        }
        const header1 = [];
        if (data.keywords && data.keywords.length > 0) {
            header1.push(`**${data.keywords.join(', ')}**`);
        }
        else {
            header1.push('');
        }
        if (data.type) {
            header1.push(`**${data.type}**`);
        }
        else {
            header1.push('');
        }
        const row2 = [];
        if (data.distance) {
            row2.push(`**📏 ${data.distance}**`);
        }
        else {
            row2.push('');
        }
        if (data.target) {
            row2.push(`**🎯 ${data.target}**`);
        }
        else {
            row2.push('');
        }
        if (header1.some(h => h) || row2.some(r => r)) {
            const table = [];
            const col1Width = Math.max(header1[0].length, row2[0].length);
            const col2Width = Math.max(header1[1].length, row2[1].length);
            const paddedHeader1 = [
                header1[0].padEnd(col1Width),
                header1[1].padStart(col2Width)
            ];
            table.push(`| ${paddedHeader1.join(' | ')} |`);
            const separator1 = '-'.repeat(col1Width);
            const separator2 = '-'.repeat(col2Width);
            table.push(`| ${separator1} | ${separator2}:|`);
            const paddedRow2 = [
                row2[0].padEnd(col1Width),
                row2[1].padStart(col2Width)
            ];
            table.push(`| ${paddedRow2.join(' | ')} |`);
            parts.push(table.join('\n'));
        }
        if (data.trigger) {
            parts.push(`**Trigger:** ${data.trigger}`);
        }
        if (data.effects && (data.effects.effects || data.effects)) {
            const allEffects = (data.effects.effects || data.effects);
            if (allEffects.length === 0) {
                return parts.join('\n\n');
            }
            const mappedEffects = allEffects.map(e => {
                if (e instanceof Effect_1.Effect)
                    return e;
                if (e.roll)
                    return new model_2.PowerRollEffect(e);
                return new model_1.MundaneEffect(e);
            });
            const effectParts = mappedEffects.map(e => this.writeEffect(e, includeEffectsToken));
            parts.push(effectParts.join('\n\n'));
        }
        let md = parts.join('\n\n');
        if (linePrefix) {
            // ^ start-of-line, gm = every line
            md = md.replace(/^/gm, linePrefix);
        }
        return md;
    }
    getIconPrefix(a) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        if (a.isTrait()) {
            return '⭐️ ';
        }
        if ((_a = a.cost) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes("villain action")) {
            return '☠️ ';
        }
        else if ((_b = a.type) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes("triggered")) {
            return '❗️ ';
        }
        else if (((_c = a.distance) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes("melee")) && ((_d = a.distance) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes("ranged"))) {
            return '⚔️ ';
        }
        else if ((_e = a.distance) === null || _e === void 0 ? void 0 : _e.toLowerCase().includes("melee")) {
            return '🗡 ';
        }
        else if ((_f = a.distance) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes("ranged")) {
            return '🏹 ';
        }
        else if ((_g = a.distance) === null || _g === void 0 ? void 0 : _g.toLowerCase().includes("self")) {
            return '👤 ';
        }
        else if ((_h = a.distance) === null || _h === void 0 ? void 0 : _h.toLowerCase().includes("special")) {
            return '🌀 ';
        }
        else if (((_j = a.distance) === null || _j === void 0 ? void 0 : _j.toLowerCase().includes("burst"))
            || ((_k = a.distance) === null || _k === void 0 ? void 0 : _k.toLowerCase().includes("aura"))) {
            return '❇️ ';
        }
        else if (((_l = a.distance) === null || _l === void 0 ? void 0 : _l.toLowerCase().includes("cube"))
            || ((_m = a.distance) === null || _m === void 0 ? void 0 : _m.toLowerCase().includes("line"))
            || ((_o = a.distance) === null || _o === void 0 ? void 0 : _o.toLowerCase().includes("wall"))) {
            return '🔳 ';
        }
        return '';
    }
    writeEffect(effect, includeEffectToken) {
        if (effect instanceof model_1.MundaneEffect) {
            return this.writeMundaneEffect(effect, includeEffectToken);
        }
        else if (effect instanceof model_2.PowerRollEffect) {
            return this.writePowerRollEffect(effect);
        }
        return '';
    }
    writeMundaneEffect(effect, includeEffectToken) {
        let name = "Effect";
        if (effect.name) {
            name = effect.name;
            if (effect.cost) {
                name += ` (${effect.cost})`;
            }
        }
        else if (effect.cost) {
            name = effect.cost;
        }
        if (!effect.name && !effect.cost && !includeEffectToken) {
            return effect.effect.trim();
        }
        return `**${name}:** ${effect.effect.trim()}`;
    }
    writePowerRollEffect(effect) {
        const rollParts = [];
        if (effect.roll) {
            rollParts.push(`**${effect.roll}:**\n`);
        }
        if (effect.t1) {
            rollParts.push(`- **≤11:** ${effect.t1.trim()}`);
        }
        if (effect.t2) {
            rollParts.push(`- **12-16:** ${effect.t2.trim()}`);
        }
        if (effect.t3) {
            rollParts.push(`- **17+:** ${effect.t3.trim()}`);
        }
        if (effect.crit) {
            rollParts.push(`- **Natural 19-20:** ${effect.crit.trim()}`);
        }
        return rollParts.join('\n');
    }
}
exports.MarkdownAbilityWriter = MarkdownAbilityWriter;
//# sourceMappingURL=MarkdownAbilityWriter.js.map