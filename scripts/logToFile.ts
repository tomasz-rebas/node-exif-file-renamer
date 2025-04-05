import { join } from "path";
import { appendFileSync } from "fs";
import { getChosenPath } from "./globals";

export const logToFile = (
  message: string,
  { error, logToConsole }: { error?: unknown; logToConsole?: boolean }
): void => {
  const timestamp = new Date().toISOString();
  const errorMessage =
    error && error instanceof Error ? `: ${error.message}` : "";

  const logFilePath = join(getChosenPath(), "change.log");
  appendFileSync(logFilePath, `${timestamp} - ${message}${errorMessage}\n`);

  if (logToConsole && error) {
    console.error(message, error instanceof Error ? error.message : error);

    return;
  }

  if (logToConsole) {
    console.log(message);
  }
};
