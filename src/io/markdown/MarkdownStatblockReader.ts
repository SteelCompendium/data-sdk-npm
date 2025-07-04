import { Statblock, Trait, MundaneEffect, Effects } from "../../model";
import { IDataReader } from "../IDataReader";
import { MarkdownAbilityReader } from "./MarkdownAbilityReader";
import { Ability } from "../../model/Ability";

export class MarkdownStatblockReader implements IDataReader<Statblock> {
    private abilityReader = new MarkdownAbilityReader();

    public read(content: string): Statblock {
        const partial: Partial<Statblock> & { characteristics: any } = {
            characteristics: {
                might: 0,
                agility: 0,
                reason: 0,
                intuition: 0,
                presence: 0
            },
        };

        const separatorIndex = content.indexOf('\n---\n');
        const mainContent = separatorIndex !== -1 ? content.substring(0, separatorIndex) : content;
        const abilitiesContent = separatorIndex !== -1 ? content.substring(separatorIndex + 5) : undefined;

        const mainLines = mainContent.split('\n');

        const tableLines: string[] = [];
        let lineIdx = 0;
        while (lineIdx < mainLines.length && mainLines[lineIdx].startsWith('|')) {
            tableLines.push(mainLines[lineIdx]);
            lineIdx++;
        }
        this.parseStatblockTable(tableLines, partial);

        while (lineIdx < mainLines.length && mainLines[lineIdx].trim() === '') {
            lineIdx++;
        }

        const traits: Trait[] = [];
        while (lineIdx < mainLines.length) {
            const line = mainLines[lineIdx];
            if (line.startsWith('#####')) {
                const trait: Partial<Trait> = { name: line.replace(/#+\s*/, '').trim() };
                lineIdx++;

                while (lineIdx < mainLines.length && mainLines[lineIdx].trim() === '') {
                    lineIdx++;
                }

                const effects: MundaneEffect[] = [];
                while (lineIdx < mainLines.length && !mainLines[lineIdx].startsWith('#####')) {
                    const currentLine = mainLines[lineIdx];
                    const effectMatch = currentLine.match(/\*\*(.+?):\*\* (.*)/);
                    if (effectMatch) {
                        const nameAndCost = effectMatch[1];
                        let effect = effectMatch[2];
                        lineIdx++;
                        while (lineIdx < mainLines.length && mainLines[lineIdx].trim() !== '' && !mainLines[lineIdx].startsWith('#####') && !mainLines[lineIdx].startsWith('**')) {
                            effect += '\n' + mainLines[lineIdx];
                            lineIdx++;
                        }

                        const effectProps: Partial<MundaneEffect> = { effect: effect.trim() };
                        const nameCostMatch = nameAndCost.match(/(.*?) \((.*)\)/);

                        let name: string | undefined;
                        if (nameCostMatch) {
                            name = nameCostMatch[1].trim();
                            effectProps.cost = nameCostMatch[2].trim();
                        } else {
                            name = nameAndCost.trim();
                        }

                        if (name.toLowerCase() !== 'effect') {
                            effectProps.name = name;
                        }

                        effects.push(new MundaneEffect(effectProps as any));
                    } else {
                        lineIdx++;
                    }
                }
                trait.effects = new Effects(effects);
                traits.push(new Trait(trait));
            } else {
                lineIdx++;
            }
        }
        partial.traits = traits;

        if (abilitiesContent) {
            const abilityStrings = abilitiesContent.split(/(?=#####\s)/).filter(s => s.trim());
            partial.abilities = abilityStrings.map(s => this.abilityReader.read(s.trim()));
        }

        return new Statblock(partial as any);
    }

    private parseStatblockTable(tableLines: string[], partial: Partial<Statblock> & { characteristics: any }) {
        tableLines.forEach(line => {
            if (line.includes('**')) {
                const cells = line.split('|').map(c => c.trim()).filter(Boolean);
                if (cells.length === 2) {
                    this.parseRow(cells[0], partial);
                    this.parseRow(cells[1], partial);
                }
            }
        });
    }

    private parseRow(cell: string, partial: Partial<Statblock> & { characteristics: any }) {
        const cleanCell = cell.replace(/\*/g, '');
        if (cleanCell.startsWith('Level:')) {
            const level = parseInt(cleanCell.replace('Level:', '').trim(), 10);
            partial.level = isNaN(level) ? 0 : level;
            const roles = cleanCell.replace(`Level: ${level}`, '').trim();
            partial.roles = roles === '-' ? [] : roles.split(',').map(s => s.trim());
        } else if (cleanCell.startsWith('Ancestry:')) {
            const val = cleanCell.replace('Ancestry:', '').trim();
            partial.ancestry = val === '-' ? [] : val.split(',').map(s => s.trim());
        } else if (cleanCell.startsWith('Stamina:')) {
            partial.stamina = parseInt(cleanCell.replace('Stamina:', '').trim(), 10) || 0;
        } else if (cleanCell.startsWith('EV:')) {
            partial.ev = cleanCell.replace('EV:', '').trim() || '0';
        } else if (cleanCell.startsWith('Speed:')) {
            partial.speed = cleanCell.replace('Speed:', '').trim() || '0';
        } else if (cleanCell.startsWith('Immunity:')) {
            const val = cleanCell.replace('Immunity:', '').trim();
            partial.immunities = val === '-' ? [] : val.split(',').map(s => s.trim());
        } else if (cleanCell.startsWith('Weakness:')) {
            const val = cleanCell.replace('Weakness:', '').trim();
            partial.weaknesses = val === '-' ? [] : val.split(',').map(s => s.trim());
        } else if (cleanCell.startsWith('Might:')) {
            partial.characteristics.might = parseInt(cleanCell.replace('Might:', '').trim(), 10) || 0;
        } else if (cleanCell.startsWith('Free Strike:')) {
            partial.freeStrike = parseInt(cleanCell.replace('Free Strike:', '').trim(), 10) || 0;
        } else if (cleanCell.startsWith('Agility:')) {
            partial.characteristics.agility = parseInt(cleanCell.replace('Agility:', '').trim(), 10) || 0;
        } else if (cleanCell.startsWith('Reason:')) {
            partial.characteristics.reason = parseInt(cleanCell.replace('Reason:', '').trim(), 10) || 0;
        } else if (cleanCell.startsWith('Intuition:')) {
            partial.characteristics.intuition = parseInt(cleanCell.replace('Intuition:', '').trim(), 10) || 0;
        } else if (cleanCell.startsWith('Size:')) {
            partial.size = cleanCell.replace('Size:', '').trim();
        } else if (cleanCell.startsWith('Presence:')) {
            partial.characteristics.presence = parseInt(cleanCell.replace('Presence:', '').trim(), 10) || 0;
        } else if (cleanCell.startsWith('Stability:')) {
            partial.stability = parseInt(cleanCell.replace('Stability:', '').trim(), 10) || 0;
        } else if (cleanCell.startsWith('With Captain:')) {
            const val = cleanCell.replace('With Captain:', '').trim();
            if (val !== '-') {
                partial.withCaptain = val
            }
        } else if (cleanCell.toLowerCase().startsWith('level ')) {
            const match = cleanCell.match(/Level (\d+)\s+(.*)/i);
            if (match) {
                partial.level = parseInt(match[1], 10);
                partial.roles = match[2].split(',').map(s => s.trim());
            }
        } else if (cleanCell.startsWith('Movement:')) {
            const val = cleanCell.replace('Movement:', '').trim();
            if (val !== '-') {
                partial.speed = `${partial.speed} (${val})`;
            }
        } else if (!cleanCell.includes(':')) {
            partial.name = cleanCell;
        }
    }
} 