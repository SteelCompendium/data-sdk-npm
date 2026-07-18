import { Feature } from '../model/Feature';
import { Kit } from '../model/Kit';
import { SteelCompendiumDTO } from './SteelCompendiumDTO';

export class KitDTO extends SteelCompendiumDTO<Kit> {
    type = Kit.KIT_TYPE;

    name!: string;
    scc?: string;
    kit_type?: string;
    flavor?: string;
    armor?: string[];
    weapon?: string[];
    equipment_text?: string;
    stamina_bonus?: string;
    speed_bonus?: string;
    stability_bonus?: string;
    melee_damage_bonus?: string;
    ranged_damage_bonus?: string;
    melee_distance_bonus?: string;
    ranged_distance_bonus?: string;
    disengage_bonus?: string;
    signature_ability?: any;
    content?: string;
    metadata?: Record<string, any>;

    public constructor(source: Partial<KitDTO>) {
        super(source, Kit.KIT_TYPE);
    }

    static partialFromModel(model: Kit): Partial<KitDTO> {
        const data: Partial<KitDTO> = { type: model.modelType() };
        if (model.name !== undefined) data.name = model.name;
        if (model.scc !== undefined) data.scc = model.scc;
        if (model.kit_type !== undefined) data.kit_type = model.kit_type;
        if (model.flavor !== undefined) data.flavor = model.flavor;
        if (model.armor !== undefined) data.armor = model.armor;
        if (model.weapon !== undefined) data.weapon = model.weapon;
        if (model.equipment_text !== undefined) data.equipment_text = model.equipment_text;
        if (model.stamina_bonus !== undefined) data.stamina_bonus = model.stamina_bonus;
        if (model.speed_bonus !== undefined) data.speed_bonus = model.speed_bonus;
        if (model.stability_bonus !== undefined) data.stability_bonus = model.stability_bonus;
        if (model.melee_damage_bonus !== undefined) data.melee_damage_bonus = model.melee_damage_bonus;
        if (model.ranged_damage_bonus !== undefined) data.ranged_damage_bonus = model.ranged_damage_bonus;
        if (model.melee_distance_bonus !== undefined) data.melee_distance_bonus = model.melee_distance_bonus;
        if (model.ranged_distance_bonus !== undefined) data.ranged_distance_bonus = model.ranged_distance_bonus;
        if (model.disengage_bonus !== undefined) data.disengage_bonus = model.disengage_bonus;
        if (model.signature_ability !== undefined) data.signature_ability = model.signature_ability.toDTO();
        if (model.content !== undefined) data.content = model.content;
        if (model.metadata !== undefined) data.metadata = model.metadata;
        return data;
    }

    public static fromModel(model: Kit): KitDTO {
        return new KitDTO(model.toDTO());
    }

    public toModel(): Kit {
        return Kit.fromDTO(this);
    }
}
