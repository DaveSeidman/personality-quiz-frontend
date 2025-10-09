import React, { useState, useEffect, useRef } from 'react';
import { getBestOption, shuffle } from './utils';
import questions from './assets/data/questions.json';
import personas from './assets/data/personas.json'
import backgroundVideo from './assets/videos/background1.mp4';

import './index.scss';

const App = () => {

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [responses, setResponses] = useState([]);
  const [attract, setAttract] = useState(true);
  const [persona, setPersona] = useState();
  const questionTimer = useRef();

  const timeoutRef = useRef();
  const TIMEOUT_DELAY = 20000;
  const TIMEOUT_DURATION = 5000; // use this only if we want an "are you still there?" screen

  const start = () => {
    setCurrentQuestion(0);
    setResponses([]);
    setPersona();
    questions.forEach(question => {
      question.options = shuffle(question.options);
    });
  }

  const addResponse = (e) => {
    // console.log(e.target)
    const startedAt = questionTimer.current ?? performance.now();
    const delay = Math.max(0, Math.round(performance.now() - startedAt));
    questionTimer.current = null;
    const id = e.target.getAttribute('data-id')
    // const answerPersona = e.target.getAttribute('data-persona');
    const order = parseInt(e.target.getAttribute('data-order'));
    const index = parseInt(e.target.getAttribute('data-index'));
    console.log({ id, index, order, delay })
    setResponses(prev => {
      const next = [...prev];
      next[index] = { id, order, delay };
      return next;
    });

    setCurrentQuestion(currentQuestion + 1);
  }

  const idleTimeout = () => {
    setAttract(true);
  }

  const resetIdleTimeout = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(idleTimeout, TIMEOUT_DELAY);
  }

  useEffect(() => {
    questionTimer.current = performance.now();
    // console.log(responses.length, questions.length);
    if (responses.length === questions.length) {
      // axios.post('http://localhost:8000/persona', { responses }).then(res => {
      //   console.log(res.data)
      //   setPersona(res.data);
      // })

      const bestOption = getBestOption(responses);
      console.log({ bestOption })
      const matchedPersonality = personas.find(p => p.id === bestOption.id)
      console.log({ matchedPersonality })
      setPersona(matchedPersonality)
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
      <div className={`background ${currentQuestion !== null && currentQuestion >= 0 ? 'hidden' : ''}`}>
        {/* <video src={backgroundVideo} muted loop autoPlay playsInline /> */}
      </div>

      <div className="questions">
        {questions.map((question, questionIndex) => (
          <div
            // key={question.id}
            className={`questions-question ${questionIndex === currentQuestion ? '' : 'hidden'}`}
          >
            <h1 className="questions-question-text">{question.text}</h1>
            <div className={`questions-question-options ${question.options[0].video ? 'videos' : ''}`}>
              {question.options.map((option, order) => (
                <button
                  // key={option.id}
                  data-index={questionIndex}
                  data-id={option.id}
                  data-persona={option.persona}
                  data-order={order + 1}
                  style={{ transitionDelay: `${(order + 4) / 2}s` }}
                  className="questions-question-options-option"
                  onClick={addResponse}
                >{option.video
                  ? (<video autoPlay muted playsInline loop><source src={option.video} /></video>)
                  : (<p>{option.text}</p>)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={`results ${currentQuestion >= questions.length ? '' : 'hidden'}`}>
        <h1 className="results-title">you matched with the</h1>
        <h2 className="results-persona">{persona?.name}</h2>
        <p className="results-description">{persona?.description}</p>
        <p className="results-drink">Ask your Bartender for a 🥤 {persona?.drink} 🥤</p>
        <button className="results-restart" onClick={start}>Restart</button>
      </div>
      <button
        className={`start ${currentQuestion === null ? '' : 'hidden'}`}
        onClick={start}
      >
        Tap to Begin
      </button>
    </div>
  );
}


export default App;
