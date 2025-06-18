import { IDataReader } from "../io";
import { TraitDTO } from "../dto";
import { SteelCompendiumModel } from "./SteelCompendiumModel";
import { Effects } from "./Effects";

export class Trait extends SteelCompendiumModel<TraitDTO> {
    name!: string;
    type?: string;
    effects: Effects;

    public constructor(source: Partial<Trait>) {
        super();
        Object.assign(this, source);
        this.effects = source.effects ?? new Effects([]);
    }

    public static fromDTO(dto: TraitDTO): Trait {
        return new Trait({
            ...dto,
            effects: Effects.fromDTO(dto.effects),
        });
    }

    public static read(reader: IDataReader<TraitDTO, Trait>, source: string): Trait {
        return reader.parse(source);
    }

    public toDTO(): TraitDTO {
        return new TraitDTO({
            ...this,
            effects: this.effects.toDTO(),
        });
    }
}
