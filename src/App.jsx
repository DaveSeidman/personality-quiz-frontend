import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { modeRandomTie, shuffle } from './utils';
import questions from './assets/data/questions.json';

import './index.scss';

const App = () => {

  const [questionIndex, setQuestionIndex] = useState();
  const [responses, setResponses] = useState([]);
  const [attract, setAttract] = useState(true);
  const [persona, setPersona] = useState();
  const questionTimer = useRef();

  const timeoutRef = useRef();
  const TIMEOUT_DELAY = 20000;
  const TIMEOUT_DURATION = 5000;

  const start = () => {
    setQuestionIndex(0);
    setResponses([]);
    setPersona();
    questions.forEach(question => {
      question.options = shuffle(question.options);
    });
  }

  const addResponse = (e) => {
    const startedAt = questionTimer.current ?? performance.now();
    const delay = Math.max(0, Math.round(performance.now() - startedAt));
    questionTimer.current = null;
    const answerId = e.target.getAttribute('data-id')
    const answerPersona = e.target.getAttribute('data-persona');
    const index = e.target.getAttribute('data-index')

    setResponses(prev => {
      const next = [...prev];
      next[index] = { persona: answerPersona, delay };
      return next;
    });

    setQuestionIndex(questionIndex + 1);
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
    questionTimer.current = performance.now();

    if (responses.length === questions.length) {
      axios.post('http://localhost:8000/persona', { responses }).then(res => {
        console.log(res.data)
      })
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
                  data-index={i}
                  data-id={option.id}
                  data-persona={option.persona}
                  className="questions-question-options-option"
                  onClick={addResponse}
                >{`${option.id} - ${option.text}`}</button>
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
