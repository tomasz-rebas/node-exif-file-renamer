let CHOSEN_PATH: string = process.cwd();

export const getChosenPath = () => CHOSEN_PATH;

export const setChosenPath = (newPath: string) => {
  CHOSEN_PATH = newPath;
};
