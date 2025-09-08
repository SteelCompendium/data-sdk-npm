import matter from "gray-matter";
import {IDataReader} from "../IDataReader";
import {Featureblock} from "../../model/Featureblock";
import {MarkdownFeatureReader} from "./MarkdownFeatureReader";
import {Feature, FeatureStat} from "../../model";

type KeyVal = { key: string; value: string };

export class MarkdownFeatureblockReader extends IDataReader<Featureblock> {
    private abilityReader = new MarkdownFeatureReader();

    public read(source: string): Featureblock {
        const { data: fm, content } = matter(source);

        // 1) Title & inline meta (name, level, type)
        const title = this.findFirstHeader(content) ?? String(fm?.item_name ?? fm?.title ?? "").trim();
        if (!title) {
            throw new Error("FeatureblockMarkdownReader: could not find a title/header.");
        }
        const { name, level, featureblock_type } = this.parseTitle(title);

        // 2) Slice content into pre-feature (flavor / stats) and features (blockquote groups)
        const blocks = this.splitIntoBlocks(content);
        const preFeature = blocks.pre.trim();
        const featureBlocks = blocks.blocks;

        // 3) Stats bullets → top-level + stats[]
        const statsBullets = this.extractStatsBullets(preFeature);
        const ev = this.pickStat(statsBullets, "EV");
        const stamina = this.pickStat(statsBullets, "Stamina");
        const size = this.pickStat(statsBullets, "Size");

        // Remaining non-core bullets → stats[]
        const coreKeys = new Set(["ev", "stamina", "size"]);
        const extras: KeyVal[] = statsBullets.filter(kv => !coreKeys.has(normalizeKey(kv.key)));

        // 4) Flavor (preFeature without the bullet list)
        const flavor = this.extractFlavor(preFeature);

        // 5) Feature callouts (blockquote groups) → Feature[]
        const features: Feature[] = featureBlocks.map(md => this.abilityReader.read(md));

        return new Featureblock({
            name,
            featureblock_type,
            level,
            ev,
            stamina,
            size,
            flavor: flavor || undefined,
            stats: extras.length ? extras.map(kv => new FeatureStat(kv.key, kv.value)) : undefined,
            features,
        });
    }

    // ----- helpers -----

    private findFirstHeader(md: string): string | null {
        // prefer the first non-frontmatter header (any level)
        const m = md.match(/^(#{1,6})\s+(.+?)\s*$/m);
        return m ? m[2].trim() : null;
    }

    private parseTitle(title: string): { name: string; level?: number; featureblock_type?: string } {
        // Examples:
        // "Pressure Plate (Level 1 Trigger Support)" -> name="Pressure Plate", level=1, type="Trigger Support"
        // "Tree of Might (Level 5 Hazard Hexer)"     -> name="Tree of Might", level=5, type="Hazard Hexer"
        // "Ajax's Malice (Malice Features)"          -> name="Ajax's Malice", type="Malice Features"
        const paren = title.match(/^(.*)\s*\(([^)]+)\)\s*$/);
        if (!paren) return { name: title.trim() };

        const base = paren[1].trim();
        const inside = paren[2].trim();
        const lvl = inside.match(/Level\s+(\d+)\s*(.*)$/i);
        if (lvl) {
            const level = parseInt(lvl[1], 10);
            const tail = (lvl[2] || "").trim();
            const featureblock_type = tail || undefined;
            return { name: base, level: Number.isFinite(level) ? level : undefined, featureblock_type };
        }
        return { name: base, featureblock_type: inside };
    }

    private splitIntoBlocks(md: string): { pre: string; blocks: string[] } {
        // We treat contiguous blockquote groups (lines beginning with '>') as one feature block.
        // HTML comments like <!-- --> may separate groups; we ignore them but preserve grouping.
        const lines = md.split(/\r?\n/);

        // Skip up to & including the first header line – we only want the body
        let i = 0;
        while (i < lines.length && !/^#{1,6}\s+/.test(lines[i])) i++;
        if (i < lines.length) i++; // skip the header line itself

        const preLines: string[] = [];
        const blocks: string[] = [];

        let buf: string[] = [];
        let insideBQ = false;

        const flush = () => {
            if (buf.length) {
                // keep only lines beginning with '>' or '>' + space, strip leading '>'
                const bq = buf
                    .map(l => l.replace(/^>\s?/, ""))
                    .join("\n")
                    .trim();
                if (bq) blocks.push(bq);
                buf = [];
            }
        };

        for (; i < lines.length; i++) {
            const line = lines[i];

            if (/^\s*<!--.*?-->\s*$/.test(line)) {
                // comment; treat as separator if we were inside a blockquote
                if (insideBQ) {
                    flush();
                    insideBQ = false;
                } else {
                    preLines.push(line);
                }
                continue;
            }

            if (/^\s*>/.test(line)) {
                buf.push(line);
                insideBQ = true;
            } else {
                if (insideBQ) {
                    // blockquote ended
                    flush();
                    insideBQ = false;
                }
                preLines.push(line);
            }
        }
        // tail
        if (insideBQ) flush();

        return { pre: preLines.join("\n"), blocks };
    }

    private extractStatsBullets(md: string): KeyVal[] {
        // Matches bullets like: - **EV:** 2
        // Also allows other keys e.g. "Typical Space", "Link", "Immunity", etc.
        const out: KeyVal[] = [];
        const re = /^-\s*\*\*([^*]+?):\*\*\s*(.+?)\s*$/gm;
        let m: RegExpExecArray | null;
        while ((m = re.exec(md)) !== null) {
            out.push({ key: cleanupKey(m[1]), value: m[2].trim() });
        }
        return out;

        function cleanupKey(k: string) {
            return k.replace(/\s+/g, " ").trim();
        }
    }

    private pickStat(stats: KeyVal[], key: string): string | undefined {
        const k = normalizeKey(key);
        const hit = stats.find(s => normalizeKey(s.key) === k);
        return hit?.value;
    }

    private extractFlavor(pre: string): string {
        // Flavor is the paragraph(s) after the header and before the first bullet list
        // Remove frontmatter-ish comments and blank lines around
        const body = pre.replace(/^\s*<!--.*?-->\s*$/gm, "").trim();

        // If there are bullets, cut them off
        const idx = body.search(/^\s*-\s+\*\*/m);
        const flavor = idx >= 0 ? body.slice(0, idx) : body;
        return flavor.trim();
    }
}

// small helpers
function normalizeKey(k: string): string {
    return k.replace(/\s+/g, " ").trim().toLowerCase();
}