import { existsSync, lstatSync } from "fs";
import { join } from "path";
import { createInterface } from "readline";
import { renameAllFiles } from "./scripts/renameAllFiles";
import { getFileCount } from "./scripts/getFileCount";
import inquirer from "inquirer";

const askQuestion = (question: string, validAnswers: string[]) => {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      const normalizedAnswer = answer.trim().toLowerCase();

      if (validAnswers.includes(normalizedAnswer)) {
        rl.close();
        resolve(normalizedAnswer);
      } else {
        rl.close();
        resolve(askQuestion(question, validAnswers));
      }
    });
  });
};

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

const main = async (): Promise<void> => {
  try {
    const directory = await chooseDirectory();
    const fileCount = await getFileCount(directory);

    if (fileCount > 0) {
      console.log(
        `The program is going to iterate through ${fileCount} files.`
      );

      const validAnswers = ["y", "yes", "n", "no"];
      const answer = await askQuestion("Shall we? [y/n] ", validAnswers);

      if (answer === "yes" || answer === "y") {
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
      "Error occured when running the main segment of the application: ",
      error
    );
  }
};

main();
