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
} from "@chakra-ui/react";
import { getRandomInt } from "../utils";
import { MouseEventHandler } from "react";
import { useState } from "preact/hooks";
import useTimer from "../hooks/useTimer";

const itemTime = 30;

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

type Answer = {
  question: number;
  givenAnswer: number;
  isCorrect: boolean;
  answerTime: number;
};

const Home: FunctionalComponent = () => {
  const [answerList, setAnswerList] = useState<Array<Answer>>([]);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [correctAnswerArrow, setCorrectAnswerArrow] = useState<
    "increase" | "decrease"
  >("increase");
  const [averageTimeArrow, setAverageTimeArrow] = useState<
    "increase" | "decrease"
  >("increase");
  const { Timer, resetTimer } = useTimer();
  const [askedTime, setAskedTime] = useState<number>(getRandomInt(60));
  const [totalTime, setTotalTime] = useState<number>(0);

  const correctAnswer = (askedTime + itemTime) % 60;
  const startTime = new Date();

  const answerHandler = (answerValue: number) => (): void => {
    const answer: Answer = {
      question: askedTime,
      givenAnswer: answerValue,
      isCorrect: answerValue === correctAnswer,
      answerTime: resetTimer(),
    };

    if (answer.isCorrect) {
      setCorrectCount((s) => s + 1);
      setCorrectAnswerArrow("increase");
    } else {
      setWrongCount((s) => s + 1);
      setCorrectAnswerArrow("decrease");
    }

    setTotalTime((s) => s + answer.answerTime);

    setAverageTimeArrow(
      totalTime / (correctCount + wrongCount) > answer.answerTime
        ? "increase"
        : "decrease",
    );

    setAnswerList((s) => {
      s.push(answer);
      return s;
    });

    setAskedTime(getRandomInt(60));

    console.table(answerList);
  };

  console.info(
    `Start Time: ${startTime.toISOString()} | Render Count: ${renderCount++}`,
  );

  return (
    <div>
      <Center mt={6} mb={8}>
        <CircularProgress
          max={60}
          thickness={8}
          value={askedTime}
          size={172}
          color="purple.500"
          trackColor="gray.700"
        >
          <CircularProgressLabel>
            <Heading size="4xl">:{secondsToString(askedTime)}</Heading>
          </CircularProgressLabel>
        </CircularProgress>
      </Center>
      <Container mb={12}>
        <SimpleGrid columns={3} spacing={5} minH="240px">
          {Array.from({ length: 6 }, (_, i) => (
            <OptionButton
              key={`answerButton-${i}`}
              handler={answerHandler}
              option={generateOption(correctAnswer, i)}
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
                {correctCount}
                <Text ml={1} fontSize="xs">
                  / {correctCount + wrongCount}
                </Text>
              </Flex>
            </StatNumber>
            <StatHelpText>
              <StatArrow type={correctAnswerArrow} me={0.5} />
              <code>{getPercentage(correctCount, wrongCount).toFixed(1)}%</code>
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
                ~{(totalTime / (correctCount + wrongCount) || 0).toFixed(0)}ms
              </code>
              <StatArrow type={averageTimeArrow} me={0} ms={0.5} />
            </StatHelpText>
          </Stat>
        </SimpleGrid>
      </Container>
    </div>
  );
};

export default Home;

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
