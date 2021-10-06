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
  List,
  ListIcon,
  ListItem,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import useTimer from "../hooks/useTimer";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addAnswer,
  generateQuestion,
  simpleAnswersSelectors,
  SimpleAnswer,
} from "../redux/simpleModeSlice";
import KeyboardContext, { registerKListener } from "../contexts/Keyboard";
import { secondsToString, getPercentage } from "../utils";
import { CheckCircleIcon } from "@chakra-ui/icons";
import CircleIcon from "../components/CircleIcon";

let renderCount = 0;

const generateOption = (correctAnswer: number, seed: number): number =>
  (correctAnswer % 10) + seed * 10;

type OptionButtonProps = {
  option: number;
  handler: (answer: number) => MouseEventHandler<HTMLButtonElement> | undefined;
};

type ArrowStateType = "increase" | "decrease";

const OptionButton: FunctionalComponent<OptionButtonProps> = (props) => {
  const { option, handler } = props;

  return (
    <Button
      id={`answer-button-${secondsToString(option)[0]}`}
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
    itemTime,
    currentQuestion,
    currentAnswer,
    totalCorrectAnswers,
    totalWrongAnswers,
    totalTime,
  } = useAppSelector((state) => state.simpleMode);
  const answerList = useAppSelector(simpleAnswersSelectors.selectAll);
  //const answerList = useAppSelector(simpleAnswersSelectors.selectAll);
  const keyboardCallbacks = useContext(KeyboardContext);

  const { Timer, resetTimer } = useTimer();
  const [correctAnswerArrow, setCorrectAnswerArrow] =
    useState<ArrowStateType>("increase");
  const [averageTimeArrow, setAverageTimeArrow] =
    useState<ArrowStateType>("increase");

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    `Render Time: ${new Date().toISOString()} | Render Count: ${renderCount++}`,
  );

  const keyboardHandler = useCallback(
    (e: KeyboardEvent): void => {
      if (["0", "1", "2", "3", "4", "5"].includes(e.key)) {
        if (currentAnswer)
          answerHandler(generateOption(currentAnswer, parseInt(e.key, 10)))();
      }
    },
    [answerHandler, currentAnswer],
  );

  useEffect(() => {
    dispatch(generateQuestion());
  }, [dispatch]);

  useEffect(() => {
    const unregisterHandler = registerKListener(
      keyboardCallbacks,
      keyboardHandler,
    );

    return (): void => {
      unregisterHandler();
    };
  }, [currentAnswer]); //FIXME should register only at the initial state
  // ATM cannot because I cannot reach the most recent value of the global variable

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
            <Heading size="4xl">
              :<span id="question">{secondsToString(currentQuestion)}</span>
            </Heading>
            <Text fontSize="sm" style={{ opacity: 0.8 }}>
              +<span id="item-time">{secondsToString(itemTime)}</span>
            </Text>
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
      <Container mb={8}>
        <SimpleGrid columns={2} spacing={10}>
          <Stat>
            <StatLabel>Correct</StatLabel>
            <StatNumber as="code">
              <Flex align="baseline">
                <span id="correct-answers">{totalCorrectAnswers}</span>
                <Text ml={1} fontSize="xs">
                  /{" "}
                  <span id="total-answers">
                    {totalCorrectAnswers + totalWrongAnswers}
                  </span>
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

      <Container pb={8}>
        <Table variant="simple" size="md">
          <TableCaption>Session Statistics</TableCaption>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>✓</Th>
              <Th>Q</Th>
              <Th isNumeric>A</Th>
              <Th isNumeric>ms</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              //TODO make as a component & virtualize & minimize
              answerList.reverse().map((a) => (
                <Tr>
                  <Td>
                    <i>{a.id + 1}</i>
                  </Td>
                  <Td>
                    {a.isCorrect ? (
                      <CheckCircleIcon color="green.500" />
                    ) : (
                      <CircleIcon color="red.500" />
                    )}
                  </Td>
                  <Td>
                    {secondsToString(a.question)}
                    <span style={{ opacity: 0.25 }}>?</span>
                  </Td>
                  <Td isNumeric>
                    <b>{secondsToString(a.givenAnswer)}</b>
                  </Td>
                  <Td isNumeric>
                    <code>{a.answerTime}</code>
                  </Td>
                </Tr>
              ))
            }
          </Tbody>
        </Table>
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
