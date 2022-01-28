import { useInterval } from "@chakra-ui/react";
import { FunctionalComponent, h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

//let ind = 0; //for debugging

type TimerHook = {
  Timer: FunctionalComponent;
  resetTimer: (pause?: boolean) => number;
  setTimerIsActive: (state: boolean) => void;
  getElapsedTime: () => number;
};

const useTimer = (interval = 32): TimerHook => {
  const [isActive, setIsActive] = useState<boolean>(true);

  const timerRef = useRef<HTMLSpanElement>(null);
  const startTimeRef = useRef<Date>(new Date()); // Better to start timer on useEffect for the user
  const currentTimeRef = useRef<Date>(new Date()); // Better to start timer on useEffect for the user

  const setTimerIsActive = (
    active: boolean | ((prevState: boolean) => boolean),
  ): void => {
    setIsActive(active);
  };

  // For display purposes
  const getTimeDiff = (): number => {
    return currentTimeRef.current.getTime() - startTimeRef.current.getTime();
  };

  // For the hook, accurate value
  const getElapsedTime = (): number => {
    currentTimeRef.current = new Date();
    return getTimeDiff();
  };

  const resetTimer = (pause = false): number => {
    const elapsedTime = getElapsedTime();
    if (pause) setTimerIsActive(false);
    startTimeRef.current = new Date();
    return elapsedTime;
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
    return () => {
      setIsActive(false);
    };
  }, [isActive]);

  useInterval(
    () => {
      currentTimeRef.current = new Date();
      if (!timerRef.current) return;
      timerRef.current.innerHTML = getTimeDiff().toString();
    },
    isActive ? interval : null,
  );

  // console.info(
  //   `Timer Start Time: ${startTimeRef.current.toISOString()} | Render Count: ${ind++}`,
  // );

  const Timer: FunctionalComponent = () => (
    <span ref={timerRef}>{getTimeDiff().toString()}</span>
  );

  return { Timer, resetTimer, setTimerIsActive, getElapsedTime };
};

export default useTimer;
