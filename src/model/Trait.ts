import { Effect } from "./Effect";
import { IDataReader } from "../io";
import { TraitDTO } from "../dto";
import { SteelCompendiumModel } from "./SteelCompendiumModel";

export class Trait extends SteelCompendiumModel {
    name: string;
    type?: string;
    effects: Effect[];

    constructor(name: string, type: string, effects: Effect[]) {
        super();
        this.name = name;
        this.type = type;
        this.effects = effects;
    }

    public static fromDTO(dto: TraitDTO): Trait {
        return new Trait(
            dto.name?.trim() ?? '',
            dto.type?.trim() ?? '',
            dto.effects ? Effect.allFromDTO(dto.effects) : []
        );
    }

    public toDTO(): TraitDTO {
        return {
            name: this.name!,
            type: this.type,
            effects: this.effects.map(e => e.toDTO()),
        };
    }

    public static read(reader: IDataReader<Trait>, source: string): Trait {
        return reader.read(source);
    }
}
