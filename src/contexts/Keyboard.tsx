import { h, createContext, FunctionalComponent } from "preact";
import { useContext, useEffect } from "preact/hooks";

type KeyboardEventListener = (e: KeyboardEvent) => void;

type KeyboardCallbackList = Array<KeyboardEventListener>;

// const keyboardLogger: KeyboardEventListener = (e) => {
//   console.log(e.key);
// };

export const KeyboardContext = createContext<KeyboardCallbackList>([
  //keyboardLogger,
]);

export type KeyboardProviderType = {
  type?: "keyup" | "keydown" | "keypress";
};

type KeyboardRegisterer = (
  callbackList: KeyboardCallbackList,
  listener: KeyboardEventListener,
) => KeyboardUnregisterer;

type KeyboardUnregisterer = () => KeyboardCallbackList;

export const registerKListener: KeyboardRegisterer = (
  callbackList,
  listener,
) => {
  callbackList.push(listener);

  return (): KeyboardCallbackList => {
    const callbackIndex = callbackList.indexOf(listener); // Have to use indexof otherwise the previous ejected functions might change the indexes
    if (callbackIndex >= 0) return callbackList.splice(callbackIndex, 1);
    return callbackList;
  };
};

export const KeyboardProvider: FunctionalComponent<KeyboardProviderType> = (
  props,
) => {
  const { children, type = "keyup" } = props;
  const callbacks = useContext(KeyboardContext);

  const keyboardHandler = (e: KeyboardEvent): void => {
    for (let i = 0; i < callbacks.length; i++) callbacks[i](e);
  };

  useEffect(() => {
    window.addEventListener(type, keyboardHandler, true);
    return (): void => {
      window.removeEventListener(type, keyboardHandler, true);
    };
  }, []);

  return (
    <KeyboardContext.Provider value={callbacks}>
      {children}
    </KeyboardContext.Provider>
  );
};

export default KeyboardContext;
