import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { getMedian, getRandomIntExcept } from "../lib";
import { NSAnswerData, NSState } from "../lib/numberSpeed";
import { addAnswerGenerator, AnswerEntity } from "../lib/redux";
import { RootState } from "./store";

const numberSpeedAdapter = createEntityAdapter<AnswerEntity<NSAnswerData>>();

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
    isCorrectRatioIncreased: true,
    isAvgTimeDecreased: true,
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
      let min = Math.min.apply(Math, state.currentQuestion); // min changes if diff is same
      const median = getMedian(state.currentQuestion); //needless to substract min&max
      const max = Math.max.apply(Math, state.currentQuestion);

      const maxDiff = max - median;
      let minDiff = median - min;

      if (median - min === maxDiff) {
        const minIndex = state.currentQuestion.findIndex((el) => el === min);
        state.currentQuestion[minIndex] -= 1; //can be 0 (not -1), not a big problem
        min = state.currentQuestion[minIndex];
        minDiff = median - min;
      }

      if (minDiff > maxDiff) {
        state.currentAnswer = min;
      } else {
        state.currentAnswer = max;
      }
    },
    addAnswer: addAnswerGenerator(numberSpeedAdapter),
  },
});

export const numberSpeedSelectors = numberSpeedAdapter.getSelectors<RootState>(
  (state) => state.numberSpeed,
);

export const { generateQuestion, addAnswer } = numberSpeedSlice.actions;

export const numberSpeedReducer = numberSpeedSlice.reducer;

export const NUMBER_SPEED_NAME = numberSpeedSlice.name;
