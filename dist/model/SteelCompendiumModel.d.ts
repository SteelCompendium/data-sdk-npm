import { SteelCompendiumDTO } from "../dto/SteelCompendiumDTO";
import { IDataReader, IDataWriter } from "../io";
export declare abstract class SteelCompendiumModel<D extends SteelCompendiumDTO<any>> implements SteelCompendiumPseudoModel {
    static read<T extends SteelCompendiumModel<any>>(reader: IDataReader<T>, source: string): T;
    write(writer: IDataWriter<this>): string;
    toJson(): string;
    toYaml(): string;
    abstract toDTO(): Partial<D>;
}
export interface SteelCompendiumPseudoModel {
}
export type ModelDTOAdapter<M extends SteelCompendiumModel<T>, T extends SteelCompendiumDTO<M>> = (source: Partial<T>) => M;
