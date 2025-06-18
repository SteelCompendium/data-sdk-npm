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
        const newDto = { ...dto };
        if (newDto.name) {
            newDto.name = newDto.name.trim();
        }

        return new Trait({
            ...newDto,
            effects: Effects.fromDTO(dto.effects),
        });
    }

    public static read(reader: IDataReader<Trait>, source: string): Trait {
        return reader.read(source);
    }

    public toDTO(): TraitDTO {
        const dto: Partial<TraitDTO> = {
            name: this.name,
        };

        if (this.type !== undefined) dto.type = this.type;
        dto.effects = this.effects.toDTO();

        return new TraitDTO(dto);
    }
}
