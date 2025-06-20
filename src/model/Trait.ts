import { TraitDTO } from "../dto";
import { ModelDTOAdapter, SteelCompendiumModel } from "./SteelCompendiumModel";
import { Effects } from "./Effects";

export class Trait extends SteelCompendiumModel<TraitDTO> {
    name?: string;
    effects: Effects;

    public constructor(source: Partial<Trait>) {
        super();
        Object.assign(this, source);
        this.effects = source.effects ?? new Effects([]);
    }

    public static modelDTOAdapter: ModelDTOAdapter<Trait, TraitDTO> = (source: Partial<TraitDTO>) => new TraitDTO(source).toModel();

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

    public toDTO(): Partial<TraitDTO> {
        return TraitDTO.partialFromModel(this);
    }
}
