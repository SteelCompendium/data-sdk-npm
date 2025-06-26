"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownAbilityWriter = void 0;
const Effect_1 = require("../../model/Effect");
const model_1 = require("../../model");
const model_2 = require("../../model");
class MarkdownAbilityWriter {
    write(data) {
        const parts = [];
        if (data.name) {
            let title = `**${data.name}`;
            if (data.cost) {
                title += ` (${data.cost})`;
            }
            title += `**`;
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
            const effectParts = [];
            const mundaneEffects = mappedEffects.filter(e => e instanceof model_1.MundaneEffect && !e.name);
            const otherEffects = mappedEffects.filter(e => !(e instanceof model_1.MundaneEffect && !e.name));
            if (mundaneEffects.length > 0) {
                if (mundaneEffects.length === 1) {
                    const effectText = mundaneEffects[0].effect.trim();
                    effectParts.push(`**Effect:** ${effectText}`);
                }
                else {
                    const intro = mundaneEffects[0].effect.trim();
                    if (intro.endsWith(':')) {
                        const listItems = mundaneEffects.slice(1).map(e => `- ${e.effect.trim()}`);
                        effectParts.push(`**Effect:** ${intro}\n\n${listItems.join('\n')}`);
                    }
                    else {
                        const listItems = mundaneEffects.map(e => `- ${e.effect.trim()}`);
                        effectParts.push(`**Effect:**\n\n${listItems.join('\n')}`);
                    }
                }
            }
            for (const effect of otherEffects) {
                effectParts.push(this.writeEffect(effect));
            }
            parts.push(effectParts.join('\n\n'));
        }
        return parts.join('\n\n');
    }
    writeEffect(effect) {
        if (effect instanceof model_1.MundaneEffect) {
            return this.writeMundaneEffect(effect);
        }
        else if (effect instanceof model_2.PowerRollEffect) {
            return this.writePowerRollEffect(effect);
        }
        return '';
    }
    writeMundaneEffect(effect) {
        if (effect.name) {
            let str = `**${effect.name}`;
            if (effect.cost) {
                str += ` ${effect.cost}`;
            }
            str += `:** ${effect.effect}`;
            return str;
        }
        return effect.effect.trim();
    }
    writePowerRollEffect(effect) {
        const rollParts = [];
        if (effect.roll) {
            rollParts.push(`**${effect.roll}:**`);
        }
        if (effect.t1) {
            rollParts.push(`- **≤11:** ${effect.t1}`);
        }
        if (effect.t2) {
            rollParts.push(`- **12-16:** ${effect.t2}`);
        }
        if (effect.t3) {
            rollParts.push(`- **17+:** ${effect.t3}`);
        }
        if (effect.crit) {
            rollParts.push(`- **Natural 19-20:** ${effect.crit}`);
        }
        return rollParts.join('\n');
    }
}
exports.MarkdownAbilityWriter = MarkdownAbilityWriter;
//# sourceMappingURL=MarkdownAbilityWriter.js.map