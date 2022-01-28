import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { getRandomInt } from "../lib";
import { RootState } from "./store";

type Question = number;

export type SimpleAnswer = {
  question: Question;
  givenAnswer: number;
  isCorrect: boolean;
  answerTime: number;
};

interface SimpleAnswerEntity extends SimpleAnswer {
  id: number;
}

interface SimpleModeStateExtensions {
  itemTime: number;
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  totalTime: number;
  currentQuestion: number | null;
  currentAnswer: number | null;
}

const simpleAnswersAdapter = createEntityAdapter<SimpleAnswerEntity>();

export const simpleModeSlice = createSlice({
  name: "simpleMode",
  initialState: simpleAnswersAdapter.getInitialState<SimpleModeStateExtensions>(
    {
      itemTime: 30,
      totalCorrectAnswers: 0,
      totalWrongAnswers: 0,
      totalTime: 0,
      currentQuestion: null,
      currentAnswer: null,
    },
  ),
  reducers: {
    addAnswer: (state, action: PayloadAction<SimpleAnswer>) => {
      const entity: SimpleAnswerEntity = {
        ...action.payload,
        id: state.ids.length,
      };

      if (entity.isCorrect) state.totalCorrectAnswers++;
      else state.totalWrongAnswers++;

      state.totalTime += entity.answerTime;

      simpleAnswersAdapter.addOne(state, entity);
    },
    generateQuestion: (state) => {
      state.currentQuestion = getRandomInt(60) as Question;
      state.currentAnswer = (state.currentQuestion + state.itemTime) % 60;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addAnswer, generateQuestion } = simpleModeSlice.actions;

export const simpleAnswersSelectors =
  simpleAnswersAdapter.getSelectors<RootState>((state) => state.simpleMode);

const simpleModeReducer = simpleModeSlice.reducer;

export default simpleModeReducer;
