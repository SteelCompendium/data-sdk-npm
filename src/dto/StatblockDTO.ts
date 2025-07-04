import { SteelCompendiumDTO } from './SteelCompendiumDTO';
import { Statblock } from '../model/Statblock';

export class StatblockDTO extends SteelCompendiumDTO<Statblock> {
    name!: string;
    roles!: string[];
    ancestry!: string[];
    ev!: string;
    stamina!: number;
    speed!: number;
    movement!: string;
    size!: string;
    stability!: number;
    free_strike!: number;
    melee_distance?: number;
    ranged_distance?: number;
    might!: number;
    agility!: number;
    reason!: number;
    intuition!: number;
    presence!: number;
    level?: number;
    immunities?: string[];
    weaknesses?: string[];
    with_captain?: string;
    traits?: any[];
    abilities?: any[];

    public constructor(source: Partial<StatblockDTO>) {
        super(source);
        this.traits = source.traits ?? [];
        this.abilities = source.abilities ?? [];
    }

    static partialFromModel(model: Statblock): Partial<StatblockDTO> {
        const data: Partial<StatblockDTO> = {}
        if (model.name !== undefined) data.name = model.name;
        if (model.level !== undefined) data.level = model.level;
        if (model.roles !== undefined) data.roles = model.roles;
        if (model.ancestry !== undefined) data.ancestry = model.ancestry;
        if (model.ev !== undefined) data.ev = model.ev;
        if (model.stamina !== undefined) data.stamina = model.stamina;
        if (model.immunities !== undefined && model.immunities.length > 0) data.immunities = model.immunities;
        if (model.weaknesses !== undefined && model.weaknesses.length > 0) data.weaknesses = model.weaknesses;
        if (model.speed !== undefined) data.speed = model.speed;
        if (model.movement !== undefined) data.movement = model.movement;
        if (model.meleeDistance !== undefined) data.melee_distance = model.meleeDistance;
        if (model.rangedDistance !== undefined) data.ranged_distance = model.rangedDistance;
        if (model.size !== undefined) data.size = model.size;
        if (model.stability !== undefined) data.stability = model.stability;
        if (model.freeStrike !== undefined) data.free_strike = model.freeStrike;
        if (model.withCaptain !== undefined) data.with_captain = model.withCaptain;
        if (model.characteristics !== undefined) {
            if (model.characteristics.might !== undefined) data.might = model.characteristics.might;
            if (model.characteristics.agility !== undefined) data.agility = model.characteristics.agility;
            if (model.characteristics.reason !== undefined) data.reason = model.characteristics.reason;
            if (model.characteristics.intuition !== undefined) data.intuition = model.characteristics.intuition;
            if (model.characteristics.presence !== undefined) data.presence = model.characteristics.presence;
        }
        if (model.traits !== undefined) data.traits = model.traits.map(t => t.toDTO());
        if (model.abilities !== undefined) data.abilities = model.abilities.map(a => a.toDTO());
        return data;
    }

    public static fromModel(model: Statblock): StatblockDTO {
        return new StatblockDTO(model.toDTO());
    }

    public toModel(): Statblock {
        return Statblock.fromDTO(this);
    }
} 