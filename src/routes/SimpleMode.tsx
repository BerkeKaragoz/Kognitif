import { FunctionalComponent, h } from "preact";
import {
  Button,
  Heading,
  Center,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Text,
  Flex,
  Container,
  CircularProgress,
  CircularProgressLabel,
  Spinner,
} from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { useEffect, useState } from "preact/hooks";
import useTimer from "../hooks/useTimer";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addAnswer,
  generateQuestion,
  //simpleAnswersSelectors,
  SimpleAnswer,
} from "../redux/simpleModeSlice";

let renderCount = 0;

const secondsToString = (number: number): string =>
  number.toString().padStart(2, "0");

const generateOption = (correctAnswer: number, seed: number): number =>
  (correctAnswer % 10) + seed * 10;

const getPercentage = (first: number, second: number): number =>
  first + second !== 0 ? (first / (first + second)) * 100 : 0;

type OptionButtonProps = {
  option: number;
  handler: (answer: number) => MouseEventHandler<HTMLButtonElement> | undefined;
};

type ArrowStateType = "increase" | "decrease";

const OptionButton: FunctionalComponent<OptionButtonProps> = (props) => {
  const { option, handler } = props;

  return (
    <Button
      colorScheme="purple"
      onClick={handler(option)}
      height="100%"
      width="100%"
    >
      <Flex align="baseline">
        <Text fontSize="2xl" opacity={0.4}>
          :
        </Text>
        <Text fontSize="2xl">{secondsToString(option)[0]}</Text>
        <Text fontSize="2xl" opacity={0.4}>
          {secondsToString(option)[1]}
        </Text>
      </Flex>
    </Button>
  );
};

const SimpleMode: FunctionalComponent = () => {
  const dispatch = useAppDispatch();
  const {
    currentQuestion,
    currentAnswer,
    totalCorrectAnswers,
    totalWrongAnswers,
    totalTime,
  } = useAppSelector((state) => state.simpleMode);
  //const answerList = useAppSelector(simpleAnswersSelectors.selectAll);

  const { Timer, resetTimer } = useTimer();
  const [correctAnswerArrow, setCorrectAnswerArrow] =
    useState<ArrowStateType>("increase");
  const [averageTimeArrow, setAverageTimeArrow] =
    useState<ArrowStateType>("increase");

  const startTime = new Date();

  useEffect(() => {
    dispatch(generateQuestion());
  }, []);

  const answerHandler = (answerValue: number) => (): void => {
    if (currentQuestion === null) return;

    const answer: SimpleAnswer = {
      question: currentQuestion,
      givenAnswer: answerValue,
      isCorrect: answerValue === currentAnswer,
      answerTime: resetTimer(),
    };

    setCorrectAnswerArrow(answer.isCorrect ? "increase" : "decrease");

    setAverageTimeArrow(
      totalTime / (totalCorrectAnswers + totalWrongAnswers) > answer.answerTime
        ? "increase"
        : "decrease",
    );

    dispatch(addAnswer(answer));

    dispatch(generateQuestion());
  };

  console.info(
    `Question Start Time: ${startTime.toISOString()} | Render Count: ${renderCount++}`,
  );

  if (currentQuestion === null || currentAnswer === null) return <Spinner />;

  return (
    <div>
      <Center mt={6} mb={8}>
        <CircularProgress
          max={60}
          thickness={8}
          value={currentQuestion}
          size={172}
          color="purple.500"
          trackColor="gray.700"
        >
          <CircularProgressLabel>
            <Heading size="4xl">:{secondsToString(currentQuestion)}</Heading>
          </CircularProgressLabel>
        </CircularProgress>
      </Center>
      <Container mb={12}>
        <SimpleGrid columns={3} spacing={5} minH="240px">
          {Array.from({ length: 6 }, (_, i) => (
            <OptionButton
              key={`answerButton-${i}`}
              handler={answerHandler}
              option={generateOption(currentAnswer, i)}
            />
          ))}
        </SimpleGrid>
      </Container>
      <Container>
        <SimpleGrid columns={2} spacing={10}>
          <Stat>
            <StatLabel>Correct</StatLabel>
            <StatNumber as="code">
              <Flex align="baseline">
                {totalCorrectAnswers}
                <Text ml={1} fontSize="xs">
                  / {totalCorrectAnswers + totalWrongAnswers}
                </Text>
              </Flex>
            </StatNumber>
            <StatHelpText>
              <StatArrow type={correctAnswerArrow} me={0.5} />
              <code>
                {getPercentage(totalCorrectAnswers, totalWrongAnswers).toFixed(
                  1,
                )}
                %
              </code>
            </StatHelpText>
          </Stat>

          <Stat textAlign="end">
            <StatLabel>Time</StatLabel>
            <StatNumber as="code">
              <Flex align="baseline" justify="end">
                <Timer />
                <Text ml={1} fontSize="xs">
                  ms
                </Text>
              </Flex>
            </StatNumber>
            <StatHelpText>
              <code>
                ~
                {(
                  totalTime / (totalCorrectAnswers + totalWrongAnswers) || 0
                ).toFixed(0)}
                ms
              </code>
              <StatArrow type={averageTimeArrow} me={0} ms={0.5} />
            </StatHelpText>
          </Stat>
        </SimpleGrid>
      </Container>
    </div>
  );
};

export default SimpleMode;

/*
type AnswerButtonProps = ComponentWithAs<
  "button",
  ButtonProps & {
    correct: number;
    answer: number;
  }
>;

const AnswerButton = forwardRef<HTMLButtonElement, AnswerButtonProps>(
  (props, ref) => {
    const { children, onClick, correct, answer } = props;

    const answerHandler = (answer: number) => (): void => {
      if (answer === correct) {
        console.log("Correct!");
      } else {
        console.log("False!");
      }
    };

    return (
      <Button ref={ref} colorScheme="purple" onClick={answerHandler(answer)}>
        {children}
      </Button>
    );
  },
);
*/
