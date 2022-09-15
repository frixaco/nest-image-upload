import * as path from 'path';

export function parseFileName(fileName: string): [string, string] {
  const file = path.parse(fileName);
  return [file.name, file.ext];
}

export const imageSizeMapping = {
  large: 2048,
  medium: 1024,
  thumb: 300,
};
