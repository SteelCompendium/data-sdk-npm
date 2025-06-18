import { MundaneEffect } from "../model";

export class MundaneEffectDTO {
    effect!: string;
    name?: string;
    cost?: string;

    public constructor(source: Partial<MundaneEffectDTO>) {
        Object.assign(this, source);
    }

    public static fromModel(model: MundaneEffect): MundaneEffectDTO {
        return model.toDTO();
    }

    public toModel(): MundaneEffect {
        return MundaneEffect.fromDTO(this);
    }
} 