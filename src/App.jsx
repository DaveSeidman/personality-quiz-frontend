import React, { useState, useEffect, useRef } from 'react';
import { modeRandomTie } from './utils';
import questions from './assets/data/questions.json';

import './index.scss';

const App = () => {

  const [questionIndex, setQuestionIndex] = useState();
  const [responses, setResponses] = useState([]);
  const [attract, setAttract] = useState(true);
  const [persona, setPersona] = useState();

  const timeoutRef = useRef();
  const TIMEOUT_DELAY = 20000;
  const TIMEOUT_DURATION = 5000;

  // const start = () => {

  // }

  const start = () => {
    setQuestionIndex(0);
    setResponses([])
    setPersona()
  }


  const idleTimeout = () => {
    setAttract(true);
  }

  const resetIdleTimeout = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(idleTimeout, TIMEOUT_DELAY);
  }

  useEffect(() => {
    console.log(responses.length, questions.length)
    if (responses.length === questions.length) {
      const nextPersona = modeRandomTie(responses);
      console.log({ nextPersona })
      setPersona(nextPersona);
    }
  }, [responses.length])

  useEffect(() => {
    addEventListener('click', resetIdleTimeout);
    return (() => {
      removeEventListener('click', resetIdleTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    })
  })



  return (
    <div className='app'>
      <div className="questions">
        {questions.map((question, i) => (
          <div
            key={question.id}
            className={`questions-question ${i === questionIndex ? '' : 'hidden'}`}
          >
            <h1 className="questions-question-text">{question.text}</h1>
            <div className="questions-question-options">
              {question.options.map(option => (
                <button
                  key={option.id}
                  className="questions-question-options-option"
                  onClick={(e) => {
                    setResponses(prev => {
                      setQuestionIndex(questionIndex + 1);

                      prev[i] = option.id;
                      return prev
                    })
                  }}
                >{option.text}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={`results ${questionIndex >= questions.length ? '' : 'hidden'}`}>
        <h1>Congratulations</h1>
        <p>{persona}</p>
        <button
          className="results-restart"
          onClick={start}
        >Restart</button>
      </div>

      <button
        className={`start ${questionIndex === undefined ? '' : 'hidden'}`}
        onClick={start}
      >
        Begin
      </button>

    </div>
  );
}


export default App;
