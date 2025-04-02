import { existsSync, lstatSync } from "fs";
import { renameAllFiles } from "./scripts/renameAllFiles";
import { getFileCount } from "./scripts/getFileCount";
import inquirer from "inquirer";

const chooseDirectory = async (): Promise<string> => {
  const { directory } = await inquirer.prompt([
    {
      type: "input",
      name: "directory",
      message: "Enter the directory path:",
      validate: (input) => {
        return existsSync(input) && lstatSync(input).isDirectory()
          ? true
          : "Please enter a valid directory path.";
      },
    },
  ]);

  return directory;
};

const askConfirmation = async (): Promise<string> => {
  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Shall we?",
      default: false,
    },
  ]);

  return confirm;
};

const main = async (): Promise<void> => {
  try {
    const directory = await chooseDirectory();
    const fileCount = await getFileCount(directory);

    if (fileCount > 0) {
      console.log(
        `The program is going to iterate through ${fileCount} files.`
      );

      const confirm = await askConfirmation();

      if (confirm) {
        console.log("Scanning...");

        const fileCountByType = await renameAllFiles(directory);
        const { raw, jpg, skipped } = fileCountByType;

        console.log(`Scanned ${raw + jpg + skipped} files in total.`);
        console.log("RAW files renamed: ", raw);
        console.log("JPG files renamed: ", jpg);
        console.log("Files skipped: ", skipped);
      }
    } else {
      console.log(
        "There's no files in the given directory. Exiting the program."
      );
    }

    process.exit(0);
  } catch (error) {
    console.error(
      "Error occurred when running the main segment of the application:",
      error
    );
    process.exit(1);
  }
};

main();
