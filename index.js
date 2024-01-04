import math_terms from "./math_terms.json" assert { type: "json" };

const optionsForm = document.querySelector("#form-options");
const buttonSubmit = document.querySelector("#button-submit");
const buttonNext = document.querySelector("#button-next");

// const term = document.querySelector(".term");
// term.innerText = math_terms[42].en;

optionsForm.addEventListener("submit", (event) => {
  const options = optionsForm.querySelectorAll(".option");

  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    const radio = option.querySelector("input");

    if (radio.checked && i != 1) {
      option.classList.add("answer-wrong");
    }

    // TODO: переменная
    if (i == 1) {
      option.classList.add("answer-correct");
    }
  }

  buttonNext.disabled = false;
  buttonSubmit.disabled = true;

  event.preventDefault();
});

buttonNext.addEventListener("click", (event) => {
  for (const option of optionsForm.querySelectorAll(".option")) {
    option.classList.remove("answer-correct", "answer-wrong");
  }

  const firstRadio = optionsForm.querySelector("input");
  firstRadio.checked = true;

  buttonSubmit.disabled = false;
  buttonNext.disabled = true;
});
