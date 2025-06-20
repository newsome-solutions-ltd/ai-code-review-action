const { parsePatch } = require('unidiff');

/**
 * Transforms a unified diff into a model-friendly prompt structure.
 * @param {string} rawDiff - The unified diff string from GitHub's API.
 * @returns {string} - A plain-text prompt annotated with file and line metadata.
 */
function transformDiffForModel(rawDiff) {
  const files = parsePatch(rawDiff);
  const lines = [];

  for (const file of files) {
    const filePath = file.newFileName.replace(/^b\//, '');
    for (const hunk of file.hunks) {
      let newLineNumber = hunk.newStart;
      let oldLineNumber = hunk.oldStart;
      
      for (const line of hunk.lines) {
        const content = line.slice(1); // Remove the initial symbol
        if (line.startsWith('+') && !line.startsWith('+++')) {
          lines.push(`[file:${filePath}][type:+][L:${newLineNumber}] ${content}`);
          newLineNumber++;
        }
        if (line.startsWith('-') && !line.startsWith('---')) {
          lines.push(`[file:${filePath}][type:-][L:${oldLineNumber}] ${content}`);
          oldLineNumber++;
        }
        if (!line.startsWith('-') && !line.startsWith('+') && !(line == '\\ No newline at end of file')) {
          lines.push(`[file:${filePath}][L:${oldLineNumber}] ${content}`);
          newLineNumber++;
          oldLineNumber++;
        }
      }
    }
  }

  return lines.join('\n');
}

module.exports = { transformDiffForModel };
