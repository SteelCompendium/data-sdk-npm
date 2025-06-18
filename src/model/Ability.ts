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

    public static fromDTOData = (data: any): Ability => Ability.fromDTO(new AbilityDTO(data));

    public static fromDTO(dto: AbilityDTO): Ability {
        return new Ability({
            ...dto,
            effects: Effects.fromDTO(dto.effects),
        });
    }

    public static read(reader: IDataReader<Ability>, source: string): Ability {
        return reader.read(source);
    }

    public toDTO(): any {
        const dto: Partial<AbilityDTO> = {};
        if (this.name !== undefined) dto.name = this.name;
        if (this.cost !== undefined) dto.cost = this.cost;
        if (this.flavor !== undefined) dto.flavor = this.flavor;
        if (this.keywords !== undefined) dto.keywords = this.keywords;
        if (this.type !== undefined) dto.type = this.type;
        if (this.distance !== undefined) dto.distance = this.distance;
        if (this.target !== undefined) dto.target = this.target;
        if (this.trigger !== undefined) dto.trigger = this.trigger;
        dto.effects = this.effects.toDTO();

        return dto;
    }
}
