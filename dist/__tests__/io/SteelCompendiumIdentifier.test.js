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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const __1 = require("../..");
describe('SteelCompendiumIdentifier', () => {
    const dataDir = path.join(__dirname, '../../__tests__/data');
    const getTestFiles = (dir) => {
        let files = [];
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                files = files.concat(getTestFiles(fullPath));
            }
            else {
                files.push(fullPath);
            }
        }
        return files;
    };
    const getExpectedFormat = (filePath) => {
        if (filePath.includes('dto-json')) {
            return __1.SteelCompendiumFormat.Json;
        }
        if (filePath.includes('dto-yaml')) {
            return __1.SteelCompendiumFormat.Yaml;
        }
        if (filePath.includes('prerelease-pdf')) {
            return __1.SteelCompendiumFormat.PrereleasePdfText;
        }
        return __1.SteelCompendiumFormat.Unknown;
    };
    const getExpectedModel = (filePath) => {
        if (filePath.includes('ability')) {
            return __1.Ability;
        }
        if (filePath.includes('statblock')) {
            return __1.Statblock;
        }
        return null;
    };
    const allFiles = getTestFiles(dataDir);
    allFiles.forEach(file => {
        const expectedFormat = getExpectedFormat(file);
        if (expectedFormat === __1.SteelCompendiumFormat.Unknown) {
            return;
        }
        const expectedModel = getExpectedModel(file);
        if (expectedModel === null) {
            return;
        }
        it(`should identify ${path.relative(dataDir, file)} as ${expectedFormat} and model ${expectedModel.name}`, () => {
            const content = fs.readFileSync(file, 'utf-8');
            const result = __1.SteelCompendiumIdentifier.identify(content);
            expect(result.format).toBe(expectedFormat);
            expect(result.model).toBe(expectedModel);
        });
    });
    it('should return Unknown for an unidentifiable format', () => {
        const content = 'this is not a valid format';
        const result = __1.SteelCompendiumIdentifier.identify(content);
        expect(result.format).toBe(__1.SteelCompendiumFormat.Unknown);
        expect(result.model).toBeNull();
    });
});
//# sourceMappingURL=SteelCompendiumIdentifier.test.js.map