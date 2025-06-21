import { Statblock } from "../../model";
import { IDataExtractor } from "../IDataExtractor";
import { PrereleasePdfStatblockReader } from "./PrereleasePdfStatblockReader";

export class PrereleasePdfStatblockExtractor implements IDataExtractor<Statblock> {
    private readonly statblockReader: PrereleasePdfStatblockReader = new PrereleasePdfStatblockReader();

    extract(text: string): Statblock[] {
        const statblocks = this.extractText(text);
        return statblocks.map(this.statblockReader.read);
    }

    extractText(text: string): string[] {
        const lines = text.split(/\r?\n/);

        const statblockStarts: { name: string; index: number }[] = [];
        const statblockHeaderRegex = /l\s?evel\s+\d+[^\+]/i;

        lines.forEach((line, index) => {
            if (statblockHeaderRegex.test(line)) {
                // To be a statblock header, it must also have a name
                const lineWithNext = line + "\n" + (lines[index + 1] ?? "");
                try {
                    const statblock = this.statblockReader.read(lineWithNext);
                    if (statblock.name && statblock.roles.length > 0) {
                        statblockStarts.push({ name: statblock.name, index });
                    }
                } catch (e) {
                    // Not a valid statblock header, ignore
                }
            }
        });

        return statblockStarts.map(({ index }, i) => {
            const start = index;
            const nextStatblockStart = i < statblockStarts.length - 1 ? statblockStarts[i + 1].index : lines.length;

            let end = nextStatblockStart;

            for (let j = start + 1; j < nextStatblockStart; j++) {
                const line = lines[j].trim();
                if (line.length === 0) {
                    continue;
                }

                const isAllCaps = line.toUpperCase() === line && /[A-Z]/.test(line);
                const isStatblockHeader = statblockHeaderRegex.test(line);

                if (isAllCaps && !isStatblockHeader) {
                    end = j;
                    break;
                }
            }
            const block = lines
                .slice(start, end)
                .filter(line => !line.includes("MCDM Productions"))
                .join("\n");
            return block;
        });
    }
}