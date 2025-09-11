import {Feature} from "../../model";
import {IDataWriter} from "../IDataWriter";
import {Effect} from "../../model";
import * as yaml from 'js-yaml';

export class MarkdownFeatureWriter implements IDataWriter<Feature> {
    write(data: Feature, blockquote_output: boolean = false): string {
        const parts: string[] = [];
        const linePrefix = blockquote_output ? '> ' : '';


        if (data.metadata && Object.keys(data.metadata).length > 0) {
            const yamlString = yaml.dump(data.metadata);
            parts.push(`---\n${yamlString.trim()}\n---`);
        }

        if (data.name) {
            const prefix = '**';
            const suffix = '**';
            // TODO - No icons on non-blockquote?  Hero Abilities dont have icons... so for now, yes?
            const iconPrefix = blockquote_output ? this.getIconPrefix(data) : '';
            let title = `${iconPrefix}${prefix}${data.name}`;
            if (data.cost) {
                title += ` (${data.cost})`;
            }
            title += `${suffix}`;
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

        if (data.usage) {
            header1.push(`**${data.usage}**`);
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

        if (data.effects) {
            const effectParts = data.effects.map(e => this.writeEffect(e));

            // if (data.effects.length === 0) {
            //     return parts.join('\n\n');
            // }
            //
            // // TODO this should be something else...
            // const mappedEffects = data.effects.map(e => {
            //     if (e instanceof Effect) return e;
            //     if (e.roll) return new PowerRollEffect(e);
            //     if (e.effect && e.t1) return new TestEffect(e);
            //     return new MundaneEffect(e);
            // });
            // const effectParts = mappedEffects.map(e => this.writeEffect(e));
            parts.push(effectParts.join('\n\n'));
        }

        let md = parts.join('\n\n');

        if (linePrefix) {
            // ^ start-of-line, gm = every line
            md = md.replace(/^/gm, linePrefix).replace(/^> >/gm, '>>');
        }
        return md;
    }

    private getIconPrefix(a: Feature): string {
        if (a.icon) {
            return `${a.icon} `;
        }
        if (a.isTrait()) {
            return '⭐️ ';
        }
        if (a.cost?.toLowerCase().includes("villain action")) {
            return '☠️ ';
        } else if (a.usage?.toLowerCase().includes("triggered")) {
            return '❗️ ';
        } else if (a.distance?.toLowerCase().includes("melee") && a.distance?.toLowerCase().includes("ranged")) {
            return '⚔️ ';
        } else if (a.distance?.toLowerCase().includes("melee")) {
            return '🗡 ';
        } else if (a.distance?.toLowerCase().includes("ranged")) {
            return '🏹 ';
        } else if (a.distance?.toLowerCase().includes("self")) {
            return '👤 ';
        } else if (a.distance?.toLowerCase().includes("special")) {
            return '🌀 ';
        } else if (a.distance?.toLowerCase().includes("burst")
            || a.distance?.toLowerCase().includes("aura")) {
            return '❇️ ';
        } else if (a.distance?.toLowerCase().includes("cube")
            || a.distance?.toLowerCase().includes("line")
            || a.distance?.toLowerCase().includes("wall")) {
            return '🔳 ';
        }

        return '';
    }

    private writeEffect(effect: Effect): string {
        const effectParts: string[] = [];

        let name;
        if (effect.name) {
            name = effect.name;
            if (effect.cost) {
                name += ` (${effect.cost})`;
            }
        } else if (effect.cost) {
            name = effect.cost;
        }

        if (!effect.name && !effect.cost && effect.effect) {
            effectParts.push(`${effect.effect.trim()}\n`);
        } else if (name && effect.effect) {
            effectParts.push(`**${name}:** ${effect.effect.trim()}\n`);
        }

        if (effect.roll) {
            effectParts.push(`**${effect.roll.trim()}:**\n`);
        }
        if (effect.tier1) {
            effectParts.push(`- **≤11:** ${effect.tier1.trim()}`);
        }
        if (effect.tier2) {
            effectParts.push(`- **12-16:** ${effect.tier2.trim()}`);
        }
        if (effect.tier3) {
            effectParts.push(`- **17+:** ${effect.tier3.trim()}`);
        }
        if (effect.crit) {
            effectParts.push(`- **Natural 19-20:** ${effect.crit.trim()}`);
        }
        if (effect.features && effect.features.length > 0) {
            let items = effect.features.map((f:Feature) => this.write(f, true));
            effectParts.push(...items);
        }

        return effectParts.join('\n').trim();
    }
} 