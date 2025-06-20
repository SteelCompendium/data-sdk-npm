export function cleanOcrText(text: string): string {
    let cleanedText = text;

    // 1. Fallback for mixed-case text to remove spaces after single consonants, avoiding articles like 'a'.
    // e.g. "B lade" -> "Blade".
    cleanedText = cleanedText.replace(/\b([B-HJ-NP-Z])\s+/g, '$1');

    // 2. Remove spaces before apostrophes. e.g. "don 't" -> "don't".
    cleanedText = cleanedText.replace(/\s+(?=[’'])/g, "");

    // 3. Remove spaces after a hyphenated prefix. e.g. "self- inflicted" -> "self-inflicted".
    cleanedText = cleanedText.replace(/(-[a-zA-Z])\s+/g, '$1');

    return cleanedText;
} 