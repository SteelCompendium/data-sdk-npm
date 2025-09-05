import * as fs from 'fs';
import * as path from 'path';
import { Statblock } from '../src/model/Statblock';
import { Feature } from '../src/model/Feature';
import { Trait } from '../src/model/Trait';
import { Characteristics } from '../src/model/Characteristics';
import { Effect, PowerRollEffect, MundaneEffect } from '../src/model/Effect';
import { parse } from 'yaml';
import { stringify } from 'yaml';

const models: { [key: string]: any } = {
    'statblock': Statblock,
    'ability': Feature,
    'trait': Trait,
    'characteristics': Characteristics,
    'powerrolleffect': PowerRollEffect,
    'mundaneeffect': MundaneEffect,
};

const modelName = process.argv[2]?.toLowerCase();
const inputFile = process.argv[3];

if (!modelName || !models[modelName]) {
    console.error(`Invalid model name. Available models: ${Object.keys(models).join(', ')}`);
    process.exit(1);
}

if (!inputFile) {
    console.error('Input file not specified.');
    process.exit(1);
}

const ModelClass = models[modelName];
const fileContents = fs.readFileSync(inputFile, 'utf8');
const fileExtension = path.extname(inputFile);

let modelInstance;
let modelInstances: any[] = [];

if (fileExtension === '.yaml' || fileExtension === '.yml') {
    const parsed = parse(fileContents);
    if (Array.isArray(parsed)) {
        modelInstances = Effect.allFrom(parsed);
    } else {
        modelInstance = ModelClass.from(parsed);
    }
} else if (fileExtension === '.json') {
    const parsed = JSON.parse(fileContents);
    if (Array.isArray(parsed)) {
        modelInstances = Effect.allFrom(parsed);
    } else {
        modelInstance = ModelClass.from(JSON.parse(fileContents));
    }
} else {
    console.error(`Unsupported file extension: ${fileExtension}`);
    process.exit(1);
}

if (modelInstances.length > 0) {
    const outputJson = JSON.stringify(modelInstances, null, 2);
    const outputYaml = stringify(modelInstances);

    const inputFileName = path.basename(inputFile);
    const outputFileNameJson = inputFileName.replace(fileExtension, '.json');
    const outputFileNameYaml = inputFileName.replace(fileExtension, '.yaml');

    const outputDir = path.join(path.dirname(inputFile), '..', 'output');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(path.join(outputDir, outputFileNameJson), outputJson);
    fs.writeFileSync(path.join(outputDir, outputFileNameYaml), outputYaml);

    console.log(`Generated ${outputFileNameJson} and ${outputFileNameYaml} in ${outputDir}`);
} else {
    const outputJson = modelInstance.toJson();
    const outputYaml = modelInstance.toYaml();

    const inputFileName = path.basename(inputFile);
    const outputFileNameJson = inputFileName.replace(fileExtension, '.json');
    const outputFileNameYaml = inputFileName.replace(fileExtension, '.yaml');

    const outputDir = path.join(path.dirname(inputFile), '..', 'output');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(path.join(outputDir, outputFileNameJson), outputJson);
    fs.writeFileSync(path.join(outputDir, outputFileNameYaml), outputYaml);

    console.log(`Generated ${outputFileNameJson} and ${outputFileNameYaml} in ${outputDir}`);
} 