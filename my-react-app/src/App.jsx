import React, { useState } from "react"
import "./App.css"

function App() {
  const easyWords = ["I am speed", "Typing like a pro", "Why so slow"]
  const mediumWords = ["This sentence is harder than it looks", "One typo and I lose all respect", "Your keyboard is slower than a snail"]
  const hardWords = ["The mitochondria is the powerhouse of the cell", "The quick brown fox jumps over the lazy dog", "Typing perfectly is simply a myth conjured by keyboards plotting revenge"]

  const [currentWord, setCurrentWord] = useState("")
  const [userInput, setUserInput] = useState("")
  const [gameStarted, setGameStarted] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [levelCompleted, setLevelCompleted] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [difficulty, setDifficulty] = useState("easy")
  const [bestTimeEasy, setBestTimeEasy] = useState(Number.POSITIVE_INFINITY)
  const [bestTimeMedium, setBestTimeMedium] = useState(Number.POSITIVE_INFINITY)
  const [bestTimeHard, setBestTimeHard] = useState(Number.POSITIVE_INFINITY)
  const [totalTime, setTotalTime] = useState(0)

  function getCurrentWord(index = wordIndex) {
    let wordList = difficulty === "easy" ? easyWords : difficulty === "medium" ? mediumWords : hardWords
    return wordList[index]
  }

  function startGame() {
    setWordIndex(0)
    setCurrentWord(getCurrentWord(0))
    setUserInput("")
    setGameStarted(true)
    setLevelCompleted(false)
    setStartTime(0)
    setEndTime(0)
    setErrorCount(0)
    setTotalTime(0)
  }

  function handleInputChange(e) {
    const value = e.target.value
    setUserInput(value)

    if (value.length === 1 && startTime === 0) {
      setStartTime(Date.now())
    }

    if (value && !currentWord.startsWith(value)) {
      setErrorCount(errorCount + 1)
    }

    if (value === currentWord) {
      const now = Date.now()
      setEndTime(now)
      const timeTaken = (now - startTime) / 1000
      setTotalTime(totalTime + timeTaken)

      if (wordIndex < 2) {
        setWordIndex((prevIndex) => {
          const newIndex = prevIndex + 1;
          setCurrentWord(getCurrentWord(newIndex));
          return newIndex;
        });
        setUserInput("")
        setStartTime(0)
        setEndTime(0)
      } else {
        setLevelCompleted(true)
        const levelTotalTime = totalTime + timeTaken
        if (difficulty === "easy" && levelTotalTime < bestTimeEasy) {
          setBestTimeEasy(levelTotalTime)
        } else if (difficulty === "medium" && levelTotalTime < bestTimeMedium) {
          setBestTimeMedium(levelTotalTime)
        } else if (difficulty === "hard" && levelTotalTime < bestTimeHard) {
          setBestTimeHard(levelTotalTime)
        }
      }
    }
  }

  function resetGame() {
    setGameStarted(false)
    setLevelCompleted(false)
    setUserInput("")
    setCurrentWord("")
    setWordIndex(0)
    setStartTime(0)
    setEndTime(0)
    setErrorCount(0)
    setTotalTime(0)
  }

  function changeDifficulty(newDifficulty) {
    setDifficulty(newDifficulty)
    if (gameStarted) {
      resetGame()
    }
  }

  function nextLevel() {
    if (difficulty === "easy") {
      setDifficulty("medium")
    } else if (difficulty === "medium") {
      setDifficulty("hard")
    }
    startGame()
  }

  function getTimeTaken() {
    if (startTime === 0) return 0
    if (endTime === 0) {
      return ((Date.now() - startTime) / 1000).toFixed(2)
    }
    return ((endTime - startTime) / 1000).toFixed(2)
  }

  function formatBestTime(time) {
    return time === Number.POSITIVE_INFINITY ? "N/A" : `${time.toFixed(2)}s`
  }

  React.useEffect(() => {
    if (gameStarted && !levelCompleted) {
      setCurrentWord(getCurrentWord())
    }
  }, [wordIndex, difficulty])

  return (
    <div className="app-container">
      <h1>Speed Typing Challenge</h1>
      <p className="subtitle">Type the words as fast as you can!</p>
      <div className="difficulty-buttons">
        <button className={difficulty === "easy" ? "active" : ""} onClick={() => changeDifficulty("easy")} disabled={gameStarted && !levelCompleted}>Easy</button>
        <button className={difficulty === "medium" ? "active" : ""} onClick={() => changeDifficulty("medium")} disabled={gameStarted && !levelCompleted}>Medium</button>
        <button className={difficulty === "hard" ? "active" : ""} onClick={() => changeDifficulty("hard")} disabled={gameStarted && !levelCompleted}>Hard</button>
      </div>
      {gameStarted && !levelCompleted && (
        <div className="game-area">
          <div className="progress">Word {wordIndex + 1} of 3</div>
          <div className="word-display">{currentWord}</div>
          <div className="stats">
            <span>Current Time: {getTimeTaken()}s</span>
            <span>Total Time: {totalTime.toFixed(2)}s</span>
            <span>Errors: {errorCount}</span>
          </div>
          <input type="text" value={userInput} onChange={handleInputChange} placeholder="Type here..." className={userInput && !currentWord.startsWith(userInput) ? "error" : ""} autoFocus />
        </div>
      )}
      {levelCompleted && (
        <div className="result-box">
          <h3>Level Completed!</h3>
          <p>You completed the {difficulty} level in {totalTime.toFixed(2)} seconds</p>
          <p>Errors made: {errorCount}</p>
          {difficulty !== "hard" && <button className="next-level-button" onClick={nextLevel}>Next Level</button>}
        </div>
      )}
      <div className="game-buttons">
        {!gameStarted ? <button className="start-button" onClick={startGame}>Start Game</button> : <button className="reset-button" onClick={resetGame}>Reset Game</button>}
      </div>
    </div>
  )
}

export default App