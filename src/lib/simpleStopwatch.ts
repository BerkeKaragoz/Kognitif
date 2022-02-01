import { BaseAnswerData, BaseQuestionState } from "./redux";

export type SSQuestion = number;

export type SSAnswerInput = number;

export type SSAnswerData = BaseAnswerData<SSQuestion, SSAnswerInput>;

export interface SSState extends BaseQuestionState<SSQuestion, SSAnswerInput> {
  itemTime: number;
}
