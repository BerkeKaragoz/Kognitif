import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { getRandomInt } from "../lib";
import {
  generateLetter,
  LowercaseLetter,
  PSAnswerData,
  PSState,
} from "../lib/perceptualSpeed";
import { addAnswerGenerator, AnswerEntity } from "../lib/redux";
import { RootState } from "./store";

const perceptualSpeedAdapter =
  createEntityAdapter<AnswerEntity<PSAnswerData>>();

export const perceptualSpeedSlice = createSlice({
  name: "perceptualSpeed",
  initialState: perceptualSpeedAdapter.getInitialState<PSState>({
    questionTime: 6,
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
      state.currentQuestion = {};
      state.currentAnswer = 0;

      const len = 4;
      let pastChars = "";

      for (let i = 0; i < len; i++) {
        const upperLetter = generateLetter(pastChars);
        let lowerLetter;

        if (getRandomInt(2)) {
          //if correct pair will be generated
          lowerLetter = upperLetter.toLowerCase() as LowercaseLetter;
          state.currentAnswer++;
        } else {
          //if incorrect pair, generate other than current and past
          lowerLetter = generateLetter(
            upperLetter,
          ).toLowerCase() as LowercaseLetter;
        }

        pastChars += upperLetter;

        state.currentQuestion[upperLetter] = lowerLetter;
      }
    },
    addAnswer: addAnswerGenerator(perceptualSpeedAdapter),
  },
});

export const perceptualSpeedSelectors =
  perceptualSpeedAdapter.getSelectors<RootState>(
    (state) => state.perceptualSpeed,
  );

export const { generateQuestion, addAnswer } = perceptualSpeedSlice.actions;

export const perceptualSpeedReducer = perceptualSpeedSlice.reducer;

export const PERCEPTUAL_SPEED_NAME = perceptualSpeedSlice.name;
