import { useMemo, useReducer } from "react";
import "./TriviaModal.css";

function createInitialTriviaState(questionCount) {
  return {
    triviaIndex: 0,
    triviaAnswers: Array(questionCount).fill(null),
    triviaFinished: false,
    triviaScore: 0,
    triviaGrade: "",
  };
}

function triviaReducer(state, action) {
  switch (action.type) {
    case "select": {
      const copy = [...state.triviaAnswers];
      copy[state.triviaIndex] = action.optionIndex;
      return {
        ...state,
        triviaAnswers: copy,
      };
    }

    case "next":
      return {
        ...state,
        triviaIndex: Math.min(state.triviaIndex + 1, action.maxIndex),
      };

    case "prev":
      return {
        ...state,
        triviaIndex: Math.max(state.triviaIndex - 1, 0),
      };

    case "finish":
      return {
        ...state,
        triviaFinished: true,
        triviaScore: action.score,
        triviaGrade: action.grade,
      };

    case "reset":
      return createInitialTriviaState(action.questionCount);

    default:
      return state;
  }
}

export default function TriviaModal({
  questions = [],
  onClose,
  onRestart,
  countryName = "Road to World Cup 2026",
  countryFlag = "🌍",
  title = "Trivia Mundial 2026",
}) {
  const [
    { triviaIndex, triviaAnswers, triviaFinished, triviaScore, triviaGrade },
    dispatch,
  ] = useReducer(
    triviaReducer,
    questions.length,
    createInitialTriviaState
  );

  const computeGrade = (score, total) => {
    const pct = total === 0 ? 0 : score / total;

    if (pct >= 0.9) return "Leyenda";
    if (pct >= 0.7) return "Experto";
    if (pct >= 0.45) return "Fan";
    return "Principiante";
  };

  const selectTriviaOption = (optionIndex) => {
    dispatch({ type: "select", optionIndex });
  };

  const nextTriviaQuestion = () => {
    if (triviaIndex < questions.length - 1) {
      dispatch({ type: "next", maxIndex: questions.length - 1 });
    }
  };

  const prevTriviaQuestion = () => {
    if (triviaIndex > 0) {
      dispatch({ type: "prev" });
    }
  };

  const finishTrivia = () => {
    let score = 0;

    for (let i = 0; i < questions.length; i++) {
      if (triviaAnswers[i] === questions[i].correctIndex) score++;
    }

    dispatch({
      type: "finish",
      score,
      grade: computeGrade(score, questions.length),
    });
  };

  const restartTrivia = () => {
    if (typeof onRestart === "function") {
      onRestart();
      return;
    }

    dispatch({ type: "reset", questionCount: questions.length });
  };

  const currentTrivia = questions[triviaIndex];
  const selectedOption = triviaAnswers[triviaIndex];
  const answeredCount = triviaAnswers.filter((a) => a !== null).length;

  const progressPercent = useMemo(() => {
    if (!questions.length) return 0;
    return ((triviaIndex + 1) / questions.length) * 100;
  }, [triviaIndex, questions.length]);

  if (!questions.length) {
    return (
      <>
        <div className="trivia-header">
          <div className="trivia-country-badge">
            <span className="trivia-flag">{countryFlag}</span>
            <div>
              <h2 className="modal-title">{title}</h2>
              <p className="trivia-country-name">{countryName}</p>
            </div>
          </div>
        </div>

        <div className="trivia-empty">
          <p>No hay preguntas disponibles todavía para esta trivia.</p>
        </div>

        <button className="modal-close" onClick={onClose}>
          Cerrar
        </button>
      </>
    );
  }

  return (
    <>
      <div className="trivia-header">
        <div className="trivia-country-badge">
          <span className="trivia-flag">{countryFlag}</span>
          <div>
            <h2 className="modal-title">{title}</h2>
            <p className="trivia-country-name">{countryName}</p>
          </div>
        </div>
      </div>

      {!triviaFinished ? (
        <div className="trivia">
          <div className="trivia-progress-wrap">
            <div className="trivia-progress-top">
              <p className="trivia-progress">
                Pregunta {triviaIndex + 1} de {questions.length}
              </p>
              <p className="trivia-progress-count">
                Respondidas: {answeredCount}
              </p>
            </div>

            <div className="trivia-progress-bar">
              <div
                className="trivia-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="trivia-question-card">
            {currentTrivia.difficulty && (
              <span className={`trivia-difficulty ${currentTrivia.difficulty}`}>
                {currentTrivia.difficulty}
              </span>
            )}

            {currentTrivia.theme && (
              <span className="trivia-theme">{currentTrivia.theme}</span>
            )}

            <h3 className="trivia-question">
              {currentTrivia.question || currentTrivia.q}
            </h3>
          </div>

          <div className="trivia-options">
            {currentTrivia.options.map((opt, idx) => {
              const correctIndex = currentTrivia.correctIndex;
              const hasAnswered = selectedOption !== null;
              const isSelected = selectedOption === idx;
              const isCorrect = idx === correctIndex;

              let extraClass = "";
              if (hasAnswered && isCorrect) extraClass = "correct";
              if (hasAnswered && isSelected && !isCorrect) {
                extraClass = "incorrect";
              }

              return (
                <button
                  key={idx}
                  type="button"
                  className={`trivia-option ${
                    isSelected ? "selected" : ""
                  } ${extraClass}`}
                  onClick={() => selectTriviaOption(idx)}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div
              className={`trivia-feedback ${
                selectedOption === currentTrivia.correctIndex ? "ok" : "bad"
              }`}
            >
              <p className="trivia-feedback-title">
                {selectedOption === currentTrivia.correctIndex
                  ? "¡Correcto!"
                  : "Respuesta incorrecta"}
              </p>

              <p className="trivia-feedback-answer">
                Respuesta correcta:{" "}
                <strong>{currentTrivia.options[currentTrivia.correctIndex]}</strong>
              </p>

              {currentTrivia.explanation && (
                <p className="trivia-feedback-explanation">
                  {currentTrivia.explanation}
                </p>
              )}
            </div>
          )}

          <div className="trivia-actions">
            <button
              type="button"
              onClick={prevTriviaQuestion}
              disabled={triviaIndex === 0}
            >
              Anterior
            </button>

            {triviaIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={nextTriviaQuestion}
                disabled={selectedOption === null}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                onClick={finishTrivia}
                disabled={selectedOption === null}
              >
                Finalizar
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="trivia-result">
          <div className="trivia-result-hero">
            <div className="trivia-result-flag">{countryFlag}</div>
            <h3 className="trivia-result-title">Resultado final</h3>
            <p className="trivia-score">
              Puntuación: {triviaScore} / {questions.length}
            </p>
            <p className="trivia-grade">Calificación: {triviaGrade}</p>
          </div>

          <div className="trivia-review">
            {questions.map((q, i) => {
              const user = triviaAnswers[i];
              const correct = q.correctIndex;
              const ok = user === correct;
              const questionText = q.question || q.q;

              return (
                <div className="trivia-review-item" key={q.id || i}>
                  <p className="trivia-review-q">
                    {i + 1}. {questionText}
                  </p>

                  <p className={`trivia-review-a ${ok ? "ok" : "bad"}`}>
                    Tu respuesta:{" "}
                    {user === null ? "Sin responder" : q.options[user]}
                  </p>

                  {!ok && (
                    <p className="trivia-review-correct">
                      Correcta: {q.options[correct]}
                    </p>
                  )}

                  {q.explanation && (
                    <p className="trivia-review-explanation">
                      {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="trivia-actions">
            <button type="button" onClick={restartTrivia}>
              Reintentar con nuevas preguntas
            </button>
          </div>
        </div>
      )}

      <button className="modal-close" onClick={onClose}>
        Cerrar
      </button>
    </>
  );
}
