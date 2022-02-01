import {
  EntityAdapter,
  EntitySelectors,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../redux/store";

// TYPES

export interface BaseQuestionState<Question = any, AnswerInput = any> {
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  totalTime: number;
  currentQuestion: Question | null;
  currentAnswer: AnswerInput | null;
  isCorrectRatioIncreased: boolean;
  isAvgTimeDecreased: boolean;
}

export type ABaseQuestionStateName = {
  [K in keyof RootState]: RootState[K] extends BaseQuestionState ? K : never;
}[keyof RootState];

export type ABaseQuestionState = RootState[ABaseQuestionStateName];

export interface BaseAnswerData<Question = any, AnswerInput = any> {
  question: Question;
  givenAnswer: AnswerInput;
  correctAnswer: AnswerInput;
  isCorrect: boolean;
  answerTime: number;
}

export type AnswerEntity<T extends BaseAnswerData = BaseAnswerData> = T & {
  id: number;
};

export type AnswerSelectors = EntitySelectors<
  AnswerEntity<BaseAnswerData>,
  any
>;

//

export const addAnswerGenerator =
  (adapter: EntityAdapter<AnswerEntity>) =>
  (
    state: BaseQuestionState & EntityState<any>,
    action: PayloadAction<BaseAnswerData>,
  ) => {
    const entity: AnswerEntity = {
      ...action.payload,
      id: state.ids.length,
    };

    if (entity.isCorrect) state.totalCorrectAnswers++;
    else state.totalWrongAnswers++;

    state.totalTime += entity.answerTime;

    state.isAvgTimeDecreased =
      state.totalTime / (state.totalCorrectAnswers + state.totalWrongAnswers) >
      entity.answerTime;

    state.isCorrectRatioIncreased = entity.isCorrect;

    adapter.addOne(state, entity);
  };
