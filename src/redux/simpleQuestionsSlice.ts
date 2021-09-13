import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getRandomInt } from "../utils";

type Question = number;

type SimpleQuestionAnswer = {
  question: Question;
  givenAnswer: number;
  isCorrect: boolean;
  answerTime: number;
};

interface SimpleQuestionsState {
  value: number;
  currentQuestion: Question;
  answers: Array<SimpleQuestionAnswer>;
}

const initialState: SimpleQuestionsState = {
  value: 0,
  currentQuestion: 0,
  answers: [],
};

export const simpleQuestionsSlice = createSlice({
  name: "simpleQuestions",
  initialState,
  reducers: {
    generateQuestion: (state) => {
      state.currentQuestion = getRandomInt(60) as Question;
    },
  },
});

// Action creators are generated for each case reducer function
export const { generateQuestion } = simpleQuestionsSlice.actions;

const simpleQuestionsReducer = simpleQuestionsSlice.reducer;

export default simpleQuestionsReducer;
