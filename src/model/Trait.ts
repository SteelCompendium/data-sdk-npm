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

    public static fromSource = (data: any): Trait => Trait.fromDTO(new TraitDTO(data));

    public static fromDTO(dto: TraitDTO): Trait {
        return new Trait({
            ...dto,
            effects: Effects.fromDTO(dto.effects),
        });
    }

    public static read(reader: IDataReader<Trait>, source: string): Trait {
        return reader.read(source);
    }

    public toDTO(): any {
        return {
            name: this.name ?? "",
            type: this.type ?? "",
            effects: this.effects.toDTO(),
        };
    }
}
