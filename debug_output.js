const fs = require('fs');
const path = require('path');

// Import the compiled modules
const { MarkdownStatblockWriter } = require('./dist/io/markdown/MarkdownStatblockWriter');
const { Statblock } = require('./dist/model');

// Read the JSON file
const inputPath = path.join(__dirname, 'src/__tests__/data/statblock/dto-json/dame_cornelia.json');
const inputText = fs.readFileSync(inputPath, 'utf-8');

// Create statblock and writer
const statblock = Statblock.fromDTO(JSON.parse(inputText));
const writer = new MarkdownStatblockWriter();

// Get the output
const result = writer.write(statblock);

// Write to a temporary file
const outputPath = path.join(__dirname, 'debug_output.md');
fs.writeFileSync(outputPath, result);

console.log('Output written to debug_output.md');
console.log('Length:', result.length);
console.log('First 200 chars:', result.substring(0, 200)); 