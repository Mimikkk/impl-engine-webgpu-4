export type WGSLSource = string;

export function isToken(source: WGSLSource, start: number, pattern: string): boolean {
  for (let i = 0; i < pattern.length; ++i) {
    if (source[start + i] !== pattern[i]) {
      return false;
    }
  }

  return true;
}
export function isSomeToken(source: WGSLSource, start: number, patterns: string[]): boolean {
  for (const pattern of patterns) {
    if (isToken(source, start, pattern)) {
      return true;
    }
  }

  return false;
}

export function isProgramEnd(source: WGSLSource, index: number): boolean {
  return index >= source.length;
}

export function removeSourceFromTo(source: WGSLSource, from: number, to: number): WGSLSource {
  return source.substring(0, from) + source.substring(to);
}
