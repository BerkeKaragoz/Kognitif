type integer = number; // to mark that its not a float

export interface BaseQuestionState<Question, AnswerInput> {
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  totalTime: number;
  currentQuestion: Question | null;
  currentAnswer: AnswerInput | null;
}

export interface BaseAnswerData<Question, AnswerInput> {
  question: Question;
  givenAnswer: AnswerInput;
  correctAnswer: AnswerInput;
  isCorrect: boolean;
  answerTime: number;
}

export type AnswerEntity<T> = T & { id: number };

export const getRandomInt = (max = 100): integer => {
  return Math.floor(Math.random() * max);
};

export const getRandomIntExcept = (
  except: integer[] = [],
  max = 100,
): integer => {
  const num = Math.floor(Math.random() * max);
  return except.includes(num) ? getRandomInt(max) : num;
};

export const getMedian = (arr: number[]) => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

export const secondsToString = (number: number): string =>
  number.toString().padStart(2, "0");

export const getPercentage = (first: number, second: number): number =>
  first + second !== 0 ? (first / (first + second)) * 100 : 0;

export type ArrowStateType = "increase" | "decrease";
