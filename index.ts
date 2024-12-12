const path = require("path");
const exifReader = require("./scripts/exifReader");
const utils = require("./scripts/utils");

const testFilePath = path.join(__dirname, "test_images", "1.nef");
const testDirectoryPath = path.join(__dirname, "test_directory");

const main = async () => {
  const metadata = await exifReader.getMetadata(testFilePath);
  console.log("selectedMetadata", metadata);

  const fileCount = await utils.countFiles(testDirectoryPath);
  console.log(`There is ${fileCount} files in the given directory.`);
};

main();
