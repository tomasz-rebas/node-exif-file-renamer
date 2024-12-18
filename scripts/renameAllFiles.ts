import { join, extname, basename } from "path";
import { readdir, rename } from "fs/promises";
import { getMetadata } from "./getMetadata";
import { getNewFilename } from "./getNewFilename";
import { Dirent } from "fs";

const isJpgOrNef = (fileName: string): boolean =>
  [".nef", ".jpg"].includes(extname(fileName).toLowerCase());

const renameFile = async (oldPath: string, newPath: string): Promise<void> => {
  try {
    await rename(oldPath, newPath);
    console.log(`Renamed ${basename(oldPath)} to ${basename(newPath)}`);
  } catch (error) {
    console.error(`Error occurred when renaming the file ${oldPath}:`, error);
  }
};

const processFile = async (entry: Dirent) => {
  const { parentPath, name } = entry;
  const path = join(parentPath, name);

  if (!isJpgOrNef(name)) {
    return;
  }

  const metadata = await getMetadata(path);

  if (metadata === undefined) {
    console.error(`Couldn't retrieve metadata for ${name}`);

    return;
  }

  const newFilename = getNewFilename(metadata, extname(path));

  console.log("-----------------------------------");
  console.log("current name\n", name);
  console.log("new name\n", newFilename);

  if (name !== newFilename) {
    await renameFile(path, join(parentPath, newFilename));
  } else {
    console.log("These files have the same name. Skipping.");
  }
};

export const renameAllFiles = async (directory: string) => {
  const entries = await readdir(directory, { withFileTypes: true });

  /**
   * TODO: Track renaming progress
   */

  for (const entry of entries) {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      await renameAllFiles(entryPath);
      continue;
    }

    if (entry.isFile()) {
      await processFile(entry);
    }
  }
};
