import {Effect, Feature, FeatureType} from "../../model";
import {IDataReader} from "../IDataReader";
import * as yaml from 'js-yaml';

export class MarkdownFeatureReader implements IDataReader<Feature> {
    public constructor() {
    }

    read(content: string): Feature {
        let lines = content.split('\n');
        lines = lines.map(l => l.replace(/^\s*>\s?/, ''));
        const partial: Partial<Feature> = {};

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
        partial.feature_type = FeatureType.Trait;
        if (i < lines.length && lines[i].includes('|')) {
            const headerCells = lines[i++].split('|').map(c => c.replace(/\*/g, '').trim()).filter(Boolean);
            partial.keywords = headerCells[0].split(', ').map(k => k.trim());
            partial.usage = headerCells[1];
            i++; // Skip separator
            const dataCells = lines[i++].split('|').map(c => c.replace(/\*/g, '').trim()).filter(Boolean);
            partial.distance = dataCells[0].replace('📏', '').trim();
            partial.target = dataCells[1].replace('🎯', '').trim();
            partial.feature_type = FeatureType.Ability;
        }

        this.parseEffects(i, lines, [], partial);
        return new Feature(partial);
    }

    private parseEffects(lineIdx: number, lines: string[], effects: Effect[], feature: Partial<Feature>) {
        let partial: Partial<Effect> = {};
        while (lineIdx < lines.length) {
            // Special case for **Trigger:**
            if (lines[lineIdx].startsWith('**Trigger:**')) {
                let triggerText = lines[lineIdx].substring('**Trigger:**'.length).trim();
                lineIdx++;
                const __ret = this.readUntilNextEffectComponent(lineIdx, lines, triggerText);
                lineIdx = __ret.lineIdx;
                feature.trigger = __ret.effect;
                continue;
            }

            // Check if we need to start a new effect
            if (Object.keys(partial).length !== 0) {
                // if there is an effect name or power roll OR if a mundane line and effect already exists on the partial effect
                if (lines[lineIdx].startsWith('**') || (!lines[lineIdx].startsWith('- **') && partial.effect)) {
                    effects.push(new Effect(partial));
                    partial = {};
                }
            }

            lineIdx = this.parseEffectSubblock(lineIdx, lines, partial)
        }

        // Close out our last non-empty partial
        if (Object.keys(partial).length !== 0) {
            effects.push(new Effect(partial));
        }
        feature.effects = effects;
    }

    private parseEffectSubblock(lineIdx: number, lines: string[], currentEffect: Partial<Effect>): number {
        const line = lines[lineIdx];

        // Roll
        if (line.startsWith('**') && line.endsWith(':**')) {
            if (line.includes("Power Roll") || line.includes("2d10")) {
                currentEffect.roll = line.replace(/\*\*|:/g, '').trim()
                lineIdx++;
                return lineIdx;
            }
        }

        // Named Effect (e.g., **Effect:**, **Persistent:**, **Effect (1 Malice):**)
        const effectMatch = line.match(/^\*\*(.+?):?\*\* (.*)/);
        if (effectMatch) {
            const nameAndCost = effectMatch[1];
            let effect = effectMatch[2];
            lineIdx++;
            const __ret = this.readUntilNextEffectComponent(lineIdx, lines, effect);
            lineIdx = __ret.lineIdx;
            currentEffect.effect = __ret.effect;
            this.parseNameAndCost(nameAndCost.trim(), currentEffect);
            return lineIdx;
        }

        // Power Roll Tiers
        let hasTiers = this.peekToCheckForTiers(lineIdx, lines);
        if (hasTiers) {
            return this.parseTiers(lineIdx, lines, currentEffect);
        }

        // If we've reached here and the line is not empty, it must be an effect without a name/cost
        if (line.trim()) {
            lineIdx++;
            // im not sure I fully understand why this one needs en extra newline, so im calling it out
            const __ret = this.readUntilNextEffectComponent(lineIdx, lines, line + '\n');
            lineIdx = __ret.lineIdx;
            currentEffect.effect = __ret.effect;
            return lineIdx;
        }

        console.warn("Unexpected line in effect block, skipping:", line);
        lineIdx++;
        return lineIdx;
    }

    private readUntilNextEffectComponent(lineIdx: number, lines: string[], effect: string) {
        while (lineIdx < lines.length && !lines[lineIdx].startsWith('**') && !lines[lineIdx].startsWith('- **')) {
            if (lines[lineIdx].trim() === '') {
                console.log(`adding empty line to unnamed effect ${effect}`);
            }
            effect += '\n' + lines[lineIdx];
            lineIdx++;
        }
        effect = effect.trim();
        return {lineIdx, effect};
    }

    private parseNameAndCost(nameAndCost: string, currEffect: Partial<Effect>) {
        // Just cost (ex: `1+ Piety`)
        if (nameAndCost.match(/^\d+\+*\s*\w+/) || nameAndCost.match(/^Spend \d+\+*\s*\w+/)) {
            currEffect.cost = nameAndCost;
            return;
        }

        // Name and cost (ex: `Eat (1 Piety)`)
        const nameWithCost = nameAndCost.match(/^(.*)\s*\((.*)\)/);
        if (nameWithCost) {
            currEffect.name = nameWithCost[1].trim();
            currEffect.cost = nameWithCost[2].trim();
            return;
        }

        // Just name (ex: `Eat`)
        currEffect.name = nameAndCost;
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

        return {icon: icon || undefined, name, cost: cost || undefined};
    }

    private parseTiers(i: number, lines: string[], effect: Partial<Effect>) {
        while (i < lines.length && (lines[i].trim().startsWith('- **') || lines[i].trim() === '')) {
            const tierLine = lines[i].trim();
            if (tierLine === '') {
                i++;
                continue;
            }
            const separatorIndex = tierLine.indexOf(':');
            const tier = tierLine.substring(0, separatorIndex);
            const description = tierLine.substring(separatorIndex + 1).replace(/^\*\*\s*/, "").trim();
            if (tier.includes('≤11')) effect.tier1 = description.trim();
            else if (tier.includes('12-16')) effect.tier2 = description.trim();
            else if (tier.includes('17+')) effect.tier3 = description.trim();
            else if (tier.includes('19-20')) effect.crit = description.trim();
            i++;
        }
        return i;
    }

    private peekToCheckForTiers(i: number, lines: string[]) {
        // Peek ahead to see if there are roll tiers
        if (i < lines.length) {
            const line = lines[i].trim();
            if (line.startsWith('- **') && line.includes(':')) {
                return true
            }
        }
        return false;
    }
}