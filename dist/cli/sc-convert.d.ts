#!/usr/bin/env node
/**
 * CLI to convert Steel Compendium data between formats.
 *
 * Usage:
 *   sc-convert --from <yaml|json|markdown> --to <yaml|json|markdown> [--output <outpath>] <input>
 *
 * Example:
 *   npm run build && npm link && sc-convert --from markdown --to json --type ability ../data-gen/staging/heroes/8_formatted_md/Abilities/Fury/1st-Level\ Features/Back.md --output ./tmp
 *
 *   npm run build && npm link && sc-convert --from markdown --to json --type statblock ../data-gen/staging/monsters/8_formatted_md/Monsters/Angulotls/Statblocks/Angulotl\ Pollywog.md --output ./tmp
 */
export {};
