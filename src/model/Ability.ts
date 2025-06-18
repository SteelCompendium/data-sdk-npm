import { IDataReader } from "../io";
import { AbilityDTO } from "../dto";
import { SteelCompendiumModel } from "./SteelCompendiumModel";
import { Effects } from "./Effects";

export class Ability extends SteelCompendiumModel<AbilityDTO> {
    name?: string;
    cost?: string;
    flavor?: string;
    keywords?: string[];
    type?: string;
    distance?: string;
    target?: string;
    trigger?: string;
    effects: Effects;

    public constructor(source: Partial<Ability>) {
        super();
        Object.assign(this, source);
        this.effects = source.effects ?? new Effects([]);
    }

    public static fromDTO(dto: AbilityDTO): Ability {
        return new Ability({
            ...dto,
            effects: Effects.fromDTO(dto.effects),
        });
    }

    public static read(reader: IDataReader<AbilityDTO, Ability>, source: string): Ability {
        return reader.parse(source);
    }

    public toDTO(): AbilityDTO {
        return new AbilityDTO({
            ...this,
            effects: this.effects.toDTO(),
        });
    }
}
