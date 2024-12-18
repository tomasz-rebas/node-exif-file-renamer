import { join, extname, basename } from "path";
import { readdir, rename } from "fs/promises";
import { getMetadata } from "./getMetadata";
import { getNewFilename } from "./getNewFilename";

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

    if (entry.isFile() && isJpgOrNef(entry.name)) {
      const metadata = await getMetadata(entryPath);

      if (metadata === undefined) {
        console.error(`Couldn't retrieve metadata for ${entry.name}`);

        continue;
      }

      const newFilename = getNewFilename(metadata, extname(entryPath));

      console.log("-----------------------------------");
      console.log("current name\n", entry.name);
      console.log("new name\n", newFilename);

      if (entry.name !== newFilename) {
        await renameFile(
          join(directory, entry.name),
          join(directory, newFilename)
        );
      } else {
        console.log("These files have the same name. Skipping.");
      }
    }
  }
};
