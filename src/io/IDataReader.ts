import { SteelCompendiumModel } from "../model/SteelCompendiumModel";

export interface IDataReader<T extends SteelCompendiumModel> {
    read(source: string): T;
} 