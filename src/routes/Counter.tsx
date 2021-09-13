import { FunctionalComponent, h } from "preact";
import { decrement, increment } from "../redux/questionsSlice";

import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { Button, Text } from "@chakra-ui/react";

const Counter: FunctionalComponent<{}> = () => {
  const count = useAppSelector((state) => state.questions.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        <Button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </Button>
        <Text fontSize="xl">{count}</Text>
        <Button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </Button>
      </div>
    </div>
  );
};

export default Counter;
