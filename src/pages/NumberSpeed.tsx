import {
  Button,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Td,
  Text,
  Th,
  useInterval,
} from "@chakra-ui/react";
import { FunctionalComponent, h } from "preact";
import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import InfoSection from "../components/smart/InfoSection";
import SessionStatistics from "../components/smart/SessionStatistics";
import KeyboardContext, { registerKListener } from "../contexts/Keyboard";
import useTimer from "../hooks/useTimer";
import { secondsToString } from "../lib";
import { NSAnswerData, NSAnswerInput } from "../lib/numberSpeed";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addAnswer,
  generateQuestion,
  numberSpeedSelectors,
  NUMBER_SPEED_NAME,
} from "../redux/numberSpeedSlice";

const NumberSpeed: FunctionalComponent<{}> = () => {
  const { currentQuestion, currentAnswer, questionTime } = useAppSelector(
    (state) => state.numberSpeed,
  );
  const keyboardCallbacks = useContext(KeyboardContext);
  const dispatch = useAppDispatch();
  const { Timer, resetTimer, getElapsedTime } = useTimer();
  const [elapsedTime, setElapsedTime] = useState(0);

  useInterval(() => {
    setElapsedTime(getElapsedTime);
  }, 1000);

  const answerHandler = (answer: NSAnswerInput) => {
    const data: NSAnswerData = {
      question: currentQuestion!,
      givenAnswer: answer,
      correctAnswer: currentAnswer!,
      isCorrect: currentAnswer === answer,
      answerTime: resetTimer(),
    };

    dispatch(addAnswer(data));
    dispatch(generateQuestion());
  };

  const keyboardHandler = useCallback(
    (e: KeyboardEvent) => {
      if (!currentQuestion) return;
      if (["1", "2", "3"].includes(e.key)) {
        //TODO Temp, do as to comply diff lenghts
        if (currentAnswer) answerHandler(currentQuestion[parseInt(e.key) - 1]);
      }
    },
    [answerHandler, currentAnswer],
  );

  useEffect(() => {
    dispatch(generateQuestion());
  }, []);

  useEffect(() => {
    const unregisterHandler = registerKListener(
      keyboardCallbacks,
      keyboardHandler,
    );

    return () => {
      unregisterHandler();
    };
  }, [currentAnswer]);

  return (
    <div>
      <Center mt={6} mb={8}>
        <CircularProgress
          max={questionTime * 1000}
          thickness={8}
          value={elapsedTime}
          size={172}
          color="purple.500"
          trackColor="gray.700"
        >
          <CircularProgressLabel>
            <Heading size="4xl">
              :
              <span id="question">
                {secondsToString(
                  Math.max(0, Math.round(questionTime - elapsedTime / 1000)),
                )}
              </span>
            </Heading>
            <Text fontSize="sm" style={{ opacity: 0.8 }}>
              <span id="item-time">Target: {questionTime}s</span>
            </Text>
          </CircularProgressLabel>
        </CircularProgress>
      </Center>
      <Container mt={6} mb={8}>
        <SimpleGrid columns={3} spacing={5} minH="168px">
          {currentQuestion !== null &&
            currentQuestion.map((option) => (
              <Button
                key={`answerButton-${option}`}
                id={`answer-button-${option}`}
                colorScheme="purple"
                height="100%"
                width="100%"
                onClick={() => answerHandler(option)}
              >
                <Flex align="baseline">
                  <Text fontSize="2xl">{option}</Text>
                </Flex>
              </Button>
            ))}
        </SimpleGrid>
      </Container>
      <InfoSection stateName={NUMBER_SPEED_NAME} Timer={Timer}>
        Find the furthest from the median
      </InfoSection>
      <SessionStatistics
        selectors={numberSpeedSelectors}
        AdditionalTh={<Th isNumeric>Q</Th>}
        AdditionalTd={(answer) => (
          <Td isNumeric>
            <b>{JSON.stringify(answer.question)}</b>
          </Td>
        )}
      />
    </div>
  );
};

export default NumberSpeed;
