import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AnswerEntity, BaseQuestionState, getRandomInt } from "../lib";
import {
  generateLetter,
  LowercaseLetter,
  PSAnswerData,
  PSAnswerInput,
  PSQuestion,
} from "../lib/perceptualSpeed";
import { RootState } from "./store";

export type PSAnswerEntity = AnswerEntity<PSAnswerData>;

const perceptualSpeedAdapter = createEntityAdapter<PSAnswerEntity>();

export interface PSState extends BaseQuestionState<PSQuestion, PSAnswerInput> {
  questionTime: number;
}

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
    addAnswer: (state, action: PayloadAction<PSAnswerData>) => {
      const entity: PSAnswerEntity = {
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

      perceptualSpeedAdapter.addOne(state, entity);
    },
  },
});

// Action creators are generated for each case reducer function
export const { generateQuestion, addAnswer } = perceptualSpeedSlice.actions;

export const perceptualSpeedSelectors =
  perceptualSpeedAdapter.getSelectors<RootState>(
    (state) => state.perceptualSpeed,
  );

const perceptualSpeedReducer = perceptualSpeedSlice.reducer;

export const PERCEPTUAL_SPEED_NAME = perceptualSpeedSlice.name;

export default perceptualSpeedReducer;
