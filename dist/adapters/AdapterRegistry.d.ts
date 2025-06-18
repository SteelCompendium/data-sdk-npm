import BaseAdapter from "./BaseAdapter";
declare class AdapterRegistry {
    private adapters;
    constructor();
    registerDefaultAdapters(): void;
    registerAdapter(adapter: BaseAdapter): void;
    getAdapter(name: string): BaseAdapter;
    getAvailableFormats(isOutput?: boolean): string[];
    convert(text: string, sourceFormat: string, targetFormat: string): Promise<string>;
    /**
     * Helper method to detect if a string is JSON format
     * @param {string} text - The text to check
     * @returns {boolean} - True if the text appears to be JSON
     */
    isJSONFormat(text: string): boolean;
}
declare const registry: AdapterRegistry;
export default registry;
