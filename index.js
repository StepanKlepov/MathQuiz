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

function generateAnswerOptions(count, total, ix_correct) {
  let a = [ix_correct];

  while (a.length < count) {
    const ix = randomInt(0, total);
    if (!a.includes(ix)) {
      a.push(ix);
    }
  }

  return shuffle(a);
}

function reset(all_terms, num_questions, num_options) {
  const questions = deal(num_questions, all_terms.length);
  const currentQuestion = 0;
  const answerOptions = generateAnswerOptions(
    num_options,
    all_terms.length,
    questions[currentQuestion]
  );

  return [questions, currentQuestion, answerOptions];
}

function fillQuestion(all_terms, ix_term, ixs_options) {
  const contQuestion = document.querySelector(".question");
  const textTerm = contQuestion.querySelector(".term");
  textTerm.innerText = all_terms[ix_term][LANG_FROM];

  const contOptions = contQuestion.querySelectorAll(".answer-option");
  for (let i = 0; i < contOptions.length; i++) {
    const textAnswer = contOptions[i].querySelector(".option-text");
    textAnswer.innerText = all_terms[ixs_options[i]][LANG_TO];
  }
}

function fillCounter(idxCurrent, cntTotal) {
  spanCntCurrent.innerText = idxCurrent + 1;
  spanCntTotal.innerText = cntTotal;
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

let math_terms = null;
let [questions, currentQuestion, answerOptions] = [null, null, null];

function startQuiz() {
  [questions, currentQuestion, answerOptions] = reset(
    math_terms,
    NUM_QUESTIONS,
    NUM_OPTIONS
  );

  fillQuestion(math_terms, questions[currentQuestion], answerOptions);
  fillCounter(currentQuestion, NUM_QUESTIONS);
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

    if (radio.checked && !isAnswerCorrect) {
      option.classList.add("answer-wrong");
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
    startQuiz();
  } else {
    answerOptions = generateAnswerOptions(
      NUM_OPTIONS,
      math_terms.length,
      questions[currentQuestion]
    );
    fillCounter(currentQuestion, NUM_QUESTIONS);
  }

  fillQuestion(math_terms, questions[currentQuestion], answerOptions);

  for (const option of formOptions.querySelectorAll(".answer-option")) {
    option.classList.remove("answer-correct", "answer-wrong");
  }

  const radioFirst = formOptions.querySelector("input");
  radioFirst.checked = true;

  buttonSubmit.disabled = false;
  buttonNext.disabled = true;
});
