import { join } from "path";
import { createInterface } from "readline";
import { renameAllFiles } from "./scripts/renameAllFiles";
import { getFileCount } from "./scripts/getFileCount";

const testDirectoryPath = join(__dirname, "test_directory");

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

const main = async (): Promise<void> => {
  try {
    const fileCount = await getFileCount(testDirectoryPath);

    if (fileCount > 0) {
      console.log(
        `The program is going to iterate through ${fileCount} files.`
      );

      const validAnswers = ["y", "yes", "n", "no"];
      const answer = await askQuestion("Shall we? [y/n] ", validAnswers);

      if (answer === "yes" || answer === "y") {
        console.log("Scanning...");
        await renameAllFiles(testDirectoryPath);
        console.log("Scanned all the files. Exit the program.");
      }

      process.exit(0);
    }
  } catch (error) {
    console.error(
      "Error occured when running the main segment of the applcation: ",
      error
    );
  }
};

main();
