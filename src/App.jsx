import React, { useRef, useState, useEffect } from "react";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import { Button, Container, Row, Col, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import './index.css';

function App() {
  const [startQuiz, setStartQuiz] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState([]);
  const [questionNum, setQuestionNum] = useState(0);
  const [selectedVal, setselectedVal] = useState(null);
  const [checkAns, setCheckAns] = useState(0);
  const [shuffle, setShuffle] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [footerPosition, setFooterPosition] = useState(false);

  let radiosRef = useRef([]);

  const handleClick = (radio) => setselectedVal(radio);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function nextQuestion(index) {
    if (!selectedVal) {
      alert("Please select an answer");
      return;
    }

    if (quizQuestion[index].correctAnswer === selectedVal) {
      setCheckAns(checkAns + 1);
    }

    if (index === quizQuestion.length - 1) {
      setShowResult(true);
    } else {
      setQuestionNum(questionNum + 1);
    }

    radiosRef.current.forEach((radio) => {
      if (radio) radio.checked = false;
    });
    setselectedVal(null);
  }

  useEffect(() => {
    if (quizQuestion.length > 0) {
      const answer = [
        ...quizQuestion[questionNum].incorrectAnswers,
        quizQuestion[questionNum].correctAnswer,
      ];
      setShuffle(shuffleArray([...answer]));
    }
  }, [quizQuestion, questionNum]);

  function quiz() {
    setShowResult(false);
    setQuizQuestion([]);
    setCheckAns(0);
    setQuestionNum(0);
    axios(`https://the-trivia-api.com/v2/questions`)
      .then((res) => {
        setQuizQuestion(res.data);
        setFooterPosition(false);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    if (startQuiz) {
      quiz();
      setFooterPosition(true);
    }
  }, [startQuiz]);

  return (
    <>
      <Navbar />
      <Container className="text-center">
        {!startQuiz ? (
          <div className="welcome-section">
            <h1 className="mt-4 title">Welcome to the Ultimate Quiz Challenge!</h1>
            <Row className="mt-5 justify-content-center">
              <Col xs={12} md={8}>
                <p className="description">
                  Explore random quiz questions from a variety of categories and put your knowledge to the test. Each quiz offers a fresh experience with new questions every time. Ready to see how much you know? Start the quiz and find out!
                </p>
                <Button onClick={() => setStartQuiz(true)} variant="info" className="start-button">
                  Start Quiz
                </Button>
              </Col>
            </Row>
          </div>
        ) : showResult ? (
          <>
            <h2 className="mt-4">Result</h2>
            <div className="result-sec text-center bg-light p-4 rounded-circle d-flex justify-content-center align-items-center m-auto mt-5">
              <p>
                Your Final Score <br /> is {checkAns} <br /> Out of {quizQuestion.length} <br />
                <Button onClick={quiz} variant="info" className="mt-4">
                  Play Again
                </Button>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="mt-4">Quiz Questions</h2>
            <div className="quiz-sec mb-5 bg-light p-4 rounded shadow">
              {quizQuestion.length > 0 ? (
                <>
                  <p className="font-weight-bold">
                    Q:{questionNum + 1} {quizQuestion[questionNum].question.text}
                  </p>
                  {shuffle.map((item, index) => (
                    <Form.Check
                      key={index}
                      type="radio"
                      label={item}
                      name="quiz"
                      id={`radio-${index}`}
                      ref={(el) => (radiosRef.current[index] = el)}
                      onChange={() => handleClick(item)}
                    />
                  ))}
                  <Button onClick={() => nextQuestion(questionNum)} variant="info" className="mt-3">
                    Next Question
                  </Button>
                </>
              ) : (
                <Spinner animation="border" variant="info" />
              )}
            </div>
          </>
        )}
      </Container>
      <Footer quiz={footerPosition} />
    </>
  );
}

export default App;
