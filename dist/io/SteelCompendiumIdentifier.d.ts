import { IDataReader } from './IDataReader';
import { Ability, Statblock } from '../model';
export declare enum SteelCompendiumFormat {
    Json = "json",
    Yaml = "yaml",
    Xml = "xml",
    Markdown = "markdown",
    Unknown = "unknown"
}
export interface IdentificationResult {
    format: SteelCompendiumFormat;
    model: typeof Ability | typeof Statblock | null;
    getReader(): IDataReader<Ability | Statblock>;
}
export declare class SteelCompendiumIdentifier {
    static parse(format: string, model: string): IdentificationResult;
    static identify(source: string): IdentificationResult;
    private static identifyModelType;
    private static isMarkdownAbility;
    private static isStatblock;
    private static isAbility;
}
