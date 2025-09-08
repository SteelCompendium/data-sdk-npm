import { SteelCompendiumDTO } from "../dto/SteelCompendiumDTO";
import { IDataReader, IDataWriter } from "../io";

export abstract class SteelCompendiumModel<D extends SteelCompendiumDTO<any>> implements SteelCompendiumPseudoModel {
    public static read<T extends SteelCompendiumModel<any>>(reader: IDataReader<T>, source: string): T {
        return reader.read(source);
    }

    public write(writer: IDataWriter<this>): string {
        return writer.write(this);
    }

    public toJson(): string {
        const { JsonWriter } = (require("../io") as {
            JsonWriter: new <T extends SteelCompendiumModel<any>>() => IDataWriter<T>
        });
        return this.write(new JsonWriter<this>());
    }

    public toYaml(): string {
        const { YamlWriter } = (require("../io") as {
            YamlWriter: new <T extends SteelCompendiumModel<any>>() => IDataWriter<T>
        });
        return this.write(new YamlWriter<this>());
    }

    public abstract toDTO(): Partial<D>;
    public abstract modelType(): string;
}

// Pseudo Models are for objects that are not directly mapped to a DTO
export interface SteelCompendiumPseudoModel { }

export type ModelDTOAdapter<M extends SteelCompendiumModel<T>, T extends SteelCompendiumDTO<M>> = (source: Partial<T>) => M;