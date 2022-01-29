import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  SimpleGrid,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useInterval,
} from "@chakra-ui/react";
import { FunctionalComponent, h } from "preact";
import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import CircleIcon from "../components/CircleIcon";
import KeyboardContext, { registerKListener } from "../contexts/Keyboard";
import useTimer from "../hooks/useTimer";
import { ArrowStateType, getPercentage, secondsToString } from "../lib";
import { PSAnswerData, PSAnswerInput } from "../lib/perceptualSpeed";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addAnswer,
  generateQuestion,
  perceptualSpeedSelectors,
} from "../redux/perceptualSpeedSlice";

const PerceptualSpeed: FunctionalComponent<{}> = () => {
  const {
    currentQuestion,
    currentAnswer,
    questionTime,
    totalCorrectAnswers,
    totalWrongAnswers,
    totalTime,
  } = useAppSelector((state) => state.perceptualSpeed);
  const keyboardCallbacks = useContext(KeyboardContext);
  const dispatch = useAppDispatch();
  const answerList = useAppSelector(perceptualSpeedSelectors.selectAll);
  const { Timer, resetTimer, getElapsedTime } = useTimer();
  const [correctAnswerArrow, setCorrectAnswerArrow] =
    useState<ArrowStateType>("increase");
  const [averageTimeArrow, setAverageTimeArrow] =
    useState<ArrowStateType>("increase");
  const [elapsedTime, setElapsedTime] = useState(0);

  useInterval(() => {
    setElapsedTime(getElapsedTime);
  }, 1000);

  const answerHandler = (answer: PSAnswerInput) => {
    const data: PSAnswerData = {
      question: currentQuestion!,
      givenAnswer: answer,
      correctAnswer: currentAnswer!,
      isCorrect: currentAnswer === answer,
      answerTime: resetTimer(),
    };

    setCorrectAnswerArrow(data.isCorrect ? "increase" : "decrease");

    setAverageTimeArrow(
      totalTime / (totalCorrectAnswers + totalWrongAnswers) > data.answerTime
        ? "increase"
        : "decrease",
    );

    dispatch(addAnswer(data));
    dispatch(generateQuestion());
  };

  const keyboardHandler = useCallback(
    (e: KeyboardEvent) => {
      if (["0", "1", "2", "3", "4", "5"].includes(e.key)) {
        if (currentAnswer) answerHandler(parseInt(e.key));
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

    return (): void => {
      unregisterHandler();
    };
  }, [currentAnswer]); //FIXME should register only at the initial state
  // ATM cannot because I cannot reach the most recent value of the global variable

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
            <Text fontSize="sm" opacity={0.8}>
              <span id="item-time">Target: {questionTime}s</span>
            </Text>
          </CircularProgressLabel>
        </CircularProgress>
      </Center>
      <Container mt={6} mb={8}>
        <Grid
          templateColumns="repeat(4, 1fr)"
          borderRadius="lg"
          p={1}
          border="1px"
          borderColor="gray.600"
          textAlign="center"
          mb={4}
        >
          {currentQuestion !== null &&
            Object.entries(currentQuestion).map((v) => (
              <GridItem>
                <Box p={4} border="1px" borderColor="gray.700">
                  <Text fontSize="4xl">{v[0]}</Text>
                </Box>
                <Box p={4} border="1px" borderColor="gray.700">
                  <Text fontSize="4xl">{v[1]}</Text>
                </Box>
              </GridItem>
            ))}
        </Grid>
        <SimpleGrid columns={5} spacing={5} minH="100px">
          {Array.from({ length: 5 }, (_, i) => (
            <Button
              key={`answerButton-${i}`}
              id={`answer-button-${i}`}
              colorScheme="purple"
              height="100%"
              width="100%"
              onClick={() => answerHandler(i)}
            >
              <Flex align="baseline">
                <Text fontSize="2xl">{i}</Text>
              </Flex>
            </Button>
          ))}
        </SimpleGrid>
      </Container>
      <Container mb={8}>
        <SimpleGrid columns={3} spacing={10}>
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
          <Text
            textAlign="center"
            fontSize="sm"
            opacity={0.8}
            display="flex"
            alignItems="center"
          >
            Count Vertical Matches
          </Text>
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
              <Th isNumeric>A</Th>
              <Th isNumeric>ms</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              //TODO make as a component & virtualize & minimize
              answerList
                .slice()
                .reverse()
                .map((a) => (
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
                    <Td isNumeric>
                      <b>{a.givenAnswer}</b>
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

export default PerceptualSpeed;
