import {Feature} from "./Feature";
import {Characteristics} from "./Characteristics";
import {StatblockDTO} from "../dto";
import {ModelDTOAdapter, SteelCompendiumModel} from "./SteelCompendiumModel";

export class Statblock extends SteelCompendiumModel<StatblockDTO> {
    public static STATBLOCK_TYPE = "static";

    type = Statblock.STATBLOCK_TYPE;
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
    features!: Feature[];

    public constructor(source: Partial<Statblock>) {
        super(Statblock.STATBLOCK_TYPE);
        Object.assign(this, source);
        this.characteristics = source.characteristics ?? new Characteristics(0, 0, 0, 0, 0);
        this.features = source.features ?? [];
    }

    public static modelDTOAdapter: ModelDTOAdapter<Statblock, StatblockDTO> = (source: Partial<StatblockDTO>) => new StatblockDTO(source).toModel();

    public static fromDTO(dto: StatblockDTO): Statblock {
        return new Statblock({
            ...dto,
            freeStrike: dto.free_strike,
            withCaptain: dto.with_captain,
            characteristics: new Characteristics(dto.might, dto.agility, dto.reason, dto.intuition, dto.presence),
            features: dto.features?.map(a => Feature.fromDTO(a)) ?? [],
        });
    }

    public toDTO(): Partial<StatblockDTO> {
        return StatblockDTO.partialFromModel(this);
    }
}
