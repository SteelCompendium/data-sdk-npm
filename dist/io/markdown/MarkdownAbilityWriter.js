"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownAbilityWriter = void 0;
const model_1 = require("../../model");
const model_2 = require("../../model");
class MarkdownAbilityWriter {
    write(data) {
        const parts = [];
        if (data.name) {
            parts.push(`### ${data.name}`);
        }
        if (data.cost) {
            parts.push(`**Cost:** ${data.cost}`);
        }
        if (data.type) {
            parts.push(`**Type:** ${data.type}`);
        }
        if (data.keywords && data.keywords.length > 0) {
            parts.push(`**Keywords:** ${data.keywords.join(', ')}`);
        }
        if (data.flavor) {
            parts.push(`*${data.flavor}*`);
        }
        if (data.trigger) {
            parts.push(`**Trigger:** ${data.trigger}`);
        }
        if (data.target) {
            parts.push(`**Target:** ${data.target}`);
        }
        if (data.distance) {
            parts.push(`**Distance:** ${data.distance}`);
        }
        if (data.effects && data.effects.effects.length > 0) {
            parts.push('**Effects:**');
            const effectParts = data.effects.effects.map(effect => this.writeEffect(effect));
            parts.push(effectParts.join('\n'));
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
        let effectString = `- `;
        if (effect.name) {
            effectString += `**${effect.name}**`;
            if (effect.cost) {
                effectString += ` (${effect.cost})`;
            }
            effectString += `: `;
        }
        effectString += effect.effect;
        return effectString;
    }
    writePowerRollEffect(effect) {
        const rollParts = [];
        if (effect.roll) {
            rollParts.push(`- **Roll:** ${effect.roll}`);
        }
        if (effect.t1) {
            rollParts.push(`  - **11 or lower:** ${effect.t1}`);
        }
        if (effect.t2) {
            rollParts.push(`  - **12-16:** ${effect.t2}`);
        }
        if (effect.t3) {
            rollParts.push(`  - **17+:** ${effect.t3}`);
        }
        if (effect.crit) {
            rollParts.push(`  - **Natural 19-20:** ${effect.crit}`);
        }
        return rollParts.join('\n');
    }
}
exports.MarkdownAbilityWriter = MarkdownAbilityWriter;
//# sourceMappingURL=MarkdownAbilityWriter.js.map