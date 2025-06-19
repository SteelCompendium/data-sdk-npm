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
            let name = firstLine.replace(costMatch[0], '').trim();
            name = name.replace(/\b([B-HJ-NP-Z])\s+/g, '$1');
            name = name.replace(/(-[a-zA-Z])\s+/g, '$1');
            abilityData.name = name;
        } else {
            let name = firstLine.trim();
            name = name.replace(/\b([B-HJ-NP-Z])\s+/g, '$1');
            name = name.replace(/(-[a-zA-Z])\s+/g, '$1');
            abilityData.name = name;
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
                const powerRollTierMatch = line.match(/^((\d+-\d+)|(\d+–\d+)|(\d+ or lower)|(\d+ or higher)|(\d+\+)|crit|critical)/i)
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
                            foundTypes.push(type);
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
                const firstLine = group[0];

                if (firstLine.toLowerCase().startsWith('power roll') || group.some(l => /^((\d+-\d+)|(\d+–\d+)|(\d+ or lower)|(\d+ or higher)|(\d+\+)|crit|critical)/i.test(l))) {
                    const rollMatch = group.find(l => /power roll/i.test(l));
                    const roll = rollMatch ? rollMatch.trim().replace(/:$/, '') : '';
                    const tiers: { [key: string]: string } = {};

                    const tierIdentifier = /^((\d+-\d+)|(\d+–\d+)|(\d+\s+or\s+lower)|(\d+\s+or\s+higher)|(\d+\+)|crit(?:ical)?)/i;

                    let currentTierKey: string | null = null;
                    let currentTierLines: string[] = [];

                    const flushTier = () => {
                        if (currentTierKey) {
                            tiers[currentTierKey] = this.joinAndFormatEffectLines(currentTierLines);
                        }
                        currentTierLines = [];
                        currentTierKey = null;
                    };

                    for (const line of group) {
                        if (/power roll/i.test(line)) continue;

                        const parts = line.split('•').map(p => p.trim()).filter(Boolean);
                        for (const part of parts) {
                            const tierMatch = part.match(tierIdentifier);
                            if (tierMatch) {
                                flushTier();
                                currentTierKey = this.mapOutcomeToTierKey(tierMatch[1].trim());
                                const restOfPart = part.substring(tierMatch[0].length).replace(/^:/, '').trim();
                                if (restOfPart) {
                                    currentTierLines.push(restOfPart);
                                }
                            } else if (currentTierKey) {
                                currentTierLines.push(part);
                            }
                        }
                    }
                    flushTier();

                    if (Object.keys(tiers).length > 0) {
                        effects.push(new PowerRollEffect({ roll, ...tiers }));
                    } else {
                        const blockText = this.joinAndFormatEffectLines(group).replace(/^(Effect|Trigger):/i, '').trim();
                        effects.push(new MundaneEffect({ effect: blockText }));
                    }
                } else {
                    const blockTextWithHeader = this.joinAndFormatEffectLines(group);
                    const blockText = blockTextWithHeader.replace(/^(Effect|Trigger):/i, '').trim();
                    const effectParts = blockText.split(/(?=[A-Z][a-zA-Z\s\d]*\s\d*:)/);

                    for (const part of effectParts) {
                        if (!part.trim()) continue;
                        const namedMatch = part.match(/^([a-zA-Z0-9\s\d-]+):\s*([\s\S]*)/);
                        if (namedMatch) {
                            effects.push(new MundaneEffect({ name: namedMatch[1].trim(), effect: namedMatch[2].trim() }));
                        } else {
                            effects.push(new MundaneEffect({ effect: part.trim() }));
                        }
                    }
                }
            }
        }

        if (effects.length === 0 && abilityData.flavor) {
            effects.push(new MundaneEffect({ effect: abilityData.flavor }));
            delete abilityData.flavor;
        }

        const finalAbility = new Ability(abilityData);
        finalAbility.effects = new Effects(effects);
        return finalAbility;
    }

    private isNewEffect(line: string, previousLine: string): boolean {
        if (line.toLowerCase().startsWith('power roll')) return true;
        if (line.toLowerCase().startsWith('effect:')) return true;
        if (line.toLowerCase().startsWith('trigger:')) return true;

        const powerRollTierRegex = /^((\d+-\d+)|(\d+–\d+)|(\d+ or lower)|(\d+ or higher)|(\d+\+)|crit|critical)/i;
        if (powerRollTierRegex.test(line)) {
            return false; // Tiers are never a new effect, they are part of a power roll
        }

        if (line.startsWith('•')) return false;

        const namedEffectRegex = /^([A-Z][a-zA-Z\s\d]*\s\d*):\s*(.*)/;
        if (namedEffectRegex.test(line)) {
            const match = line.match(namedEffectRegex);
            if (match) {
                const name = match[1].trim();
                if (/distance|target|keywords|trigger/i.test(name)) {
                    return false;
                }
                if (/Persistent \d+/.test(name)) return true;
                return true;
            }
        }

        return false;
    }

    private groupEffectLines(lines: string[]): string[][] {
        if (!lines.length) return [];
        const groups: string[][] = [];
        let currentGroup: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const isTier = /^((\d+-\d+)|(\d+–\d+)|(\d+ or lower)|(\d+ or higher)|(\d+\+)|crit|critical)/i.test(line);

            if (i > 0 && this.isNewEffect(line, lines[i - 1])) {
                if (currentGroup.length > 0) groups.push(currentGroup);
                currentGroup = [line];
            } else {
                // Special handling for tiers to ensure they group with a preceding Power Roll line
                if (isTier && currentGroup.length > 0 && !currentGroup.some(l => l.toLowerCase().startsWith('power roll') || /^((\d+-\d+)|(\d+ or lower)|(\d+ or higher)|(\d+\+)|crit|critical)/i.test(l))) {
                    if (currentGroup.length > 0) groups.push(currentGroup);
                    currentGroup = [line];
                } else {
                    currentGroup.push(line);
                }
            }
        }
        if (currentGroup.length > 0) groups.push(currentGroup);
        return groups;
    }

    private joinAndFormatEffectLines(lines: string[]): string {
        if (!lines || lines.length === 0) return '';
        // Join with spaces, but handle bullet points by putting them on a new line.
        return lines.join(' ').replace(/\s*•/g, '\n•').trim();
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

