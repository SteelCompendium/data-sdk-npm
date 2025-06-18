import { Effect } from "./Effect";
import { IDataReader } from "../io";
import { TraitDTO } from "../dto";
import { SteelCompendiumModel } from "./SteelCompendiumModel";

export class Trait extends SteelCompendiumModel<TraitDTO> {
    name!: string;
    type?: string;
    effects!: Effect[];

    public constructor(source: Partial<Trait>) {
        super();
        Object.assign(this, source);
        this.effects = source.effects ?? [];
    }

    public static fromDTO(dto: TraitDTO): Trait {
        return new Trait({
            ...dto,
            effects: Effect.allFromDTO(dto.effects),
        });
    }

    public static read(reader: IDataReader<TraitDTO, Trait>, source: string): Trait {
        return reader.parse(source);
    }

    public toDTO(): TraitDTO {
        return new TraitDTO({
            ...this,
            effects: this.effects.map(e => e.toDTO()),
        });
    }
}
