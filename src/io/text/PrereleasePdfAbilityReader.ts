import { Ability } from "../../model/Ability";
import { IDataReader } from "../IDataReader";
import { Effects } from "../../model/Effects";
import { Effect, MundaneEffect, PowerRollEffect } from "../../model";

export class PrereleasePdfAbilityReader implements IDataReader<Ability> {
    read(text: string): Ability {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        const effects: Effect[] = [];
        const abilityData: Partial<Ability> = {};

        if (!lines.length) return new Ability({ ...abilityData, effects: new Effects([]) });

        const firstLine = lines.shift() || '';
        const costMatch = firstLine.match(/\((.*)\)/);
        if (costMatch) {
            abilityData.cost = costMatch[1].trim();
            abilityData.name = firstLine.replace(costMatch[0], '').trim();
        } else {
            abilityData.name = firstLine.trim();
        }

        let inEffectSection = false;
        const propertyLines: string[] = [];
        const effectLines: string[] = [];

        for (const line of lines) {
            if (line.toLowerCase().startsWith('effect:')) {
                inEffectSection = true;
                const effectText = line.substring('effect:'.length).trim();
                if (effectText) effectLines.push(line);
                continue;
            }
            if (line.startsWith('•')) {
                inEffectSection = true;
            } else {
                const namedEffectMatch = line.match(/^([a-zA-Z0-9\s]+):\s(.+)/);
                const powerRollTierMatch = line.match(/^((\d+-\d+)|(\d+ or lower)|(\d+ or higher)|(\d+\+)|crit|critical)/i)
                if (powerRollTierMatch) {
                    inEffectSection = true;
                }
                else if (line.toLowerCase().startsWith('power roll')) {
                    inEffectSection = true;
                }
                else if (namedEffectMatch) {
                    const propertyKeywords = ['Distance', 'Target', 'Keywords', 'Trigger'];
                    if (!propertyKeywords.some(keyword => new RegExp(`^${keyword}`, 'i').test(namedEffectMatch[1]))) {
                        inEffectSection = true;
                    }
                }
            }

            if (inEffectSection) {
                effectLines.push(line);
            } else {
                propertyLines.push(line);
            }
        }

        const types = ['Main Action', 'Action', 'Maneuver', 'Triggered Action', 'Free Triggered Action', 'Villain Action 1'];
        const flavor: string[] = [];
        for (const line of propertyLines) {
            let isProperty = false;

            const distanceMatch = line.match(/Distance:\s*(.*?)(?:\s*Target:|$)/i);
            if (distanceMatch && distanceMatch[1]) {
                abilityData.distance = distanceMatch[1].trim();
                isProperty = true;
            }

            const targetMatch = line.match(/Target:\s*(.*)/i);
            if (targetMatch && targetMatch[1]) {
                abilityData.target = targetMatch[1].trim();
                isProperty = true;
            }

            const keywords: string[] = [];
            const foundTypes: string[] = [];
            const parts = line.split(',').map(p => p.trim());
            const likelyKeywordLine = parts.length > 1 && parts.every(p => p.split(' ').length < 5);

            if (likelyKeywordLine) {
                parts.forEach(part => {
                    let typeFound = false;
                    for (const type of types) {
                        if (part.toLowerCase().includes(type.toLowerCase())) {
                            let mappedType = type;
                            if (type === 'Main Action') mappedType = 'Action';
                            if (type === 'Free Triggered Action') mappedType = 'Triggered Action';
                            foundTypes.push(mappedType);
                            const remaining = part.replace(new RegExp(type, 'i'), '').trim();
                            if (remaining) keywords.push(remaining);
                            typeFound = true;
                            isProperty = true;
                            break;
                        }
                    }
                    if (!typeFound) keywords.push(part);
                });
            }

            if (foundTypes.length > 0) {
                abilityData.type = foundTypes.join(', ');
                abilityData.keywords = (abilityData.keywords || []).concat(keywords.filter(k => k));
            } else if (likelyKeywordLine) {
                abilityData.keywords = (abilityData.keywords || []).concat(keywords.filter(k => k));
                isProperty = true;
            }

            if (!isProperty) {
                flavor.push(line);
            }
        }

        if (flavor.length > 0) abilityData.flavor = flavor.join(' ');

        if (effectLines.length > 0) {
            const effectGroups = this.groupEffectLines(effectLines);
            for (const group of effectGroups) {
                const blockText = group.join(' ').replace(/^(Effect|Trigger):/i, '').trim();
                const firstLine = group[0];

                if (firstLine.toLowerCase().startsWith('power roll') || group.some(l => /^((\d+-\d+)|(\d+ or lower)|(\d+ or higher)|(\d+\+)|crit|critical)/i.test(l))) {
                    const rollMatch = blockText.match(/(Power Roll\s*\+\s*[a-zA-Z]+)/i);
                    const roll = rollMatch ? rollMatch[1] : '';
                    const tiers: { [key: string]: string } = {};

                    const tierRegex = /((?:(?:\d+-\d+)|(?:\d+\s+or\s+lower)|(?:\d+\s+or\s+higher)|(?:\d+\+)|crit(?:ical)?)):?\s*([\s\S]*?)(?=(?:\d+-\d+)|(?:\d+\s+or\s+lower)|(?:\d+\s+or\s+higher)|(?:\d+\+)|crit(?:ical)?|$)/gi;
                    let match;

                    let textToParse = blockText;
                    if (roll) {
                        textToParse = textToParse.replace(roll, '');
                    }

                    while ((match = tierRegex.exec(textToParse)) !== null) {
                        const key = this.mapOutcomeToTierKey(match[1].trim());
                        if (key) {
                            tiers[key] = match[2].trim().replace(/•/g, '').trim();
                        }
                    }

                    if (Object.keys(tiers).length > 0) {
                        effects.push(new PowerRollEffect({ roll, ...tiers }));
                    } else {
                        effects.push(new MundaneEffect({ effect: blockText }));
                    }
                } else if (firstLine.startsWith('•')) {
                    effects.push(new MundaneEffect({ effect: blockText.replace(/•/g, '').trim() }));
                } else {
                    const namedMatch = blockText.match(/^([a-zA-Z0-9\s\d-]+):\s*([\s\S]*)/);
                    if (namedMatch && !/distance|target/i.test(namedMatch[1])) {
                        effects.push(new MundaneEffect({ name: namedMatch[1].trim(), effect: namedMatch[2].trim().replace(/•/g, '').trim() }));
                    } else {
                        effects.push(new MundaneEffect({ effect: blockText.replace(/•/g, '').trim() }));
                    }
                }
            }
        }

        if (effects.length === 0 && abilityData.flavor) {
            effects.push(new MundaneEffect({ effect: abilityData.flavor }));
            delete abilityData.flavor;
        }

        if (!abilityData.type && (abilityData.cost || abilityData.distance || abilityData.target || effects.length > 0)) {
            abilityData.type = 'Unknown';
        }

        const finalAbility = new Ability(abilityData);
        finalAbility.effects = new Effects(effects);
        return finalAbility;
    }

    private isNewEffect(line: string, previousLine: string): boolean {
        if (line.toLowerCase().startsWith('power roll')) return true;

        const powerRollTierRegex = /^((\d+-\d+)|(\d+ or lower)|(\d+ or higher)|(\d+\+)|crit|critical)/i;
        if (powerRollTierRegex.test(line)) {
            const prevIsPowerRoll = previousLine.toLowerCase().startsWith('power roll');
            const prevIsTier = powerRollTierRegex.test(previousLine);
            return !prevIsPowerRoll && !prevIsTier;
        }

        if (line.startsWith('•')) return false;

        const namedEffectRegex = /^([a-zA-Z0-9\s\d-]+):\s*(.*)/;
        if (namedEffectRegex.test(line)) {
            const match = line.match(namedEffectRegex);
            if (match && /distance|target|keywords|trigger/i.test(match[1])) {
                return false;
            }
            return true;
        }

        return false;
    }

    private groupEffectLines(lines: string[]): string[][] {
        if (!lines.length) return [];
        const groups: string[][] = [];
        let currentGroup: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (i > 0 && this.isNewEffect(line, lines[i - 1])) {
                groups.push(currentGroup);
                currentGroup = [line];
            } else {
                currentGroup.push(line);
            }
        }
        groups.push(currentGroup);
        return groups;
    }

    private mapOutcomeToTierKey(threshold: string): string {
        const s = threshold.toLowerCase().replace(':', '');
        if (s.includes('or lower') || s.includes('<') || (s.includes('–') && parseInt(s.split(/[-–]/)[0], 10) < 12)) {
            return 't1';
        } else if (s.includes('+') || s.includes('or higher') || (s.includes('–') && parseInt(s.split(/[-–]/)[1], 10) > 16) || s.startsWith('17')) {
            return 't3';
        } else if (s.includes('–') || s.includes('-')) {
            return 't2';
        } else if (s.includes('crit')) {
            return 'crit';
        }
        // basic fallback for single numbers
        const num = parseInt(s, 10);
        if (num <= 11) return 't1';
        if (num >= 17) return 't3';
        if (num >= 12 && num <= 16) return 't2';

        return `t${s}`;
    }
}

