import { join, extname, basename } from "path";
import { rename } from "fs/promises";
import { getMetadata } from "./getMetadata";
import { getNewFilename } from "./getNewFilename";
import { Dirent } from "fs";

const isJpg = (fileName: string): boolean =>
  extname(fileName).toLowerCase() === ".jpg";

const isRaw = (fileName: string): boolean =>
  extname(fileName).toLowerCase() === ".nef";

const renameFile = async (oldPath: string, newPath: string): Promise<void> => {
  try {
    await rename(oldPath, newPath);
    console.log(`Renamed ${basename(oldPath)} to ${basename(newPath)}`);
  } catch (error) {
    console.error(`\nError occurred when renaming the file ${oldPath}.`, error);
  }
};

type ProcessedFile = "JPG" | "RAW" | "SKIPPED";

export const processFile = async (entry: Dirent): Promise<ProcessedFile> => {
  const { parentPath, name } = entry;
  const path = join(parentPath, name);

  const isJpgOrRaw = isJpg(name) || isRaw(name);

  if (!isJpgOrRaw) {
    return "SKIPPED";
  }

  const metadata = await getMetadata(path);

  if (metadata === undefined) {
    console.error(`Couldn't retrieve metadata for ${name}`);

    return "SKIPPED";
  }

  const newFilename = getNewFilename(metadata, extname(path));

  if (!newFilename) {
    return "SKIPPED";
  }

  if (name === newFilename) {
    return "SKIPPED";
  }

  await renameFile(path, join(parentPath, newFilename));

  if (isRaw(name)) {
    return "RAW";
  }

  return "JPG";
};
