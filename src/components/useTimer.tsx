import { useInterval } from "@chakra-ui/react";
import { FunctionalComponent, h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

const secondsToString = (number: number): string =>
  number.toString().padStart(2, "0");

let ind = 0;

type TimerHook = {
  Timer: FunctionalComponent;
  resetTimer: (pause: boolean) => void;
  setTimerState: (state: boolean) => void;
};

const useTimer = (): TimerHook => {
  const [isActive, setIsActive] = useState<boolean>(true);

  const timerRef = useRef<HTMLSpanElement>(null);
  const startTimeRef = useRef<Date>(new Date()); // Better to start timer on useEffect for the user
  const currentTimeRef = useRef<Date>(new Date()); // Better to start timer on useEffect for the user

  const setTimerState = (
    active: boolean | ((prevState: boolean) => boolean),
  ): void => {
    setIsActive(active);
  };

  const resetTimer = (pause = false): void => {
    if (pause) setTimerState(false);
    startTimeRef.current = new Date();
  };

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = new Date(
        new Date().getTime() -
          currentTimeRef.current.getTime() +
          startTimeRef.current.getTime(),
      );
    } else {
      currentTimeRef.current = new Date();
    }
  }, [isActive]);

  useInterval(
    () => {
      currentTimeRef.current = new Date();
      if (timerRef.current) {
        timerRef.current.innerHTML = (
          currentTimeRef.current.getTime() - startTimeRef.current.getTime()
        ).toString();
      }
    },
    isActive ? 32 : null,
  );

  console.log(
    `Timer Start Time: ${startTimeRef.current.toISOString()} | Render Count: ${ind++}`,
  );

  const Timer: FunctionalComponent = () => (
    <span ref={timerRef}>
      {(
        currentTimeRef.current.getTime() - startTimeRef.current.getTime()
      ).toString()}
    </span>
  );

  return { Timer, resetTimer, setTimerState };
};

export default useTimer;
