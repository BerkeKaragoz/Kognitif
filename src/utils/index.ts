type integer = number;

export const getRandomInt = (max = 100): integer => {
  return Math.floor(Math.random() * max);
};
