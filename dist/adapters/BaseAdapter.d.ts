export interface IStatblock {
    [key: string]: any;
}
/**
 * Base class for all statblock adapters
 */
declare abstract class BaseAdapter {
    /**
     * Parse the input text into a standardized format
     * @param {string} text - The input statblock text
     * @returns {IStatblock} - The parsed statblock in a standardized format
     */
    abstract parse(text: string): IStatblock;
    /**
     * Format the standardized statblock into the target format
     * @param {IStatblock} statblock - The standardized statblock object
     * @returns {string} - The formatted statblock text
     */
    abstract format(statblock: IStatblock): string;
    /**
     * Get the name of this adapter
     * @returns {string} - The adapter name
     */
    abstract getName(): string;
}
export default BaseAdapter;
