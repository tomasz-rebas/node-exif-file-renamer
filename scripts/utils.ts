import { readdir } from "fs/promises";

export const countFiles = async (directory: string): Promise<number> => {
  try {
    const { length: fileCount } = await readdir(directory);

    return fileCount;
  } catch (error) {
    console.error("Error occured when trying to count files:", error);

    return 0;
  }
};
