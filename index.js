// index.js

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#browser_compatibility
// import math_terms from "./math_terms.json" assert { type: "json" };

function randomInt(low, high) {
  return Math.trunc(low + Math.random() * (high - low));
}

// https://learn.javascript.ru/task/shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; --i) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function deal(count, total) {
  const a = Array(total)
    .fill(0)
    .map((x, i) => i);

  return shuffle(a).slice(0, count);
}

function generateAnswerOptions(count, total, ixCorrect) {
  let a = [ixCorrect];

  while (a.length < count) {
    const ix = randomInt(0, total);
    if (!a.includes(ix)) {
      a.push(ix);
    }
  }

  return shuffle(a);
}

function reset(allTerms, numQuestions, numOptions) {
  const questions = deal(numQuestions, allTerms.length);
  const currentQuestion = 0;
  const answerOptions = generateAnswerOptions(
    numOptions,
    allTerms.length,
    questions[currentQuestion]
  );

  return [questions, currentQuestion, answerOptions];
}

function fillQuestion(allTerms, ixTerm, ixsOptions) {
  const contQuestion = document.querySelector(".question");
  const textTerm = contQuestion.querySelector(".term");
  textTerm.innerText = allTerms[ixTerm][LANG_FROM];

  const contOptions = contQuestion.querySelectorAll(".answer-option");
  for (let i = 0; i < contOptions.length; i++) {
    const textAnswer = contOptions[i].querySelector(".option-text");
    textAnswer.innerText = allTerms[ixsOptions[i]][LANG_TO];
  }
}

function fillCounter(idxCurrent, cntTotal) {
  spanCntCurrent.innerText = idxCurrent + 1;
  spanCntTotal.innerText = cntTotal;
}

function showResult(cntCorrect, cntTotal) {
  spanStatsCorrect.innerText = cntCorrect;
  spanStatsTotal.innerText = cntTotal;
  spanStatsPct.innerText = ((cntCorrect / cntTotal) * 100).toFixed(0);
  dlgResult.showModal();
}

async function loadJson(path) {
  const response = await fetch(path);
  const json = await response.json();
  return json;
}

/******************************************************************************/

const NUM_QUESTIONS = 20;
const NUM_OPTIONS = 4;
const LANG_FROM = "en";
const LANG_TO = "ru";

const formOptions = document.querySelector("#form-options");
const buttonSubmit = document.querySelector("#button-submit");
const buttonNext = document.querySelector("#button-next");
const spanCntCurrent = document.querySelector("#span-counter-current");
const spanCntTotal = document.querySelector("#span-counter-total");

const dlgResult = document.querySelector("#dialog-result");
const spanStatsCorrect = document.querySelector("#span-stats-correct");
const spanStatsTotal = document.querySelector("#span-stats-total");
const spanStatsPct = document.querySelector("#span-stats-pct");
const buttonRestart = document.querySelector("#button-restart");

let math_terms = null;
let [questions, currentQuestion, answerOptions] = [null, null, null];
let cntCorrect = 0;

function startQuiz() {
  [questions, currentQuestion, answerOptions] = reset(
    math_terms,
    NUM_QUESTIONS,
    NUM_OPTIONS
  );

  cntCorrect = 0;
  fillQuestion(math_terms, questions[currentQuestion], answerOptions);
  fillCounter(currentQuestion, NUM_QUESTIONS);
}

function resetDisplay() {
  for (const option of formOptions.querySelectorAll(".answer-option")) {
    option.classList.remove("answer-correct", "answer-wrong");
  }

  const radioFirst = formOptions.querySelector("input");
  radioFirst.checked = true;

  buttonSubmit.disabled = false;
  buttonNext.disabled = true;
}

loadJson("./math_terms.json").then((json) => {
  math_terms = json;
  startQuiz();
});

formOptions.addEventListener("submit", (event) => {
  const contOptions = formOptions.querySelectorAll(".answer-option");

  for (let i = 0; i < contOptions.length; i++) {
    const option = contOptions[i];
    const radio = option.querySelector("input");
    const isAnswerCorrect = answerOptions[i] === questions[currentQuestion];

    if (radio.checked) {
      if (isAnswerCorrect) {
        ++cntCorrect;
      } else {
        option.classList.add("answer-wrong");
      }
    }

    if (isAnswerCorrect) {
      option.classList.add("answer-correct");
    }
  }

  buttonNext.disabled = false;
  buttonSubmit.disabled = true;

  event.preventDefault();
});

buttonNext.addEventListener("click", (event) => {
  console.log(currentQuestion + 1);

  if (++currentQuestion >= NUM_QUESTIONS) {
    showResult(cntCorrect, NUM_QUESTIONS);
  } else {
    answerOptions = generateAnswerOptions(
      NUM_OPTIONS,
      math_terms.length,
      questions[currentQuestion]
    );
    resetDisplay();
    fillQuestion(math_terms, questions[currentQuestion], answerOptions);
    fillCounter(currentQuestion, NUM_QUESTIONS);
  }
});

buttonRestart.addEventListener("click", (event) => {
  dlgResult.close();
  resetDisplay();
  startQuiz();
});
