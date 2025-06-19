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
                if (namedEffectMatch && !powerRollTierMatch) {
                    inEffectSection = true;
                }
            }

            if (inEffectSection) {
                effectLines.push(line);
            } else {
                propertyLines.push(line);
            }
        }

        const types = ['Action', 'Maneuver', 'Triggered Action', 'Villain Action 1', 'Main Action'];
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
                            foundTypes.push(type === 'Main Action' ? 'Action' : type);
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
            let currentEffect: { name?: string, effect: string, roll?: string } & Record<string, string> | null = null;
            let currentEffectLines: string[] = [];

            const flushEffect = () => {
                if (currentEffectLines.length > 0) {
                    const firstLine = currentEffectLines[0];

                    const powerRollMatch = firstLine.match(/Power Roll\s*\+\s*([a-zA-Z]+)/i);
                    if (powerRollMatch) {
                        currentEffect = { roll: `Power Roll + ${powerRollMatch[1]}` } as any;
                        for (let i = 1; i < currentEffectLines.length; i++) {
                            const line = currentEffectLines[i];
                            const tierMatch = line.match(/^((?:\d+-\d+)|(?:\d+ or lower)|(?:\d+\+)|crit(?:ical)?):\s*(.*)/i);
                            if (tierMatch && currentEffect) {
                                const key = tierMatch[1].replace(' or lower', ' or lower').replace('critical', 'crit');
                                currentEffect[key] = tierMatch[2];
                            }
                        }
                        if (currentEffect) {
                            effects.push(new PowerRollEffect(currentEffect));
                        }
                    } else {
                        effects.push(new MundaneEffect({ effect: currentEffectLines.join(' ') }));
                    }
                }
                currentEffectLines = [];
            }


            for (const line of effectLines) {
                if (line.toLowerCase().startsWith('effect:')) {
                    flushEffect();
                    currentEffectLines.push(line.substring('effect:'.length).trim());
                } else if (line.startsWith('•')) {
                    flushEffect();
                    currentEffectLines.push(line.substring(1).trim());
                } else {
                    const namedMatch = line.match(/^([a-zA-Z0-9\s]+):\s(.+)/);
                    if (namedMatch) {
                        flushEffect();
                        currentEffectLines.push(line);
                    } else if (currentEffectLines.length > 0) {
                        currentEffectLines[currentEffectLines.length - 1] += ' ' + line;
                    }
                }
            }
            flushEffect();

        } else if (propertyLines.length > 0 && effects.length === 0) {
            effects.push(new MundaneEffect({ effect: propertyLines.join(' ') }));
            if (abilityData.flavor) delete abilityData.flavor;
            if (abilityData.keywords) delete abilityData.keywords;
            if (abilityData.distance) delete abilityData.distance;
            if (abilityData.target) delete abilityData.target;
        }

        if (!abilityData.type) {
            abilityData.type = 'Unknown';
        }

        const finalAbility = new Ability(abilityData);
        finalAbility.effects = new Effects(effects);
        return finalAbility;
    }
} 