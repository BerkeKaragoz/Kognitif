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

export const registerKListener = (
  callbackList: KeyboardCallbackList,
  handler: KeyboardEventListener,
): number => {
  return callbackList.push(handler) - 1;
};

export const unregisterKListener = (
  callbackList: KeyboardCallbackList,
  callbackIndex: number,
): void => {
  callbackList.splice(callbackIndex, 1);
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
