import { MundaneEffectDTO } from "./MundaneEffectDTO";
import { PowerRollEffectDTO } from './PowerRollEffectDTO';

export type EffectDTO =
    | PowerRollEffectDTO
    | MundaneEffectDTO
    | string;