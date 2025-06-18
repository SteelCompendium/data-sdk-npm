import { SteelCompendiumDTO } from "../dto/SteelCompendiumDTO";
import { IDataReader, IDataWriter, JsonWriter, YamlWriter } from "../io";

export abstract class SteelCompendiumModel<D extends SteelCompendiumDTO<any>> {
    public static read<T extends SteelCompendiumModel<any>>(reader: IDataReader<T>, source: string): T {
        return reader.read(source);
    }

    public write(writer: IDataWriter<this>): string {
        return writer.write(this);
    }

    // public toJson(): string {
    //     return this.write(new JsonWriter<this>());
    // }

    // public toYaml(): string {
    //     return this.write(new YamlWriter<this>());
    // }

    public abstract toDTO(): Partial<D>;
}

export type ModelDTOAdapter<M extends SteelCompendiumModel<T>, T extends SteelCompendiumDTO<M>> = (source: Partial<T>) => M;