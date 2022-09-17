import * as path from 'path';

export function parseFilename(filename: string): [string, string] {
  const file = path.parse(filename);
  return [file.name, file.ext];
}

export const imageSizeMapping = {
  large: 2048,
  medium: 1024,
  thumb: 300,
} as const;

export type ImageSize = keyof typeof imageSizeMapping;
