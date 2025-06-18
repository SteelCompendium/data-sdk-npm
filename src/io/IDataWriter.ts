import { SteelCompendiumModel } from "../model/SteelCompendiumModel";

export interface IDataWriter<T extends SteelCompendiumModel> {
    write(data: T): string;
} 