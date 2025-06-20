import { SteelCompendiumModel } from "../model/SteelCompendiumModel";

export abstract class IDataExtractor<M extends SteelCompendiumModel<any>> {
    public abstract extract(source: string): M[];
    public abstract extractText(source: string): string[];
} 