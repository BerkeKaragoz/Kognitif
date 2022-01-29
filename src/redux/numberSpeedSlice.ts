import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  AnswerEntity,
  BaseQuestionState,
  getMedian,
  getRandomIntExcept,
} from "../lib";
import { NSAnswerData, NSQuestion, NSAnswerInput } from "../lib/numberSpeed";

import { RootState } from "./store";

type NSAnswerEntity = AnswerEntity<NSAnswerData>;

const numberSpeedAdapter = createEntityAdapter<NSAnswerEntity>();

interface NSState extends BaseQuestionState<NSQuestion, NSAnswerInput> {
  questionTime: number;
  questionMax: number;
  numberAmount: number;
}

export const numberSpeedSlice = createSlice({
  name: "numberSpeed",
  initialState: numberSpeedAdapter.getInitialState<NSState>({
    questionTime: 7,
    questionMax: 20,
    numberAmount: 3,
    totalCorrectAnswers: 0,
    totalWrongAnswers: 0,
    totalTime: 0,
    currentQuestion: null,
    currentAnswer: null,
  }),
  reducers: {
    generateQuestion: (state) => {
      state.currentQuestion = [];
      state.currentAnswer = 0;

      for (let i = 0; i < state.numberAmount; i++) {
        state.currentQuestion[i] = getRandomIntExcept(
          state.currentQuestion.concat([0]),
          state.questionMax,
        );
      }

      /** Can be evolved to other modes */
      const min = Math.min.apply(Math, state.currentQuestion);
      const median = getMedian(state.currentQuestion); //needless to substract min&max
      const max = Math.max.apply(Math, state.currentQuestion);

      if (Math.max(median - min, max - median) === median - min) {
        state.currentAnswer = min;
      } else {
        state.currentAnswer = max;
      }
    },
    addAnswer: (state, action: PayloadAction<NSAnswerData>) => {
      const entity: NSAnswerEntity = {
        ...action.payload,
        id: state.ids.length,
      };

      if (entity.isCorrect) state.totalCorrectAnswers++;
      else state.totalWrongAnswers++;

      state.totalTime += entity.answerTime;

      numberSpeedAdapter.addOne(state, entity);
    },
  },
});

export const { generateQuestion, addAnswer } = numberSpeedSlice.actions;

export const numberSpeedSelectors = numberSpeedAdapter.getSelectors<RootState>(
  (state) => state.numberSpeed,
);

const numberSpeedReducer = numberSpeedSlice.reducer;

export default numberSpeedReducer;
