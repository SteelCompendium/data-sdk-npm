import { SteelCompendiumPseudoModel } from '.';
import { StatblockDTO } from '../dto';
export declare class Characteristics implements SteelCompendiumPseudoModel {
    might: number;
    agility: number;
    reason: number;
    intuition: number;
    presence: number;
    constructor(might: number, agility: number, reason: number, intuition: number, presence: number);
    static fromStatblockDTO(dto: StatblockDTO): Characteristics;
}
