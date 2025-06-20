"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoDataReader = void 0;
const IDataReader_1 = require("./IDataReader");
const SteelCompendiumIdentifier_1 = require("./SteelCompendiumIdentifier");
class AutoDataReader extends IDataReader_1.IDataReader {
    read(source) {
        const identificationResult = SteelCompendiumIdentifier_1.SteelCompendiumIdentifier.identify(source);
        if (identificationResult.format === SteelCompendiumIdentifier_1.SteelCompendiumFormat.Unknown) {
            throw new Error("Could not identify the format of the provided data.");
        }
        const reader = identificationResult.getReader();
        return reader.read(source);
    }
}
exports.AutoDataReader = AutoDataReader;
//# sourceMappingURL=AutoDataReader.js.map