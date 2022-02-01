import { BaseAnswerData, BaseQuestionState } from "./redux";

export type NSQuestion = Array<number>;

export type NSAnswerInput = number;

export type NSAnswerData = BaseAnswerData<NSQuestion, NSAnswerInput>;

export interface NSState extends BaseQuestionState<NSQuestion, NSAnswerInput> {
  questionTime: number;
  questionMax: number;
  numberAmount: number;
}
