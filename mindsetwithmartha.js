const quizButton = document.getElementById("start-quiz-button")
const quizModalBackdrop = document.getElementById("quiz-modal-backdrop")
const quizModalContainer = document.getElementById("quiz-modal-container")
const quizModalForm = document.getElementById("quiz-modal")
const quizModalPreviousButton = document.getElementById("quiz-modal__previous-button")
const quizModalNextButton = document.getElementById("quiz-modal__next-button")
const quizResultScore = document.getElementById("quiz-result-score")
const quizResultZone = document.getElementById("quiz-result-zone")
const quizResultRingProgress = document.querySelector(".quiz-result__ring-progress")

const TOTAL_QUESTIONS = 12
const RESULT_VIEW = TOTAL_QUESTIONS + 1
const ANSWER_POINTS = { A: 1, B: 2, C: 3 }
const MAX_SCORE = TOTAL_QUESTIONS * ANSWER_POINTS.C

const ZONES = [
  { label: "Red zone", color: "#bc6150", max: 20 },
  { label: "Amber zone", color: "#c08a3e", max: 28 },
  { label: "Green zone", color: "#4f9270", max: MAX_SCORE },
]

const state = {
  isQuizModalOpen: false,
  quizModalCurrentView: 1,
  quizModalAnswers: {},
}

const setState = (newState) => {
  Object.assign(state, newState)
  render()
}

quizButton.addEventListener("click", () => {
  setState({ isQuizModalOpen: true })
})

quizModalPreviousButton.addEventListener("click", () => {
  toggleQuizModalView()
  setState({ quizModalCurrentView: --state.quizModalCurrentView })
})

quizModalNextButton.addEventListener("click", () => {
  toggleQuizModalView()
  setState({ quizModalCurrentView: ++state.quizModalCurrentView })
})

quizModalBackdrop.addEventListener("click", (event) => {
  if (event.target === quizModalBackdrop) setState({ isQuizModalOpen: false, quizModalCurrentView: 1 })
})

quizModalForm.addEventListener("change", (event) => {
  const { name, value } = event.target
  setState({ quizModalAnswers: { ...state.quizModalAnswers, [name]: value } })
})

const showModal = () => {
  quizModalBackdrop.style.display = "flex"
}

const hideModal = () => {
  quizModalBackdrop.style.display = "none"
}

const render = () => {
  state.isQuizModalOpen ? showModal() : hideModal()

  toggleQuizModalView()

  const onResultView = state.quizModalCurrentView === RESULT_VIEW

  quizModalPreviousButton.disabled = state.quizModalCurrentView === 1

  quizModalNextButton.disabled = onResultView || !state.quizModalAnswers[`question-${state.quizModalCurrentView}`]

  if (onResultView) renderQuizResult()
}

const toggleQuizModalView = () => {
  const activeView = state.quizModalCurrentView === RESULT_VIEW ? "quiz-result" : `question-${state.quizModalCurrentView}`

  for (const panel of quizModalForm.querySelectorAll("[data-view]")) {
    panel.toggleAttribute("hidden", panel.dataset.view !== activeView)
  }
}

const calculateScore = () => Object.values(state.quizModalAnswers).reduce((total, answer) => total + ANSWER_POINTS[answer], 0)

const getZone = (score) => ZONES.find((zone) => score <= zone.max)

const renderQuizResult = () => {
  const score = calculateScore()
  const zone = getZone(score)
  const circumference = 2 * Math.PI * quizResultRingProgress.r.baseVal.value

  quizResultScore.textContent = score
  quizResultZone.textContent = zone.label
  quizResultZone.style.color = zone.color

  quizResultRingProgress.style.stroke = zone.color
  quizResultRingProgress.style.strokeDasharray = `${circumference}`
  quizResultRingProgress.style.strokeDashoffset = `${circumference * (1 - score / MAX_SCORE)}`
}
