import { IDataReader } from './IDataReader';
import { Ability, Statblock } from '../model';
import { Featureblock } from '../model/Featureblock';
export declare enum SteelCompendiumFormat {
    Json = "json",
    Yaml = "yaml",
    Xml = "xml",
    Markdown = "markdown",
    Unknown = "unknown"
}
export interface IdentificationResult {
    format: SteelCompendiumFormat;
    model: typeof Ability | typeof Statblock | typeof Featureblock | null;
    getReader(): IDataReader<Ability | Statblock | Featureblock>;
}
export declare class SteelCompendiumIdentifier {
    static parse(format: string, model: string): IdentificationResult;
    static identify(source: string): IdentificationResult;
    private static identifyModelType;
    private static isMarkdownAbility;
    private static isMarkdownStatblock;
}
