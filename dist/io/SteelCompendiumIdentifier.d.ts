import { IDataReader } from './IDataReader';
import { Ability, Statblock } from '../model';
export declare enum SteelCompendiumFormat {
    Json = "json",
    Yaml = "yaml",
    PrereleasePdfAbilityText = "prerelease-pdf-ability-text",
    PrereleasePdfStatblockText = "prerelease-pdf-statblock-text",
    Unknown = "unknown"
}
export interface IdentificationResult {
    format: SteelCompendiumFormat;
    getReader(): IDataReader<Ability | Statblock>;
}
export declare class SteelCompendiumIdentifier {
    static identify(source: string): IdentificationResult;
    private static identifyModelType;
    private static isStatblock;
    private static isAbility;
}
