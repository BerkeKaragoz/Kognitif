type integer = number; // to mark that its not a float

export const getRandomInt = (max = 100): integer => {
  return Math.floor(Math.random() * max);
};

export const secondsToString = (number: number): string =>
  number.toString().padStart(2, "0");

export const getPercentage = (first: number, second: number): number =>
  first + second !== 0 ? (first / (first + second)) * 100 : 0;
