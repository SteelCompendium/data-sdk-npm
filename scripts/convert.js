"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const Statblock_1 = require("../src/model/Statblock");
const Ability_1 = require("../src/model/Ability");
const Trait_1 = require("../src/model/Trait");
const Characteristics_1 = require("../src/model/Characteristics");
const Effect_1 = require("../src/model/Effect");
const yaml_1 = require("yaml");
const yaml_2 = require("yaml");
const models = {
    'statblock': Statblock_1.Statblock,
    'ability': Ability_1.Ability,
    'trait': Trait_1.Trait,
    'characteristics': Characteristics_1.Characteristics,
    'powerrolleffect': Effect_1.PowerRollEffect,
    'mundaneeffect': Effect_1.MundaneEffect,
};
const modelName = (_a = process.argv[2]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
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
let modelInstances = [];
if (fileExtension === '.yaml' || fileExtension === '.yml') {
    const parsed = (0, yaml_1.parse)(fileContents);
    if (Array.isArray(parsed)) {
        modelInstances = Effect_1.Effect.allFrom(parsed);
    }
    else {
        modelInstance = ModelClass.from(parsed);
    }
}
else if (fileExtension === '.json') {
    const parsed = JSON.parse(fileContents);
    if (Array.isArray(parsed)) {
        modelInstances = Effect_1.Effect.allFrom(parsed);
    }
    else {
        modelInstance = ModelClass.from(JSON.parse(fileContents));
    }
}
else {
    console.error(`Unsupported file extension: ${fileExtension}`);
    process.exit(1);
}
if (modelInstances.length > 0) {
    const outputJson = JSON.stringify(modelInstances, null, 2);
    const outputYaml = (0, yaml_2.stringify)(modelInstances);
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
else {
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
//# sourceMappingURL=convert.js.map