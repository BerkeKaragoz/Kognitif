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
  UppercaseLetter,
} from "../lib/perceptualSpeed";
import { RootState } from "./store";

type PSAnswerEntity = AnswerEntity<PSAnswerData>;

const perceptualSpeedAdapter = createEntityAdapter<PSAnswerEntity>();

interface PSState extends BaseQuestionState<PSQuestion, PSAnswerInput> {
  value: number; //delete
  questionTime: number;
}

export const perceptualSpeedSlice = createSlice({
  name: "perceptualSpeed",
  initialState: perceptualSpeedAdapter.getInitialState<PSState>({
    value: 0,
    questionTime: 7,
    totalCorrectAnswers: 0,
    totalWrongAnswers: 0,
    totalTime: 0,
    currentQuestion: null,
    currentAnswer: null,
  }),
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
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

      perceptualSpeedAdapter.addOne(state, entity);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  increment,
  decrement,
  incrementByAmount,
  generateQuestion,
  addAnswer,
} = perceptualSpeedSlice.actions;

export const perceptualSpeedSelectors =
  perceptualSpeedAdapter.getSelectors<RootState>(
    (state) => state.perceptualSpeed,
  );

const perceptualSpeedReducer = perceptualSpeedSlice.reducer;

export default perceptualSpeedReducer;
