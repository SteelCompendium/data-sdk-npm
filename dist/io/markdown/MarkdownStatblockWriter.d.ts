import { Statblock } from "../../model/Statblock";
import { IDataWriter } from "../IDataWriter";
export declare class MarkdownStatblockWriter implements IDataWriter<Statblock> {
    private abilityWriter;
    write(data: Statblock): string;
    /**
     *  New stat-block layout
     *
     * **NAME**
     *
     * |  Ancestry  | Movement |    Level    | With Captain |     EV     |
     * |:----------:|:--------:|:-----------:|:------------:|:----------:|
     * | **Size**<br>Size      | **Speed**<br>Speed | **Stamina**<br>Stamina | **Stability**<br>Stability | **Free Strike**<br>Free Strike |
     * | **Immunities**<br>Immunities | **Movement**<br>Movement |           | **With Captain**<br>WithCaptain | **Weaknesses**<br>Weaknesses |
     * | **Might**<br>Might | **Agility**<br>Agility | **Reason**<br>Reason | **Intuition**<br>Intuition | **Presence**<br>Presence |
     */
    private createStatblockTable;
    private formatCharacteristic;
}
