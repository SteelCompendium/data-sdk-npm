import { Ability } from "../../model/Ability";
import { IDataWriter } from "../IDataWriter";
import { Effect } from "../../model/Effect";
import { MundaneEffect } from "../../model";
import { PowerRollEffect } from "../../model";

export class MarkdownAbilityWriter implements IDataWriter<Ability> {
    write(data: Ability): string {
        const parts: string[] = [];

        if (data.name) {
            let title = `**${data.name}`;
            if (data.cost) {
                title += ` (${data.cost})`;
            }
            title += `**`;
            parts.push(title);
        }

        if (data.flavor) {
            parts.push(`*${data.flavor}*`);
        }

        const table: string[] = [];
        const header1: string[] = [];
        if (data.keywords && data.keywords.length > 0) {
            header1.push(`**${data.keywords.join(', ')}**`);
        } else {
            header1.push('');
        }

        if (data.type) {
            header1.push(`**${data.type}**`);
        } else {
            header1.push('');
        }
        table.push(`| ${header1.join(' | ')} |`);
        table.push(`|-----------------|---------------------------:|`);

        const row2: string[] = [];
        if (data.distance) {
            row2.push(`**📏 ${data.distance}**`);
        } else {
            row2.push('');
        }
        if (data.target) {
            row2.push(`**🎯 ${data.target}**`);
        } else {
            row2.push('');
        }
        table.push(`| ${row2.join(' | ')} |`);
        if (header1.some(h => h) || row2.some(r => r)) {
            parts.push(table.join('\n'));
        }


        if (data.effects && data.effects.effects && data.effects.effects.length > 0) {
            const effectParts: string[] = [];

            const mundaneEffects = data.effects.effects.filter(e => e instanceof MundaneEffect && !e.name) as MundaneEffect[];
            const otherEffects = data.effects.effects.filter(e => !(e instanceof MundaneEffect && !e.name));

            if (mundaneEffects.length > 0) {
                if (mundaneEffects.length === 1) {
                    const effectText = mundaneEffects[0].effect.trim();
                    effectParts.push(`**Effect:** ${effectText}`);
                } else {
                    const intro = mundaneEffects[0].effect.trim();
                    if (intro.endsWith(':')) {
                        const listItems = mundaneEffects.slice(1).map(e => `- ${e.effect.trim()}`);
                        effectParts.push(`**Effect:** ${intro}\n\n${listItems.join('\n')}`);
                    } else {
                        const listItems = mundaneEffects.map(e => `- ${e.effect.trim()}`);
                        effectParts.push(`**Effect:**\n\n${listItems.join('\n')}`);
                    }
                }
            }

            for (const effect of otherEffects) {
                effectParts.push(this.writeEffect(effect));
            }
            parts.push(effectParts.join('\n\n'));
        }

        return parts.join('\n\n');
    }

    private writeEffect(effect: Effect): string {
        if (effect instanceof MundaneEffect) {
            return this.writeMundaneEffect(effect);
        } else if (effect instanceof PowerRollEffect) {
            return this.writePowerRollEffect(effect);
        }
        return '';
    }

    private writeMundaneEffect(effect: MundaneEffect): string {
        if (effect.name) {
            let str = `**${effect.name}`;
            if (effect.cost) {
                str += ` ${effect.cost}`;
            }
            str += `:** ${effect.effect}`;
            return str;
        }

        return effect.effect.trim();
    }

    private writePowerRollEffect(effect: PowerRollEffect): string {
        const rollParts: string[] = [];
        if (effect.roll) {
            rollParts.push(`**Power Roll + ${effect.roll}:**`);
        }
        if (effect.t1) {
            rollParts.push(`- **≤11:** ${effect.t1}`);
        }
        if (effect.t2) {
            rollParts.push(`- **12-16:** ${effect.t2}`);
        }
        if (effect.t3) {
            rollParts.push(`- **17+:** ${effect.t3}`);
        }
        if (effect.crit) {
            rollParts.push(`- **Natural 19-20:** ${effect.crit}`);
        }
        return rollParts.join('\n');
    }
} 