import { join } from "path";
import readline from "readline";
import { getMetadata } from "./scripts/exifReader";
import { getFileCount, renameFiles } from "./scripts/utils";

const testFilePath = join(__dirname, "test_images", "1.nef");
const testDirectoryPath = join(__dirname, "test_directory");

const promptToStartRenaming = (): void => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`Shall we? [y/n] `, (answer) => {
    if (answer === "yes" || answer === "y") {
      console.log("Scanning...");
      renameFiles(testDirectoryPath);
      rl.close();

      return;
    }

    rl.close();
    promptToStartRenaming();
  });
};

const main = async (): Promise<void> => {
  try {
    const metadata = await getMetadata(testFilePath);
    console.log("selectedMetadata", metadata);

    const fileCount = await getFileCount(testDirectoryPath);

    if (fileCount > 0) {
      console.log(
        `The program is going to iterate through ${fileCount} files.`
      );

      promptToStartRenaming();
    }
  } catch (error) {
    console.error(
      "Error occured when running the main segment of the applcation: ",
      error
    );
  }
};

main();
