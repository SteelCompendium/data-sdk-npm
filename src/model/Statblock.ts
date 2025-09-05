import {Feature} from "./Feature";
import {Trait} from "./Trait";
import {Characteristics} from "./Characteristics";
import {StatblockDTO} from "../dto";
import {ModelDTOAdapter, SteelCompendiumModel} from "./SteelCompendiumModel";

export class Statblock extends SteelCompendiumModel<StatblockDTO> {
    name!: string;
    level?: number;
    roles!: string[];
    ancestry!: string[];
    ev!: string;
    stamina!: string;
    immunities?: string[];
    weaknesses?: string[];
    speed!: number;
    movement!: string;
    size!: string;
    stability!: number;
    freeStrike!: number;
    meleeDistance?: number
    rangedDistance?: number
    withCaptain?: string;
    characteristics!: Characteristics;
    traits!: Trait[];
    abilities!: Feature[];

    public constructor(source: Partial<Statblock>) {
        super();
        Object.assign(this, source);
        this.characteristics = source.characteristics ?? new Characteristics(0, 0, 0, 0, 0);
        this.traits = source.traits ?? [];
        this.abilities = source.abilities ?? [];
    }

    public static modelDTOAdapter: ModelDTOAdapter<Statblock, StatblockDTO> = (source: Partial<StatblockDTO>) => new StatblockDTO(source).toModel();

    public static fromDTO(dto: StatblockDTO): Statblock {
        return new Statblock({
            ...dto,
            freeStrike: dto.free_strike,
            withCaptain: dto.with_captain,
            characteristics: new Characteristics(dto.might, dto.agility, dto.reason, dto.intuition, dto.presence),
            traits: dto.traits?.map(t => Trait.fromDTO(t)) ?? [],
            abilities: dto.abilities?.map(a => Feature.fromDTO(a)) ?? [],
        });
    }

    public toDTO(): Partial<StatblockDTO> {
        return StatblockDTO.partialFromModel(this);
    }
}
