import { join } from "path";
import { appendFileSync } from "fs";
import { getChosenPath } from "./globals";

const getLogFilename = (): string => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");

  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;
  const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(
    now.getSeconds()
  )}`;

  return `renamer_${date}_${time}.log`;
};

const LOG_FILENAME = getLogFilename();

export const logToFile = (
  message: string,
  { error, logToConsole }: { error?: unknown; logToConsole?: boolean }
): void => {
  const timestamp = new Date().toISOString();
  const errorMessage =
    error && error instanceof Error ? `: ${error.message}` : "";

  const logFilePath = join(getChosenPath(), LOG_FILENAME);
  appendFileSync(logFilePath, `${timestamp} - ${message}${errorMessage}\n`);

  if (logToConsole && error) {
    console.error(message, error instanceof Error ? error.message : error);

    return;
  }

  if (logToConsole) {
    console.log(message);
  }
};
