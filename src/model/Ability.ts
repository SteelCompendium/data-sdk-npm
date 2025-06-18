import { Effect } from "./Effect";
import { IDataReader, IDataWriter } from "../io";
import { AbilityDTO } from "../dto";
import { SteelCompendiumModel } from "./SteelCompendiumModel";

export class Ability extends SteelCompendiumModel<AbilityDTO> {
    name?: string;
    cost?: string;
    flavor?: string;
    keywords?: string[];
    type?: string;
    distance?: string;
    target?: string;
    trigger?: string;
    effects: Effect[];

    public constructor(source: Partial<Ability>) {
        super();
        Object.assign(this, source);
        this.effects = source.effects ?? [];
    }

    public static fromDTO(dto: AbilityDTO): Ability {
        return new Ability({
            ...dto,
            effects: Effect.allFromDTO(dto.effects),
        });
    }

    public static read(reader: IDataReader<AbilityDTO, Ability>, source: string): Ability {
        return reader.parse(source);
    }

    public toDTO(): AbilityDTO {
        return new AbilityDTO({
            ...this,
            effects: this.effects.map(e => e.toDTO()),
        });
    }
}
