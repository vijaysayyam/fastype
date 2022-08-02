import React, { useState, useEffect } from "react";
import randomWords from "random-words";
import "./App.css";

// const getCloud = () =>
//   "this is just a sample text for your practice please be patient as we will change the text later and improve user experience we are planning to automise the text using a api so please be patient"
//     .split(" ")
//     .sort(() => (Math.random() > 0.5 ? 1 : -1));

function Word(props) {
  const { text, active, correct } = props;

  if (correct === true) {
    return <span className="correct">{text} </span>;
  }
  if (correct === false) {
    return <span className="incorrect">{text} </span>;
  }
  if (active) {
    return <span className="active">{text} </span>;
  }
  return <span>{text} </span>;
}
Word = React.memo(Word);

function Timer(props) {
  const { correctWords, startCounting, activeWordIndex } = props;
  const [timeElapsed, setTimeElapsed] = useState(0);
  useEffect(() => {
    let id;
    if (startCounting) {
      id = setInterval(() => {
        setTimeElapsed((oldTime) => oldTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(id);
    };
  }, [startCounting]);

  const minutes = timeElapsed / 60;

  return (
    <div className="stats">
      <p>Timer: {timeElapsed} Sec</p>
      <p>Speed: {(correctWords / minutes || 0).toFixed(2)} WPM</p>
      <p>
        Correct: <span className="green">{correctWords}</span>
      </p>
      <p>
        Incorrect: <span className="red">{activeWordIndex - correctWords}</span>
      </p>
      <p>
        Accuracy: {((correctWords / activeWordIndex) * 100 || 0).toFixed(2)}%
      </p>
    </div>
  );
}

const App = () => {
  const [cloud, setCloud] = useState([]);

  useEffect(() => {
    setCloud(generateWords());
  }, []);

  function generateWords() {
    return new Array(35).fill(null).map(() => randomWords());
  }

  const [userInput, setUserInput] = useState("");
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [correctWordArray, setCorrectWordArray] = useState([]);
  const [startCounting, setStartCounting] = useState(false);
  const [correctWords, setCorrectWords] = useState(0);

  function processInput(value) {
    if (activeWordIndex === cloud.length) {
      return;
    }
    setStartCounting(true);

    if (value.endsWith(" ")) {
      setActiveWordIndex((index) => index + 1);
      if (activeWordIndex === cloud.length - 1) {
        refreshPage();
        setStartCounting(false);
      }
      setUserInput("");

      const word = value.trim();
      if (word === cloud[activeWordIndex]) {
        setCorrectWords((prev) => prev + 1);
      }
      setCorrectWordArray((data) => {
        const newResult = [...data];
        newResult[activeWordIndex] = word === cloud[activeWordIndex];
        return newResult;
      });
    } else {
      setUserInput(value);
    }
  }

  function refreshPage() {
    window.location.reload();
  }

  return (
    <div>
      <div className="header">
        <div className="navBar">
          <h1>Typ-pace</h1>
          <div>
            <object
              data="../images/refresh-svgrepo-com.svg"
              onClick={() => {
                refreshPage();
              }}
              aria-label="refresh"
            ></object>
          </div>
        </div>
        <Timer
          startCounting={startCounting}
          correctWords={correctWords}
          activeWordIndex={activeWordIndex}
        />
      </div>
      <p>
        {cloud.map((word, index) => {
          return (
            <Word
              text={word}
              active={index === activeWordIndex}
              correct={correctWordArray[index]}
            />
          );
        })}
      </p>
      <div>
        <input
          className="input"
          type="text"
          value={userInput}
          onChange={(e) => processInput(e.target.value)}
        />
      </div>
    </div>
  );
};

export default App;
