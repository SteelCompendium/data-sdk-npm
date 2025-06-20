"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanOcrText = cleanOcrText;
function cleanOcrText(text) {
    let cleanedText = text;
    // 1. Fallback for mixed-case text to remove spaces after single consonants, avoiding articles like 'a'.
    // e.g. "B lade" -> "Blade".
    cleanedText = cleanedText.replace(/(^|\s)([B-HJ-NP-Z])\s+/g, '$1$2');
    // 2. Remove spaces before apostrophes. e.g. "don 't" -> "don't".
    cleanedText = cleanedText.replace(/\s+(?=[’'])/g, "");
    // 3. Remove spaces after a hyphenated prefix. e.g. "self- inflicted" -> "self-inflicted".
    cleanedText = cleanedText.replace(/(-[a-zA-Z])\s+/g, '$1');
    return cleanedText;
}
//# sourceMappingURL=stringUtils.js.map