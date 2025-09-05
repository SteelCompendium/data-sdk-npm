import { AbilityDTO } from "../dto";
import { Effects } from "./Effects";
import { ModelDTOAdapter, SteelCompendiumModel } from "./SteelCompendiumModel";
import { AbilityXmlDTO } from "../dto/AbilityXmlDTO";

// Abilities as currently implemented blend the line of Ability and Trait...
export class Feature extends SteelCompendiumModel<AbilityDTO> {
    name?: string;
    icon?: string;
    cost?: string;
    flavor?: string;
    keywords?: string[];
    type?: string;
    distance?: string;
    target?: string;
    trigger?: string;
    effects: Effects;
    metadata?: Record<string, any>;

    public constructor(source: Partial<Feature>) {
        super();
        Object.assign(this, source);
        this.effects = source.effects ?? new Effects([]);
    }

    public static modelDTOAdapter: ModelDTOAdapter<Feature, AbilityDTO> = (source: Partial<AbilityDTO>) => new AbilityDTO(source).toModel();

    public static fromDTO(dto: AbilityDTO): Feature {
        return new Feature({
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

    // This is not comprehensive
    public isTrait() {
        return (!this.keywords || this.keywords?.length == 0) && !this.type && !this.distance && !this.target;
    }
}
