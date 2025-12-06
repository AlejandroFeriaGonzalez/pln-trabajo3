/**
 * Normalizes text by removing excessive whitespace and special characters.
 * This function is idempotent: normalizeText(normalizeText(x)) === normalizeText(x)
 */
export function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/ +/g, ' ')
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .trim();
}
