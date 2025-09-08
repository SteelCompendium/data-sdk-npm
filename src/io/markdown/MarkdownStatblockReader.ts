import {Feature, FeatureType, Statblock} from "../../model";
import {IDataReader} from "../IDataReader";
import {MarkdownAbilityReader} from "./MarkdownAbilityReader";

export class MarkdownStatblockReader implements IDataReader<Statblock> {
    private abilityReader = new MarkdownAbilityReader();

    public read(content: string): Statblock {
        const partial: Partial<Statblock> & { characteristics: any } = {
            characteristics: { might: 0, agility: 0, reason: 0, intuition: 0, presence: 0 },
        };

        // Find the end of the frontmatter
        let lines = content.split('\n');
        let frontmatterEndIndex = -1;
        if (lines[0].trim() === '---') {
            frontmatterEndIndex = lines.slice(1).findIndex(line => line.trim() === '---');
            if (frontmatterEndIndex !== -1) {
                const frontmatterLines = lines.slice(1, frontmatterEndIndex + 1).join('\n');
                try {
                    // partial.metadata = yaml.load(frontmatterLines) as Record<string, any>;
                } catch (e) {
                    console.error("Error parsing frontmatter:", e);
                }

                // The index is in the sliced array, so we add 1 to get the index in the original array
                // and another 1 to get the line after the '---'
                lines = lines.slice(frontmatterEndIndex + 2);
            }
        }

        content = lines.join("\n")

        // ── Split main vs. abilities (after ---)
        const sep = '\n---\n';
        const sepIdx = content.indexOf(sep);
        const mainContent      = sepIdx !== -1 ? content.substring(0, sepIdx) : content;

        const mainLines = mainContent.split('\n');

        // ── 0) Optional bold title line **NAME** before the table
        let i = 0;
        while (i < mainLines.length && mainLines[i].trim() === '') i++;
        if (i < mainLines.length) {
            const m = mainLines[i].match(/^###### (.+?)$/);
            if (m) {
                partial.name = m[1].trim();
                i++;
                while (i < mainLines.length && mainLines[i].trim() === '') i++;
            }
        }

        // ── 1) Table: gather contiguous |...| lines starting at the first table row
        const tableLines: string[] = [];
        while (i < mainLines.length && mainLines[i].trim().startsWith('|')) {
            tableLines.push(mainLines[i]);
            i++;
        }

        this.parseStatblockTable(tableLines, partial);

        // ── 2) Traits: contiguous block-quote chunks after the table
        while (i < mainLines.length && mainLines[i].trim() === '') i++;

        const features: Feature[] = [];
        while (i < mainLines.length) {
            if (/^\s*>\s?/.test(mainLines[i])) {
                const block: string[] = [];
                while (i < mainLines.length && /^\s*>\s?/.test(mainLines[i])) {
                    block.push(mainLines[i].replace(/^\s*>\s?/, ''));
                    i++;
                }
                const feature = this.abilityReader.read(block.join('\n').trim());
                feature.feature_type = feature.isTrait() ? FeatureType.Trait : FeatureType.Ability;
            } else {
                i++;
            }
        }
        partial.features = features;

        return new Statblock(partial as any);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // New 5-column table parser
    // ──────────────────────────────────────────────────────────────────────────
    private parseStatblockTable(lines: string[], partial: Partial<Statblock> & { characteristics: any }) {
        if (!lines.length) return;

        const isSep = (s: string) => {
            const inner = s.trim().replace(/^\|/, '').replace(/\|$/, '');
            return /^[\s:\-\|]+$/.test(inner);
        };
        const splitRow = (line: string): string[] => {
            const inner = line.trim().replace(/^\|\s*/, '').replace(/\s*\|\s*$/, '');
            // preserve empties
            return inner.split('|').map(c => c.trim());
        };

        // Expect: header row, separator, then 3 data rows
        const rows: string[][] = [];
        for (const ln of lines) {
            if (!ln.trim().startsWith('|')) break;
            rows.push(splitRow(ln));
        }
        if (rows.length < 2 || !isSep(lines[1])) {
            // Not in the expected 5-col format; bail gracefully
            return;
        }

        // Row 0 (header data row): Ancestry | Movement | Level N | Roles | EV M
        const row0 = rows[0];
        // Normalize to 5 cells
        while (row0.length < 5) row0.push('');
        const [ancestryCell, /*movementHdr*/, levelHdr, rolesHdr, evHdr] = row0;

        // Name might have been read above; ancestry can be list or '-'
        if (ancestryCell && ancestryCell !== '-') {
            partial.ancestry = ancestryCell.split(',').map(s => s.trim()).filter(Boolean);
        } else {
            partial.ancestry = [];
        }

        // Level N
        const mLevel = (levelHdr || '').match(/Level\s+(\d+)/i);
        if (mLevel) partial.level = parseInt(mLevel[1], 10) || 0;

        // Roles (we show '-' in the new layout; keep empty array for '-')
        if (rolesHdr && rolesHdr !== '-') {
            partial.roles = rolesHdr.split(',').map(s => s.trim()).filter(Boolean);
        } else {
            partial.roles = [];
        }

        // EV M
        const mEv = (evHdr || '').match(/EV\s+(.+)/i);
        if (mEv) partial.ev = mEv[1];

        // Data rows start at index 2
        for (let r = 2; r < rows.length; r++) {
            const cells = rows[r];
            while (cells.length < 5) cells.push('');

            for (let c = 0; c < 5; c++) {
                const cell = cells[c];
                if (!cell) continue;

                // Expect "**value**<br>Label"
                const m = cell.match(/^\s*\*\*(.*?)\*\*\s*<br\s*\/?>\s*(.+?)\s*$/i);
                if (!m) continue;

                const valueRaw = m[1].trim();
                const label = m[2].trim().toLowerCase();

                const setList = (val: string) =>
                    val === '-' ? [] : val.split(',').map(s => s.trim()).filter(Boolean);

                switch (label) {
                    case 'size':
                        if (valueRaw) partial.size = valueRaw;
                        break;

                    case 'speed':
                        if (valueRaw && valueRaw !== '-') partial.speed = parseInt(valueRaw, 10) || 0;
                        break;

                    case 'stamina':
                        if (valueRaw) partial.stamina = valueRaw;
                        break;

                    case 'stability':
                        if (valueRaw && valueRaw !== '-') partial.stability = parseInt(valueRaw, 10) || 0;
                        break;

                    case 'free strike':
                        if (valueRaw && valueRaw !== '-') partial.freeStrike = parseInt(valueRaw, 10) || 0;
                        break;

                    case 'immunities':
                        partial.immunities = setList(valueRaw);
                        break;
                    case 'immunity':
                        partial.immunities = setList(valueRaw);
                        break;

                    case 'movement':
                        if (valueRaw !== '-') partial.movement = valueRaw;
                        break;

                    case 'with captain':
                        if (valueRaw !== '-') partial.withCaptain = valueRaw;
                        break;

                    case 'weaknesses':
                        partial.weaknesses = setList(valueRaw);
                        break;
                    case 'weakness':
                        partial.weaknesses = setList(valueRaw);
                        break;

                    case 'might':
                        partial.characteristics.might = parseInt(valueRaw, 10) || 0;
                        break;

                    case 'agility':
                        partial.characteristics.agility = parseInt(valueRaw, 10) || 0;
                        break;

                    case 'reason':
                        partial.characteristics.reason = parseInt(valueRaw, 10) || 0;
                        break;

                    case 'intuition':
                        partial.characteristics.intuition = parseInt(valueRaw, 10) || 0;
                        break;

                    case 'presence':
                        partial.characteristics.presence = parseInt(valueRaw, 10) || 0;
                        break;

                    default:
                        // Unknown label – ignore for forward-compat
                        break;
                }
            }
        }
    }
}
