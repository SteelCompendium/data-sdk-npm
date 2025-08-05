"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownStatblockWriter = void 0;
const MarkdownAbilityWriter_1 = require("./MarkdownAbilityWriter");
class MarkdownStatblockWriter {
    constructor() {
        this.abilityWriter = new MarkdownAbilityWriter_1.MarkdownAbilityWriter();
    }
    write(data) {
        const parts = [];
        // Create the main statblock table
        parts.push(this.createStatblockTable(data));
        // Add traits
        if (data.traits && data.traits.length > 0) {
            for (const trait of data.traits) {
                if (!trait.name)
                    continue;
                // Build the trait block, then prefix each line with "> "
                const tLines = [];
                tLines.push(`> **${trait.name}**`);
                if (trait.effects && trait.effects.effects.length > 0) {
                    const effectLines = trait.effects.effects
                        .filter(e => e.effectType() === 'MundaneEffect')
                        .map((e) => {
                        const label = e.name ? `**${e.name.trim()}:** ` : '';
                        return `${label}${e.effect.trim()}`; // no leading \n
                    });
                    tLines.push(...effectLines);
                }
                // Insert a blank line before each trait block (outside the quote)
                parts.push('');
                // Quote-prefix every line of this trait
                parts.push(tLines.join('\n> \n> '));
            }
        }
        // Add abilities
        if (data.abilities && data.abilities.length > 0) {
            parts.push(""); // Empty line for spacing
            parts.push("---"); // Separator
            parts.push(""); // Empty line for spacing
            for (const ability of data.abilities) {
                parts.push(this.abilityWriter.write(ability, true));
                parts.push(""); // Empty line between abilities
            }
        }
        return parts.join('\n');
    }
    /**
     *  New stat-block layout
     *
     * **NAME**
     *
     * |  Ancestry  | Movement |    Level    | With Captain |     EV     |
     * |:----------:|:--------:|:-----------:|:------------:|:----------:|
     * | **Size**<br>Size      | **Speed**<br>Speed | **Stamina**<br>Stamina | **Stability**<br>Stability | **Free Strike**<br>Free Strike |
     * | **Immunities**<br>Immunities | **Movement**<br>Movement |           | **With Captain**<br>WithCaptain | **Weaknesses**<br>Weaknesses |
     * | **Might**<br>Might | **Agility**<br>Agility | **Reason**<br>Reason | **Intuition**<br>Intuition | **Presence**<br>Presence |
     */
    createStatblockTable(data) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        //-------------------------------------------------------------
        // Helper that returns "**val**<br>label" or "**-**<br>label"
        //-------------------------------------------------------------
        const cell = (val, label) => `**${val !== null && val !== void 0 ? val : '-'}**<br>${label}`;
        //-------------------------------------------------------------
        // Row 0 (header row)
        //-------------------------------------------------------------
        const ancestry = ((_a = data.ancestry) === null || _a === void 0 ? void 0 : _a.length) ? data.ancestry.join(', ') : '-';
        const movementDash = (_b = data.movement) !== null && _b !== void 0 ? _b : '-';
        const levelCell = `Level ${(_c = data.level) !== null && _c !== void 0 ? _c : 0}`;
        const roles = ((_d = data.roles) === null || _d === void 0 ? void 0 : _d.length) ? data.roles.join(', ') : '-'; // placeholder for col-4
        const evCell = `EV ${(_e = data.ev) !== null && _e !== void 0 ? _e : 0}`;
        const headerRow = [
            ancestry,
            movementDash,
            levelCell,
            roles,
            evCell,
        ];
        //-------------------------------------------------------------
        // Row 1: Size | Speed | Stamina | Stability | Free Strike
        //-------------------------------------------------------------
        const row1 = [
            cell((_f = data.size) !== null && _f !== void 0 ? _f : '-', 'Size'),
            cell((_g = data.speed) !== null && _g !== void 0 ? _g : '-', 'Speed'),
            cell((_h = data.stamina) !== null && _h !== void 0 ? _h : 0, 'Stamina'),
            cell((_j = data.stability) !== null && _j !== void 0 ? _j : 0, 'Stability'),
            cell((_k = data.freeStrike) !== null && _k !== void 0 ? _k : 0, 'Free Strike'),
        ];
        //-------------------------------------------------------------
        // Row 2: Immunities | Movement | (blank) | With Captain | Weaknesses
        //-------------------------------------------------------------
        const immunities = ((_l = data.immunities) === null || _l === void 0 ? void 0 : _l.length) ? data.immunities.join(', ') : '-';
        const weaknesses = ((_m = data.weaknesses) === null || _m === void 0 ? void 0 : _m.length) ? data.weaknesses.join(', ') : '-';
        const withCaptain = (_o = data.withCaptain) !== null && _o !== void 0 ? _o : '-';
        const row2 = [
            cell(immunities, 'Immunities'),
            cell((_p = data.movement) !== null && _p !== void 0 ? _p : '-', 'Movement'),
            '', // centre cell empty
            cell(withCaptain, 'With Captain'),
            cell(weaknesses, 'Weaknesses'),
        ];
        //-------------------------------------------------------------
        // Row 3: Characteristics
        //-------------------------------------------------------------
        const ch = data.characteristics;
        const row3 = [
            cell(this.formatCharacteristic(ch.might), 'Might'),
            cell(this.formatCharacteristic(ch.agility), 'Agility'),
            cell(this.formatCharacteristic(ch.reason), 'Reason'),
            cell(this.formatCharacteristic(ch.intuition), 'Intuition'),
            cell(this.formatCharacteristic(ch.presence), 'Presence'),
        ];
        //-------------------------------------------------------------
        // Build the markdown table
        //-------------------------------------------------------------
        const separator = '|:----------------------------:'.repeat(5) + '|';
        const toRow = (arr) => `| ${arr.map(c => c || ' ').join(' | ')} |`;
        const tableLines = [
            toRow(headerRow),
            separator,
            toRow(row1),
            toRow(row2),
            toRow(row3),
        ];
        //-------------------------------------------------------------
        // Title line + blank + table
        //-------------------------------------------------------------
        const title = `**${(_q = data.name) !== null && _q !== void 0 ? _q : 'Unnamed'}**`;
        return `${title}\n\n${tableLines.join('\n')}`;
    }
    formatCharacteristic(value) {
        if (value > 0) {
            return `+${value}`;
        }
        else if (value < 0) {
            return `${value}`;
        }
        else {
            return `+0`;
        }
    }
}
exports.MarkdownStatblockWriter = MarkdownStatblockWriter;
//# sourceMappingURL=MarkdownStatblockWriter.js.map