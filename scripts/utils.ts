const fs = require("fs/promises");

const countFiles = async (directory: string): Promise<number> => {
  try {
    const { length: fileCount } = await fs.readdir(directory);

    return fileCount;
  } catch (error) {
    console.error("Error occured when trying to count files:", error);

    return 0;
  }
};

module.exports = { countFiles };
