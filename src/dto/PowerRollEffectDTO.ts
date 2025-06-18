import { PowerRollEffect } from "../model";

export class PowerRollEffectDTO {
    roll!: string;
    [key: string]: string | number | boolean | undefined;

    public constructor(source: Partial<PowerRollEffectDTO>) {
        Object.assign(this, source);
    }

    public static fromModel(model: PowerRollEffect): PowerRollEffectDTO {
        return model.toDTO();
    }

    public toModel(): PowerRollEffect {
        return PowerRollEffect.fromDTO(this);
    }
} 