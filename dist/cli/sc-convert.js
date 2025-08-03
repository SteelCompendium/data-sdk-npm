#!/usr/bin/env node
"use strict";
/**
 * CLI to convert Steel Compendium data between formats.
 *
 * Usage:
 *   sc-convert --from <yaml|json|markdown> --to <yaml|json|markdown> [--output <outpath>] <input>
 *
 * Example:
 *   npm run build && npm link && sc-convert --from markdown --to json ../data-gen/staging/heroes/9_formatted/Abilities/Introduction/1st-Level\ Features/This\ Is\ An\ H8\ Header.md --output ./tmp
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const JsonWriter_1 = require("../io/json/JsonWriter"); // :contentReference[oaicite:0]{index=0}
const YamlWriter_1 = require("../io/yaml/YamlWriter"); // :contentReference[oaicite:1]{index=1}
const markdown_1 = require("../io/markdown"); // :contentReference[oaicite:2]{index=2}
const SteelCompendiumIdentifier_1 = require("../io/SteelCompendiumIdentifier"); // :contentReference[oaicite:3]{index=3}
const model_1 = require("../model");
const xml_1 = require("../io/xml"); // :contentReference[oaicite:4]{index=4}
function parseArgs() {
    const args = process.argv.slice(2);
    const cli = { from: undefined, to: undefined };
    const rest = [];
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--from':
                cli.from = args[++i];
                break;
            case '--to':
                cli.to = args[++i];
                break;
            case '--output':
                cli.output = args[++i];
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
        console.error(`Usage: sc-convert --from <yaml|json|markdown> --to <yaml|json|markdown> [--output <out>] <input>`);
        process.exit(1);
    }
    return {
        from: cli.from,
        to: cli.to,
        output: cli.output,
        input: rest[0],
    };
}
function convertPath(inPath, outBase, from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        const stat = yield fs_1.promises.stat(inPath);
        if (stat.isDirectory()) {
            // Recurse into directory
            const entries = yield fs_1.promises.readdir(inPath);
            for (const name of entries) {
                yield convertPath((0, path_1.join)(inPath, name), outBase ? (0, path_1.join)(outBase, name) : undefined, from, to);
            }
        }
        else {
            // ignore index.md files
            if (inPath.toLowerCase().endsWith('index.md'))
                return;
            // Filter by `from` extension
            const ext = (0, path_1.extname)(inPath).toLowerCase();
            const validExts = from === SteelCompendiumIdentifier_1.SteelCompendiumFormat.Json ? ['.json']
                : from === SteelCompendiumIdentifier_1.SteelCompendiumFormat.Yaml ? ['.yml', '.yaml']
                    : from === SteelCompendiumIdentifier_1.SteelCompendiumFormat.Markdown ? ['.md']
                        : from === SteelCompendiumIdentifier_1.SteelCompendiumFormat.Xml ? ['.xml']
                            : [];
            if (!validExts.includes(ext))
                return;
            const source = yield fs_1.promises.readFile(inPath, 'utf8');
            // TODO - this identifier is wrong (markdown/prereleasetext), ignore for now
            const idRes = SteelCompendiumIdentifier_1.SteelCompendiumIdentifier.identify(source);
            if (idRes.format !== from) {
                console.warn(`⚠️  Warning: detected format "${idRes.format}" but --from="${from}" was given.`);
            }
            const model = idRes.getReader().read(source);
            // // This was hard-coded for abilities only
            // let reader: any;
            // switch (from) {
            //     case SteelCompendiumFormat.Json:
            //         reader = new JsonReader(Ability.modelDTOAdapter);
            //         break;
            //     case SteelCompendiumFormat.Yaml:
            //         reader = new YamlReader(Statblock.modelDTOAdapter);
            //         break;
            //     case SteelCompendiumFormat.Markdown:
            //         reader = new MarkdownAbilityReader();
            //         break;
            //     default:
            //         throw new Error(`Unsupported --from format "${from}"`);
            // }
            // const model = reader.read(source);
            // Pick the correct writer
            let writer;
            switch (to) {
                case SteelCompendiumIdentifier_1.SteelCompendiumFormat.Json:
                    writer = new JsonWriter_1.JsonWriter();
                    break;
                case SteelCompendiumIdentifier_1.SteelCompendiumFormat.Yaml:
                    writer = new YamlWriter_1.YamlWriter();
                    break;
                case SteelCompendiumIdentifier_1.SteelCompendiumFormat.Xml:
                    if (model instanceof model_1.Ability)
                        writer = new xml_1.XmlAbilityWriter();
                    // else if (model instanceof Statblock) writer = new XmlWriter('statblock');
                    else
                        throw new Error('No XML writer for this model');
                    break;
                case SteelCompendiumIdentifier_1.SteelCompendiumFormat.Markdown:
                    if (model instanceof model_1.Ability)
                        writer = new markdown_1.MarkdownAbilityWriter();
                    else if (model instanceof model_1.Statblock)
                        writer = new markdown_1.MarkdownStatblockWriter();
                    else
                        throw new Error('No Markdown writer for this model');
                    break;
                default:
                    throw new Error(`Unsupported --to format "${to}"`);
            }
            const outContent = model.write(writer);
            // Determine output path
            if (!outBase) {
                // single-file & no --output → stdout
                process.stdout.write(outContent);
            }
            else {
                // preserve output extension
                const outExt = to === SteelCompendiumIdentifier_1.SteelCompendiumFormat.Json ? '.json'
                    : to === SteelCompendiumIdentifier_1.SteelCompendiumFormat.Yaml ? '.yaml'
                        : to === SteelCompendiumIdentifier_1.SteelCompendiumFormat.Markdown ? '.md'
                            : to === SteelCompendiumIdentifier_1.SteelCompendiumFormat.Xml ? '.xml'
                                : '';
                const finalOut = stat.isDirectory()
                    ? outBase
                    : outBase.endsWith(outExt)
                        ? outBase
                        : (0, path_1.dirname)(outBase) + '/' + (0, path_1.basename)(outBase, (0, path_1.extname)(outBase)) + outExt;
                yield fs_1.promises.mkdir((0, path_1.dirname)(finalOut), { recursive: true });
                yield fs_1.promises.writeFile(finalOut, outContent, 'utf8');
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { input, output, from, to } = parseArgs();
        const outBase = output;
        yield convertPath(input, outBase, from, to);
    });
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=sc-convert.js.map