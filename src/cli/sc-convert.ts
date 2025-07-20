#!/usr/bin/env node
/**
 * CLI to convert Steel Compendium data between formats.
 *
 * Usage:
 *   sc-convert --from <yaml|json|markdown> --to <yaml|json|markdown> [--output <outpath>] <input>
 */

import { promises as fs } from 'fs';
import { dirname, extname, join, relative, basename } from 'path';

import { JsonWriter }      from '../io/json/JsonWriter';                       // :contentReference[oaicite:0]{index=0}
import { YamlWriter }      from '../io/yaml/YamlWriter';                       // :contentReference[oaicite:1]{index=1}
import {
    MarkdownAbilityReader,
    MarkdownAbilityWriter,
    MarkdownStatblockReader,
    MarkdownStatblockWriter,
} from '../io/markdown';                              // :contentReference[oaicite:2]{index=2}
import {
    SteelCompendiumIdentifier,
    SteelCompendiumFormat,
}                           from '../io/SteelCompendiumIdentifier';             // :contentReference[oaicite:3]{index=3}
import { Ability, Statblock } from '../model';
import {JsonReader, YamlReader} from "../io";                                  // :contentReference[oaicite:4]{index=4}

interface CLIArgs {
    from: SteelCompendiumFormat;
    to: SteelCompendiumFormat;
    output?: string;
    input: string;
}

function parseArgs(): CLIArgs {
    const args = process.argv.slice(2);
    const cli: Partial<CLIArgs> = { from: undefined, to: undefined };
    const rest: string[] = [];

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--from':   cli.from   = args[++i] as SteelCompendiumFormat; break;
            case '--to':     cli.to     = args[++i] as SteelCompendiumFormat; break;
            case '--output': cli.output = args[++i];                            break;
            default:
                if (args[i].startsWith('--')) {
                    console.error(`Unknown flag: ${args[i]}`);
                    process.exit(1);
                }
                rest.push(args[i]);
        }
    }

    if (rest.length !== 1 || !cli.from || !cli.to) {
        console.error(`Usage: sc-convert --from <yaml|json|markdown> --to <yaml|json|markdown> [--output <out>] <input>`);
        process.exit(1);
    }

    return {
        from:   cli.from!,
        to:     cli.to!,
        output: cli.output,
        input:  rest[0],
    };
}

async function convertPath(inPath: string, outBase: string | undefined, from: SteelCompendiumFormat, to: SteelCompendiumFormat) {
    const stat = await fs.stat(inPath);
    if (stat.isDirectory()) {
        // Recurse into directory
        const entries = await fs.readdir(inPath);
        for (const name of entries) {
            await convertPath(
                join(inPath, name),
                outBase ? join(outBase, name) : undefined,
                from,
                to
            );
        }
    } else {
        // Filter by `from` extension
        const ext = extname(inPath).toLowerCase();
        const validExts = from === SteelCompendiumFormat.Json     ? ['.json']
            : from === SteelCompendiumFormat.Yaml     ? ['.yml','.yaml']
                : from === SteelCompendiumFormat.Markdown ? ['.md']
                    : [];
        if (!validExts.includes(ext)) return;

        const source = await fs.readFile(inPath, 'utf8');
        // TODO - this identifier is wrong (markdown/prereleasetext), ignore for now
        // const idRes  = SteelCompendiumIdentifier.identify(source);
        // if (idRes.format !== from) {
        //     console.warn(`⚠️  Warning: detected format "${idRes.format}" but --from="${from}" was given.`);
        // }

        // TODO - support statblocks too
        let reader: any;
        switch (from) {
            case SteelCompendiumFormat.Json:
                reader = new JsonReader(Ability.modelDTOAdapter);
                break;
            case SteelCompendiumFormat.Yaml:
                reader = new YamlReader(Statblock.modelDTOAdapter);
                break;
            case SteelCompendiumFormat.Markdown:
                reader = new MarkdownAbilityReader();
                break;
            default:
                throw new Error(`Unsupported --from format "${from}"`);
        }

        const model = reader.read(source);

        // Pick the correct writer
        let writer: any;
        switch (to) {
            case SteelCompendiumFormat.Json:
                writer = new JsonWriter();
                break;
            case SteelCompendiumFormat.Yaml:
                writer = new YamlWriter();
                break;
            case SteelCompendiumFormat.Markdown:
                if (model instanceof Ability)  writer = new MarkdownAbilityWriter();
                else if (model instanceof Statblock) writer = new MarkdownStatblockWriter();
                else throw new Error('No Markdown writer for this model');
                break;
            default:
                throw new Error(`Unsupported --to format "${to}"`);
        }

        const outContent = (model as any).write(writer);
        // Determine output path
        if (!outBase) {
            // single-file & no --output → stdout
            process.stdout.write(outContent);
        } else {
            // preserve output extension
            const outExt = to === SteelCompendiumFormat.Json     ? '.json'
                : to === SteelCompendiumFormat.Yaml     ? '.yaml'
                    : to === SteelCompendiumFormat.Markdown ? '.md'
                        : '';
            const finalOut = stat.isDirectory()
                ? outBase
                : outBase.endsWith(outExt)
                    ? outBase
                    : dirname(outBase) + '/' + basename(outBase, extname(outBase)) + outExt;
            await fs.mkdir(dirname(finalOut), { recursive: true });
            await fs.writeFile(finalOut, outContent, 'utf8');
        }
    }
}

async function main() {
    const { input, output, from, to } = parseArgs();
    const outBase = output;
    await convertPath(input, outBase, from, to);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
