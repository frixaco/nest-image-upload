import * as path from 'path';

export function parseFileName(fileName: string): [string, string] {
  const file = path.parse(fileName);
  return [file.name, file.ext];
}

export const ImageSizeMapping = {
  large: 2048,
  medium: 1024,
  thumb: 300,
};
