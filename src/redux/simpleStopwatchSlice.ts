import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { getRandomInt } from "../lib";
import { addAnswerGenerator, AnswerEntity } from "../lib/redux";
import { SSAnswerData, SSQuestion, SSState } from "../lib/simpleStopwatch";
import { RootState } from "./store";

const simpleStopwatchAdapter =
  createEntityAdapter<AnswerEntity<SSAnswerData>>();

export const simpleStopwatchSlice = createSlice({
  name: "simpleStopwatch",
  initialState: simpleStopwatchAdapter.getInitialState<SSState>({
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
    addAnswer: addAnswerGenerator(simpleStopwatchAdapter),
    generateQuestion: (state) => {
      state.currentQuestion = getRandomInt(60) as SSQuestion;
      state.currentAnswer = (state.currentQuestion + state.itemTime) % 60;
    },
  },
});

export const simpleStopwatchSelectors =
  simpleStopwatchAdapter.getSelectors<RootState>(
    (state) => state.simpleStopwatch,
  );

export const { addAnswer, generateQuestion } = simpleStopwatchSlice.actions;

export const simpleStopwatchReducer = simpleStopwatchSlice.reducer;

export const SIMPLE_STOPWATCH_NAME = simpleStopwatchSlice.name;
