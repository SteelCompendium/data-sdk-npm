import { AbilityDTO } from "../dto";
import { Effects } from "./Effects";
import { ModelDTOAdapter, SteelCompendiumModel } from "./SteelCompendiumModel";
import { AbilityXmlDTO } from "../dto/AbilityXmlDTO";

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
    metadata?: Record<string, any>;

    public constructor(source: Partial<Ability>) {
        super();
        Object.assign(this, source);
        this.effects = source.effects ?? new Effects([]);
    }

    public static modelDTOAdapter: ModelDTOAdapter<Ability, AbilityDTO> = (source: Partial<AbilityDTO>) => new AbilityDTO(source).toModel();

    public static fromDTO(dto: AbilityDTO): Ability {
        return new Ability({
            ...dto,
            effects: Effects.fromDTO(dto.effects),
        });
    }

    public toDTO(): Partial<AbilityDTO> {
        return AbilityDTO.partialFromModel(this);
    }

    public toXmlDTO(): Partial<AbilityXmlDTO> {
        return AbilityXmlDTO.partialFromModel(this);
    }
}
