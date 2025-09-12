#!/usr/bin/env node
/**
 * CLI to convert Steel Compendium data between formats.
 *
 * Usage:
 *   sc-convert --from <yaml|json|markdown> --to <yaml|json|markdown> [--output <outpath>] <input>
 *
 * Example:
 *   npm run build && npm link && sc-convert --from markdown --to json --type feature ../data-gen/staging/heroes/8_formatted_md/Abilities/Fury/1st-Level\ Features/Back.md --output ./tmp
 *
 *   npm run build && npm link && sc-convert --from markdown --to json --type statblock ../data-gen/staging/monsters/8_formatted_md/Monsters/Angulotls/Statblocks/Angulotl\ Pollywog.md --output ./tmp
 */

import {promises as fs, readFileSync as rfs} from 'fs';
import {dirname, extname, join, basename, resolve} from 'path';

import {JsonWriter} from '../io/json/JsonWriter';
import {YamlWriter} from '../io/yaml/YamlWriter';
import {MarkdownFeatureWriter, MarkdownStatblockWriter} from '../io/markdown';
import {SteelCompendiumIdentifier, SteelCompendiumFormat} from '../io/SteelCompendiumIdentifier';
import {Feature, Statblock} from '../model';
import {Featureblock} from "../model/Featureblock";
import {MarkdownFeatureblockWriter} from "../io/markdown/MarkdownFeatureblockWriter";

interface CLIArgs {
    from: SteelCompendiumFormat;
    to: SteelCompendiumFormat;
    type?: string;
    output?: string;
    input: string;
}

function getPkg() {
    const pkgPath = resolve(__dirname, "../../package.json");
    return JSON.parse(rfs(pkgPath, "utf8"));
}

function parseArgs(): CLIArgs {
    const args = process.argv.slice(2);
    const cli: Partial<CLIArgs> = {from: undefined, to: undefined};
    const rest: string[] = [];

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--from':
                cli.from = args[++i] as SteelCompendiumFormat;
                break;
            case '--to':
                cli.to = args[++i] as SteelCompendiumFormat;
                break;
            case '--type':
                cli.type = args[++i];
                break;
            case '--output':
                cli.output = args[++i];
                break;
            case '--version':
                console.log(getPkg().version);
                process.exit(0);
                break;
            default:
                if (args[i].startsWith('--')) {
                    console.error(`Unknown flag: ${args[i]}`);
                    process.exit(1);
                }
                rest.push(args[i]);
        }
    }

    if (rest.length !== 1 || !cli.from || !cli.to) {
        console.error(`Usage: sc-convert --from <yaml|json|markdown> --to <yaml|json|markdown> [--type <feature|statblock|featureblock>] [--output <out>] <input>`);
        process.exit(1);
    }

    return {
        from: cli.from!,
        to: cli.to!,
        type: cli.type,
        output: cli.output,
        input: rest[0],
    };
}

async function convertPath(inPath: string, outBase: string | undefined, from: SteelCompendiumFormat, to: SteelCompendiumFormat, type: string = 'feature') {
    const stat = await fs.stat(inPath);
    if (stat.isDirectory()) {
        // Recurse into directory
        const entries = await fs.readdir(inPath);
        for (const name of entries) {
            await convertPath(
                join(inPath, name),
                outBase ? join(outBase, name) : undefined,
                from,
                to,
                type
            );
        }
    } else {
        // ignore index.md files
        if (inPath.toLowerCase().endsWith('index.md')) return;

        // Filter by `from` extension
        const ext = extname(inPath).toLowerCase();
        const validExts = from === SteelCompendiumFormat.Json ? ['.json']
            : from === SteelCompendiumFormat.Yaml ? ['.yml', '.yaml']
                : from === SteelCompendiumFormat.Markdown ? ['.md']
                    : [];
        if (!validExts.includes(ext)) return;

        const source = await fs.readFile(inPath, 'utf8');

        const idRes = SteelCompendiumIdentifier.parse(from, type)
        const model = idRes.getReader().read(source);

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
                if (model instanceof Feature) writer = new MarkdownFeatureWriter();
                else if (model instanceof Statblock) writer = new MarkdownStatblockWriter();
                else if (model instanceof Featureblock) writer = new MarkdownFeatureblockWriter();
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
            const outExt = to === SteelCompendiumFormat.Json ? '.json'
                : to === SteelCompendiumFormat.Yaml ? '.yaml'
                    : to === SteelCompendiumFormat.Markdown ? '.md'
                        : '';
            const finalOut = stat.isDirectory()
                ? outBase
                : outBase.endsWith(outExt)
                    ? outBase
                    : dirname(outBase) + '/' + basename(outBase, extname(outBase)) + outExt;
            await fs.mkdir(dirname(finalOut), {recursive: true});
            await fs.writeFile(finalOut, outContent, 'utf8');
        }
    }
}

async function main() {
    const {input, output, from, to, type} = parseArgs();
    const outBase = output;
    await convertPath(input, outBase, from, to, type);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
