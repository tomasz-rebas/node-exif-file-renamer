import { join } from "path";
import { getMetadata } from "./scripts/exifReader";
import { countFiles } from "./scripts/utils";

const testFilePath = join(__dirname, "test_images", "1.nef");
const testDirectoryPath = join(__dirname, "test_directory");

const main = async () => {
  try {
    const metadata = await getMetadata(testFilePath);
    console.log("selectedMetadata", metadata);

    const fileCount = await countFiles(testDirectoryPath);
    console.log(`There is ${fileCount} files in the given directory.`);

    if (fileCount > 0) {
      console.log(
        `The program is going to iterate through ${fileCount} files.`
      );
      console.log("Shall we? [y/n]");
    }
  } catch (error) {
    console.error(
      "Error occured when running the main segment of the applcation: ",
      error
    );
  }
};

main();
