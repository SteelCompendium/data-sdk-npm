import { Ability, MundaneEffect, PowerRollEffect, Effect } from "../../model";
import { Effects } from "../../model/Effects";
import { IDataReader } from "../IDataReader";

export class MarkdownAbilityReader implements IDataReader<Ability> {
    public constructor() { }

    read(content: string): Ability {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        const partial: Partial<Ability> = {};

        let i = 0;

        // Title and Cost
        const titleMatch = lines[i++].match(/\*\*(.*?)(?: \((.*?)\))?\*\*/);
        if (titleMatch) {
            partial.name = titleMatch[1].trim().toUpperCase();
            if (titleMatch[2]) {
                partial.cost = titleMatch[2].trim();
            }
        }

        // Flavor Text
        if (i < lines.length && lines[i].startsWith('*') && !lines[i].startsWith('**')) {
            partial.flavor = lines[i++].replace(/\*/g, '');
        }

        // Table
        if (i < lines.length && lines[i].includes('|')) {
            const headerCells = lines[i++].split('|').map(c => c.replace(/\*/g, '').trim()).filter(Boolean);
            partial.keywords = headerCells[0].split(', ').map(k => k.trim());
            partial.type = headerCells[1];
            i++; // Skip separator
            const dataCells = lines[i++].split('|').map(c => c.replace(/\*/g, '').trim()).filter(Boolean);
            partial.distance = dataCells[0].replace('📏', '').trim();
            partial.target = dataCells[1].replace('🎯', '').trim();
        }

        const effects: Effect[] = [];

        // Effects
        while (i < lines.length) {
            const line = lines[i];

            if (line.startsWith('**Power Roll')) { // Power Roll
                const powerRollEffect = new PowerRollEffect({});
                powerRollEffect.roll = line.replace(/\*\*|:/g, '');
                i++;
                while (i < lines.length && lines[i].trim().startsWith('-')) {
                    const rollLine = lines[i].trim();
                    const separatorIndex = rollLine.indexOf(':');
                    const tier = rollLine.substring(0, separatorIndex);
                    const description = rollLine.substring(separatorIndex + 1).replace(/\*/g, '').trim();
                    if (tier.includes('≤11')) powerRollEffect.t1 = description.trim();
                    else if (tier.includes('12-16')) powerRollEffect.t2 = description.trim();
                    else if (tier.includes('17+')) powerRollEffect.t3 = description.trim();
                    else if (tier.includes('19-20')) powerRollEffect.crit = description.trim();
                    i++;
                }
                effects.push(powerRollEffect);
                continue;
            }

            if (line.startsWith('**Effect:**')) {
                let effectText = line.substring('**Effect:**'.length).trim();
                i++;
                while (i < lines.length && !lines[i].startsWith('**')) {
                    effectText += '\n' + lines[i];
                    i++;
                }
                effects.push(new MundaneEffect({ effect: effectText.trim() }));
                continue;
            }

            // Named Effects (e.g., Persistent)
            const namedEffectMatch = line.match(/\*\*(.+?):\*\* (.*)/);
            if (namedEffectMatch) {
                const nameAndCost = namedEffectMatch[1];
                let effect = namedEffectMatch[2];
                i++;
                while (i < lines.length && !lines[i].startsWith('**')) {
                    effect += '\n' + lines[i];
                    i++;
                }

                effects.push(new MundaneEffect({ name: nameAndCost, effect: effect.trim() }));
                continue;
            }

            i++;
        }

        const ability = new Ability(partial);
        ability.effects = new Effects(effects);
        return ability;
    }
} 