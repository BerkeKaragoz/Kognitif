import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import counterReducer from "./counterSlice";
import simpleModeReducer from "./simpleModeSlice";

const logger = createLogger({
  collapsed: true,
});

export const store = configureStore({
  reducer: {
    simpleMode: simpleModeReducer,
    counter: counterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(logger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;

/*
Logger Options: https://github.com/LogRocket/redux-logger
{
  predicate, // if specified this function will be called before each action is processed with this middleware.
  collapsed, // takes a Boolean or optionally a Function that receives `getState` function for accessing current store state and `action` object as parameters. Returns `true` if the log group should be collapsed, `false` otherwise.
  duration = false: Boolean, // print the duration of each action?
  timestamp = true: Boolean, // print the timestamp with each action?
  level = 'log': 'log' | 'console' | 'warn' | 'error' | 'info', // console's level
  colors: ColorsObject, // colors for title, prev state, action and next state: https://github.com/LogRocket/redux-logger/blob/master/src/defaults.js#L12-L18
  titleFormatter, // Format the title used when logging actions.
  stateTransformer, // Transform state before print. Eg. convert Immutable object to plain JSON.
  actionTransformer, // Transform action before print. Eg. convert Immutable object to plain JSON.
  errorTransformer, // Transform error before print. Eg. convert Immutable object to plain JSON.
  logger = console: LoggerObject, // implementation of the `console` API.
  logErrors = true: Boolean, // should the logger catch, log, and re-throw errors?
  diff = false: Boolean, // (alpha) show diff between states?
  diffPredicate // (alpha) filter function for showing states diff, similar to `predicate`
}
*/
