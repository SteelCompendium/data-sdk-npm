import { IDataReader } from './IDataReader';
import { Ability, Statblock } from '../model';
export declare enum SteelCompendiumFormat {
    Json = "json",
    Yaml = "yaml",
    Markdown = "markdown",
    PrereleasePdfText = "prerelease-pdf-text",
    Unknown = "unknown"
}
export interface IdentificationResult {
    format: SteelCompendiumFormat;
    model: typeof Ability | typeof Statblock | null;
    getReader(): IDataReader<Ability | Statblock>;
}
export declare class SteelCompendiumIdentifier {
    static identify(source: string): IdentificationResult;
    private static identifyModelType;
    private static isMarkdownAbility;
    private static isStatblock;
    private static isAbility;
}
