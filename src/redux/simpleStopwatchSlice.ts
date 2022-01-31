import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AnswerEntity, BaseQuestionState, getRandomInt } from "../lib";
import {
  SSAnswerData,
  SSAnswerInput,
  SSQuestion,
} from "../lib/simpleStopwatch";
import { RootState } from "./store";

export type SSAnswerEntity = AnswerEntity<SSAnswerData>;
export interface SSState extends BaseQuestionState<SSQuestion, SSAnswerInput> {
  itemTime: number;
}

const simpleStopwatchAnswersAdapter = createEntityAdapter<SSAnswerEntity>();

export const simpleStopwatchSlice = createSlice({
  name: "simpleStopwatch",
  initialState: simpleStopwatchAnswersAdapter.getInitialState<SSState>({
    itemTime: 30,
    totalCorrectAnswers: 0,
    totalWrongAnswers: 0,
    totalTime: 0,
    currentQuestion: null,
    currentAnswer: null,
    isCorrectRatioIncreased: true,
    isAvgTimeDecreased: true,
  }),
  reducers: {
    addAnswer: (state, action: PayloadAction<SSAnswerData>) => {
      const entity: SSAnswerEntity = {
        ...action.payload,
        id: state.ids.length,
      };

      if (entity.isCorrect) state.totalCorrectAnswers++;
      else state.totalWrongAnswers++;

      state.totalTime += entity.answerTime;

      state.isAvgTimeDecreased =
        state.totalTime /
          (state.totalCorrectAnswers + state.totalWrongAnswers) >
        entity.answerTime;

      state.isCorrectRatioIncreased = entity.isCorrect;

      simpleStopwatchAnswersAdapter.addOne(state, entity);
    },
    generateQuestion: (state) => {
      state.currentQuestion = getRandomInt(60) as SSQuestion;
      state.currentAnswer = (state.currentQuestion + state.itemTime) % 60;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addAnswer, generateQuestion } = simpleStopwatchSlice.actions;

export const simpleStopwatchAnswersSelectors =
  simpleStopwatchAnswersAdapter.getSelectors<RootState>(
    (state) => state.simpleStopwatch,
  );

const simpleStopwatchReducer = simpleStopwatchSlice.reducer;

export const SIMPLE_STOPWATCH_NAME = simpleStopwatchSlice.name;

export default simpleStopwatchReducer;
