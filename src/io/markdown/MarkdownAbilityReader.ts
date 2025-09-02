import { Ability, MundaneEffect, PowerRollEffect, Effect } from "../../model";
import { Effects } from "../../model/Effects";
import { IDataReader } from "../IDataReader";
import * as yaml from 'js-yaml';
import {TestEffect} from "../../model/TestEffect";

export class MarkdownAbilityReader implements IDataReader<Ability> {
    public constructor() { }

    read(content: string): Ability {
        let lines = content.split('\n');
        lines = lines.map(l => l.replace(/^\s*>\s?/, ''));
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

        // Title, icon, and Cost
        const titleLine = lines[i++];
        const parsed = this.parseTitleLine(titleLine);
        if (parsed.icon) partial.icon = parsed.icon;
        partial.name = parsed.name;
        if (parsed.cost) partial.cost = parsed.cost;

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
        // TODO - this AI slop is so bad.  It needs to be rewritten to avoid so much code duplication.
        while (i < lines.length) {
            const line = lines[i];

            // Power Roll Effect
            if (line.startsWith('**') && line.endsWith(':**')) {
                let hasTiers = this.peekToCheckForTiers(i, lines);

                if (hasTiers) {
                    let tierEffect;
                    if (line.includes("Power Roll") || line.includes("2d10")) {
                        tierEffect = new PowerRollEffect({});
                        tierEffect.roll = line.replace(/\*\*|:/g, '').trim();
                    } else {
                        tierEffect = new TestEffect({});
                        tierEffect.effect = line.replace(/\*\*|:/g, '').trim();
                    }
                    i++;
                    i = this.parseTiers(i, lines, tierEffect);
                    effects.push(tierEffect);
                    continue;
                }
            }

            // Trigger
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
                while (i < lines.length && !lines[i].startsWith('**') && !lines[i].startsWith('- **')) {
                    effect += '\n' + lines[i];
                    i++;
                }

                const effectProps: Partial<MundaneEffect> = { effect: effect.trim() };
                this.parseNameAndCost(nameAndCost.trim(), effectProps);

                // If we find tiers, rewrite the effect as Test Effect
                let hasTiers = this.peekToCheckForTiers(i, lines);
                if (hasTiers) {
                    let tierEffect = new TestEffect({
                        name: effectProps.name,
                        cost: effectProps.cost,
                        effect: effectProps.effect
                    });
                    i = this.parseTiers(i, lines, tierEffect);
                    effects.push(tierEffect);
                } else {
                    effects.push(new MundaneEffect(effectProps as any));
                }
                continue;
            }

            // If we've reached here and the line is not empty, it must be an effect without a name/cost
            if (line.trim()) {
                let effect = line + '\n';
                i++;
                while (i < lines.length && !lines[i].startsWith('**') && !lines[i].startsWith('- **')) {
                    effect += '\n' + lines[i];
                    i++;
                }

                let hasTiers = this.peekToCheckForTiers(i, lines);
                if (hasTiers) {
                    let tierEffect = new TestEffect({effect: effect.trim()});
                    i = this.parseTiers(i, lines, tierEffect);
                    effects.push(tierEffect);
                } else {
                    effects.push(new MundaneEffect({effect: effect.trim()}));
                }
                continue;
            }

            i++;
        }

        const ability = new Ability(partial);
        ability.effects = new Effects(effects);
        return ability;
    }

    private parseNameAndCost(nameAndCost: string, effectProps: Partial<MundaneEffect>) {
        // Just cost (ex: `1+ Piety`)
        if (nameAndCost.match(/^\d+\+*\s*\w+/) || nameAndCost.match(/^Spend \d+\+*\s*\w+/)) {
            effectProps.cost = nameAndCost;
            return;
        }

        // Name and cost (ex: `Eat (1 Piety)`)
        const nameWithCost = nameAndCost.match(/^(.*)\s*\((.*)\)/);
        if (nameWithCost) {
            effectProps.name = nameWithCost[1].trim();
            effectProps.cost = nameWithCost[2].trim();
            return;
        }

        // Just name (ex: `Eat`)
        effectProps.name = nameAndCost;
        return;
    }

    // Parse a single line into { icon?, name, cost? }
    private parseTitleLine(raw: string) {
        // 1) Trim and strip leading markdown header hashes
        let s = raw.trim().replace(/^#{1,9}\s*/, "");

        // 2) Optional leading icon token (e.g., 📏) before the title/bold
        //    We treat any leading run of non-word, non-space, non-#/* chars as an "icon"
        let icon = "";
        const iconMatch = s.match(/^([^\w\s#*][^\w\s#*]*)\s+/u);
        if (iconMatch) {
            icon = iconMatch[1].trim();
            s = s.slice(iconMatch[0].length);
        }

        // 3) If the whole remainder is **bold**, unwrap it
        const boldMatch = s.match(/^\*\*(.+?)\*\*$/);
        if (boldMatch) s = boldMatch[1];

        // 4) Split into name + optional trailing (cost)
        //    Captures the final parenthesized chunk as cost if present.
        const m = s.match(/^(.*?)(?:\s*\(([^()]+)\))?$/);
        const name = (m?.[1] ?? s).trim();
        const cost = m?.[2]?.trim();

        return { icon: icon || undefined, name, cost: cost || undefined };
    }

    private parseTiers(i: number, lines: string[], tierEffect: TestEffect | PowerRollEffect) {
        while (i < lines.length && (lines[i].trim().startsWith('-') || lines[i].trim() === '')) {
            const rollLine = lines[i].trim();
            if (rollLine === '') {
                i++;
                continue;
            }
            const separatorIndex = rollLine.indexOf(':');
            const tier = rollLine.substring(0, separatorIndex);
            const description = rollLine.substring(separatorIndex + 1).replace(/^\*\*\s*/, "").trim();
            if (tier.includes('≤11')) tierEffect.t1 = description.trim();
            else if (tier.includes('12-16')) tierEffect.t2 = description.trim();
            else if (tier.includes('17+')) tierEffect.t3 = description.trim();
            else if (tier.includes('19-20')) tierEffect.crit = description.trim();
            i++;
        }
        return i;
    }

    private peekToCheckForTiers(i: number, lines: string[]) {
        // Peek ahead to see if there are roll tiers
        if (i + 1 < lines.length) {
            const nextLine = lines[i + 1].trim();
            if (nextLine.startsWith('- **') && nextLine.includes(':')) {
                return true
            }
        }
        if (i + 2 < lines.length) {
            const nextLine = lines[i + 2].trim();
            if (nextLine.startsWith('- **') && nextLine.includes(':')) {
                return true
            }
        }
        return false;
    }
}