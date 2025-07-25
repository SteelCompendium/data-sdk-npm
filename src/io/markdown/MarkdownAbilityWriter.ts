import { Ability } from "../../model/Ability";
import { IDataWriter } from "../IDataWriter";
import { Effect } from "../../model/Effect";
import { MundaneEffect } from "../../model";
import { PowerRollEffect } from "../../model";
import * as yaml from 'js-yaml';

export class MarkdownAbilityWriter implements IDataWriter<Ability> {
    write(data: Ability): string {
        // Basically trying to differentiate abilities and features here. If there are keywords, its an ability
        const includeEffectsToken: boolean = !!(data.keywords && data.keywords.length > 0);
        const parts: string[] = [];

        if (data.metadata && Object.keys(data.metadata).length > 0) {
            const yamlString = yaml.dump(data.metadata);
            parts.push(`---\n${yamlString.trim()}\n---`);
        }

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

        if (header1.some(h => h) || row2.some(r => r)) {
            const table: string[] = [];
            const col1Width = Math.max(header1[0].length, row2[0].length);
            const col2Width = Math.max(header1[1].length, row2[1].length);

            const paddedHeader1 = [
                header1[0].padEnd(col1Width),
                header1[1].padStart(col2Width)
            ];
            table.push(`| ${paddedHeader1.join(' | ')} |`);

            const separator1 = '-'.repeat(col1Width);
            const separator2 = '-'.repeat(col2Width);
            table.push(`| ${separator1} | ${separator2}:|`);

            const paddedRow2 = [
                row2[0].padEnd(col1Width),
                row2[1].padStart(col2Width)
            ];
            table.push(`| ${paddedRow2.join(' | ')} |`);

            parts.push(table.join('\n'));
        }

        if (data.trigger) {
            parts.push(`**Trigger:** ${data.trigger}`);
        }

        if (data.effects && (data.effects.effects || data.effects)) {
            const allEffects = (data.effects.effects || data.effects) as any[];

            if (allEffects.length === 0) {
                return parts.join('\n\n');
            }

            const mappedEffects = allEffects.map(e => {
                if (e instanceof Effect) return e;
                if (e.roll) return new PowerRollEffect(e);
                return new MundaneEffect(e);
            });

            const effectParts = mappedEffects.map(e => this.writeEffect(e, includeEffectsToken));
            parts.push(effectParts.join('\n\n'));
        }

        return parts.join('\n\n');
    }

    private writeEffect(effect: Effect, includeEffectToken: boolean): string {
        if (effect instanceof MundaneEffect) {
            return this.writeMundaneEffect(effect, includeEffectToken);
        } else if (effect instanceof PowerRollEffect) {
            return this.writePowerRollEffect(effect);
        }
        return '';
    }

    private writeMundaneEffect(effect: MundaneEffect, includeEffectToken: boolean): string {
        let name = "Effect";
        if (effect.name) {
            name = effect.name;
            if (effect.cost) {
                name += ` (${effect.cost})`;
            }
        } else if (effect.cost) {
            name = effect.cost;
        }

        if (!effect.name && !effect.cost && !includeEffectToken) {
            return effect.effect.trim();
        }
        return `**${name}:** ${effect.effect.trim()}`
    }

    private writePowerRollEffect(effect: PowerRollEffect): string {
        const rollParts: string[] = [];
        if (effect.roll) {
            rollParts.push(`**${effect.roll}:**\n`);
        }
        if (effect.t1) {
            rollParts.push(`- **≤11:** ${effect.t1.trim()}`);
        }
        if (effect.t2) {
            rollParts.push(`- **12-16:** ${effect.t2.trim()}`);
        }
        if (effect.t3) {
            rollParts.push(`- **17+:** ${effect.t3.trim()}`);
        }
        if (effect.crit) {
            rollParts.push(`- **Natural 19-20:** ${effect.crit.trim()}`);
        }
        return rollParts.join('\n');
    }
} 