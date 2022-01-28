import { BaseAnswerData } from ".";

export type PSQuestion = {
  [key in UppercaseLetter]?: LowercaseLetter;
};

export type PSAnswerInput = number;

export type PSAnswerData = BaseAnswerData<PSQuestion, PSAnswerInput>;

export type LowercaseLetter =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";

export type UppercaseLetter = Uppercase<LowercaseLetter>;

export type Letter = UppercaseLetter | LowercaseLetter;

const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const generateLetter = (except = "") => {
  const regex = new RegExp(`[${except}]`, "g");

  const charSet = uppercaseLetters.replace(regex, "");

  const charSetLength = charSet.length;

  const letter = charSet.charAt(Math.floor(Math.random() * charSetLength));

  return letter as UppercaseLetter;
};
