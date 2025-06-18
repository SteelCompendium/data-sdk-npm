import BaseAdapter from "./BaseAdapter";
interface Statblock {
    name: string;
    level: number;
    roles: string[];
    ancestry: string[];
    ev: string;
    stamina: number;
    immunities?: string[];
    weaknesses?: string[];
    speed: string | number;
    size: string;
    stability: number;
    free_strike: number;
    with_captain?: string;
    might: number;
    agility: number;
    reason: number;
    intuition: number;
    presence: number;
    traits: Trait[];
    abilities: Ability[];
}
interface Trait {
    name: string;
    effects: (string | Effect)[];
}
interface Effect {
    name?: string;
    effect: string;
    cost?: string;
}
interface Ability {
    name: string;
    type: string;
    cost?: string;
    keywords: string[];
    distance?: string;
    target?: string;
    trigger?: string;
    effects: (string | RollEffect | Effect)[];
}
interface RollEffect {
    roll: string;
    [tier: string]: string;
}
declare class DrawSteelAdapter extends BaseAdapter {
    getName(): string;
    parse(text: string): Statblock;
    mapActionTypeToAbilityType(category: string): string;
    mapOutcomeToTierKey(symbol: string, threshold: string): string;
    format(statblock: Statblock): string;
}
export default DrawSteelAdapter;
