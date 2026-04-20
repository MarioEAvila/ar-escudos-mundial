import { useEffect, useMemo, useState } from "react";
import "./TriviaModal.css";

export default function TriviaModal({
  questions = [],
  onClose,
  countryName = "Qatar 2022",
  countryFlag = "🌍",
  title = "Trivia",
}) {
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [triviaAnswers, setTriviaAnswers] = useState(
    Array(questions.length).fill(null)
  );
  const [triviaFinished, setTriviaFinished] = useState(false);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaGrade, setTriviaGrade] = useState("");

  useEffect(() => {
    setTriviaIndex(0);
    setTriviaAnswers(Array(questions.length).fill(null));
    setTriviaFinished(false);
    setTriviaScore(0);
    setTriviaGrade("");
  }, [questions]);

  const computeGrade = (score, total) => {
    const pct = total === 0 ? 0 : score / total;

    if (pct >= 0.9) return "Leyenda";
    if (pct >= 0.7) return "Experto";
    if (pct >= 0.45) return "Fan";
    return "Principiante";
  };

  const selectTriviaOption = (optionIndex) => {
    setTriviaAnswers((prev) => {
      const copy = [...prev];
      copy[triviaIndex] = optionIndex;
      return copy;
    });
  };

  const nextTriviaQuestion = () => {
    if (triviaIndex < questions.length - 1) {
      setTriviaIndex((i) => i + 1);
    }
  };

  const prevTriviaQuestion = () => {
    if (triviaIndex > 0) {
      setTriviaIndex((i) => i - 1);
    }
  };

  const finishTrivia = () => {
    let score = 0;

    for (let i = 0; i < questions.length; i++) {
      if (triviaAnswers[i] === questions[i].correctIndex) score++;
    }

    setTriviaScore(score);
    setTriviaGrade(computeGrade(score, questions.length));
    setTriviaFinished(true);
  };

  const restartTrivia = () => {
    setTriviaIndex(0);
    setTriviaAnswers(Array(questions.length).fill(null));
    setTriviaFinished(false);
    setTriviaScore(0);
    setTriviaGrade("");
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
              Reintentar
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