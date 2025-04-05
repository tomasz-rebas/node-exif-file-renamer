import { existsSync, lstatSync } from "fs";
import { renameAllFiles } from "./scripts/renameAllFiles";
import { getFileCount } from "./scripts/getFileCount";
import { input, confirm } from "@inquirer/prompts";
import { logToFile, setChosenPath } from "./scripts/logToFile";

const chooseDirectory = async (): Promise<string> =>
  await input({
    message: "Enter the directory path:",
    validate: (input) => {
      return existsSync(input) && lstatSync(input).isDirectory()
        ? true
        : "Please enter a valid directory path.";
    },
  });

const askConfirmation = async (): Promise<boolean> =>
  await confirm({ message: "Shall we?" });

const main = async (): Promise<void> => {
  try {
    const directory = await chooseDirectory();
    setChosenPath(directory);

    const fileCount = await getFileCount(directory);

    if (fileCount > 0) {
      console.log(
        `The program is going to iterate through ${fileCount} files.`
      );

      const confirm = await askConfirmation();

      if (confirm) {
        logToFile(
          `Renaming all the JPG and Nikon RAW files in ${directory}`,
          {}
        );
        logToFile("Scanning...", { logToConsole: true });

        const fileCountByType = await renameAllFiles(directory, fileCount);
        const { raw, jpg, skipped } = fileCountByType;

        logToFile(`Scanned ${raw + jpg + skipped} files in total.`, {
          logToConsole: true,
        });
        logToFile(`RAW files renamed: ${raw}`, { logToConsole: true });
        logToFile(`JPG files renamed: ${jpg}`, { logToConsole: true });
        logToFile(`Files skipped: ${skipped}`, { logToConsole: true });
      }
    } else {
      logToFile(
        "There are no files in the given directory. Exiting the program.",
        { logToConsole: true }
      );
    }

    process.exit(0);
  } catch (error) {
    logToFile(
      "Error occurred when running the main segment of the application:",
      { error, logToConsole: true }
    );
    process.exit(1);
  }
};

main();
