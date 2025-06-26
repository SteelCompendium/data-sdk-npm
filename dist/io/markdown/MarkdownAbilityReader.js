"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownAbilityReader = void 0;
const model_1 = require("../../model");
const Effects_1 = require("../../model/Effects");
class MarkdownAbilityReader {
    read(content) {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        const partial = {};
        let i = 0;
        // Title and Cost
        const titleMatch = lines[i++].match(/\*\*(.+) \((.+)\)\*\*/);
        if (titleMatch) {
            partial.name = titleMatch[1].trim().toUpperCase();
            partial.cost = titleMatch[2].trim();
        }
        // Flavor Text
        if (i < lines.length && lines[i].startsWith('*')) {
            partial.flavor = lines[i++].replace(/\*/g, '');
        }
        // Table
        const headerCells = lines[i++].split('|').map(c => c.replace(/\*/g, '').trim()).filter(Boolean);
        partial.keywords = headerCells[0].split(', ').map(k => k.trim());
        partial.type = headerCells[1];
        i++; // Skip separator
        const dataCells = lines[i++].split('|').map(c => c.replace(/\*/g, '').trim()).filter(Boolean);
        partial.distance = dataCells[0].replace('📏', '').trim();
        partial.target = dataCells[1].replace('🎯', '').trim();
        const effects = [];
        // Effects
        while (i < lines.length) {
            const line = lines[i];
            if (line.startsWith('**Effect:**')) {
                let effectText = line.substring('**Effect:**'.length).trim();
                const mundaneEffect = new model_1.MundaneEffect({ effect: effectText });
                effects.push(mundaneEffect);
                i++;
                // Handle multi-line effects
                while (i < lines.length && lines[i].trim().startsWith('-')) {
                    const effectLine = lines[i].trim().substring(1).trim();
                    if (mundaneEffect.effect.endsWith(':')) {
                        mundaneEffect.effect += '\n' + `- ${effectLine}`;
                    }
                    else {
                        const newEffect = new model_1.MundaneEffect({ effect: effectLine });
                        effects.push(newEffect);
                    }
                    i++;
                }
            }
            else if (line.includes('Roll +')) { // Power Roll
                const powerRollEffect = new model_1.PowerRollEffect({});
                powerRollEffect.roll = line.replace(/\*\*/g, '');
                i++;
                while (i < lines.length && lines[i].trim().startsWith('-')) {
                    const rollLine = lines[i].trim();
                    const separatorIndex = rollLine.indexOf(':');
                    const tier = rollLine.substring(0, separatorIndex);
                    const description = rollLine.substring(separatorIndex + 1);
                    if (tier.includes('≤11'))
                        powerRollEffect.t1 = description.trim();
                    else if (tier.includes('12-16'))
                        powerRollEffect.t2 = description.trim();
                    else if (tier.includes('17+'))
                        powerRollEffect.t3 = description.trim();
                    else if (tier.includes('19-20'))
                        powerRollEffect.crit = description.trim();
                    i++;
                }
                effects.push(powerRollEffect);
            }
            else { // Named Effects (e.g., Persistent)
                const namedEffectMatch = line.match(/\*\*(.+?):\*\* (.*)/);
                if (namedEffectMatch) {
                    const nameAndCost = namedEffectMatch[1];
                    const effect = namedEffectMatch[2];
                    const costMatch = nameAndCost.match(/(.+) (\d+)/);
                    if (costMatch) {
                        effects.push(new model_1.MundaneEffect({ name: costMatch[1], cost: costMatch[2], effect }));
                    }
                    else {
                        effects.push(new model_1.MundaneEffect({ name: nameAndCost, effect }));
                    }
                }
                i++;
            }
        }
        const ability = new model_1.Ability(partial);
        ability.effects = new Effects_1.Effects(effects);
        return ability;
    }
}
exports.MarkdownAbilityReader = MarkdownAbilityReader;
//# sourceMappingURL=MarkdownAbilityReader.js.map