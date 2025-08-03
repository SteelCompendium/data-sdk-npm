import { Ability, MundaneEffect, PowerRollEffect, Effect } from "../../model";
import { Effects } from "../../model/Effects";
import { IDataReader } from "../IDataReader";
import * as yaml from 'js-yaml';

export class MarkdownAbilityReader implements IDataReader<Ability> {
    public constructor() { }

    read(content: string): Ability {
        let lines = content.split('\n');
        const partial: Partial<Ability> = {};

        // Find the end of the frontmatter
        let frontmatterEndIndex = -1;
        if (lines[0].trim() === '---') {
            frontmatterEndIndex = lines.slice(1).findIndex(line => line.trim() === '---');
            if (frontmatterEndIndex !== -1) {
                const frontmatterLines = lines.slice(1, frontmatterEndIndex + 1).join('\n');
                try {
                    partial.metadata = yaml.load(frontmatterLines) as Record<string, any>;
                } catch (e) {
                    console.error("Error parsing frontmatter:", e);
                }

                // The index is in the sliced array, so we add 1 to get the index in the original array
                // and another 1 to get the line after the '---'
                lines = lines.slice(frontmatterEndIndex + 2);
            }
        }

        lines = lines.filter(line => line.trim() !== '');
        let i = 0;

        // Title and Cost
        const titleLine = lines[i++].trim();
        let titleMatch;
        if (titleLine.startsWith('###')) {
            titleMatch = titleLine.match(/#+\s*(.*?)(?: \((.*?)\))?$/);
        } else {
            titleMatch = titleLine.match(/\*\*(.*?)(?: \((.*?)\))?\*\*/);
        }

        if (titleMatch) {
            partial.name = titleMatch[1].trim();
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

            if (line.startsWith('**') && line.endsWith(':**')) {
                let isPowerRoll = false;
                // Peek ahead to see if there are roll tiers
                if (i + 1 < lines.length) {
                    const nextLine = lines[i + 1].trim();
                    if (nextLine.startsWith('- **') && nextLine.includes(':')) {
                        isPowerRoll = true;
                    }
                }
                if (!isPowerRoll && i + 2 < lines.length) {
                    const nextLine = lines[i + 2].trim();
                    if (nextLine.startsWith('- **') && nextLine.includes(':')) {
                        isPowerRoll = true;
                    }
                }

                if (isPowerRoll) {
                    const powerRollEffect = new PowerRollEffect({});
                    powerRollEffect.roll = line.replace(/\*\*|:/g, '').trim();
                    i++;
                    while (i < lines.length && (lines[i].trim().startsWith('-') || lines[i].trim() === '')) {
                        const rollLine = lines[i].trim();
                        if (rollLine === '') {
                            i++;
                            continue;
                        }
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
            }

            if (line.startsWith('**Trigger:**')) {
                let triggerText = line.substring('**Trigger:**'.length).trim();
                i++;
                while (i < lines.length && !lines[i].startsWith('**')) {
                    triggerText += '\n' + lines[i];
                    i++;
                }
                partial.trigger = triggerText.trim();
                continue;
            }

            // Effects (e.g., **Effect:**, **Persistent:**, **Effect (1 Malice):**)
            const effectMatch = line.match(/\*\*(.+?):\*\* (.*)/);
            if (effectMatch) {
                const nameAndCost = effectMatch[1];
                let effect = effectMatch[2];
                i++;
                while (i < lines.length && !lines[i].startsWith('**')) {
                    effect += '\n' + lines[i];
                    i++;
                }

                const effectProps: Partial<MundaneEffect> = { effect: effect.trim() };
                if (nameAndCost.trim().match(/\d+\+*\s*\w+/)) {
                    effectProps.cost = nameAndCost.trim();
                } else if (nameAndCost.trim().toLowerCase() !== 'effect') {
                    effectProps.name = nameAndCost.trim();
                }
                // const nameCostMatch = nameAndCost.match(/(.*?) \((.*)\)/);

                // let name: string | undefined;
                // if (nameCostMatch) {
                //     name = nameCostMatch[1].trim();
                //     effectProps.cost = nameCostMatch[2].trim();
                // } else {
                //     name = nameAndCost.trim();
                // }
                // if (name.toLowerCase() !== 'effect') {
                //     effectProps.name = name;
                // }

                effects.push(new MundaneEffect(effectProps as any));
                continue;
            }

            // If we've reached here and the line is not empty, it must be a simple effect
            if (line.trim()) {
                let effect = line;
                i++;
                while (i < lines.length && !lines[i].startsWith('**')) {
                    effect += '\n' + lines[i];
                    i++;
                }
                const effectProps: Partial<MundaneEffect> = { effect: effect.trim() };
                effects.push(new MundaneEffect(effectProps as any));
                continue;
            }

            i++;
        }

        const ability = new Ability(partial);
        ability.effects = new Effects(effects);
        return ability;
    }
} 