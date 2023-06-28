var quizData = [
    {
      question: "What does CSS stand for?",
      choices: ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
      answer: "Cascading Style Sheets",
    },
    {
      question: "Which HTML tag is used to define an external JavaScript file?",
      choices: ["<script>", "<javascript>", "<js>", "<scripting>"],
      answer: "<script>",
    },
    {
      question: "Which of the following is NOT a JavaScript data type?",
      choices: ["String", "Number", "Boolean", "Float"],
      answer: "Float",
    },
    {
      question: "What is the correct way to comment out a line in CSS?",
      choices: ["// This is a comment", "/* This is a comment */", "<!-- This is a comment -->", "# This is a comment"],
      answer: "/* This is a comment */",
    },
    {
      question: "What does the HTML acronym DOCTYPE stand for?",
      choices: ["Document Type", "Doctype", "Document Category", "Declaration of Type"],
      answer: "Document Type",
    },
    {
      question: "Which JavaScript method is used to remove the last element from an array?",
      choices: ["pop()", "shift()", "push()", "unshift()"],
      answer: "pop()",
    },
    {
      question: "What is the correct CSS property to change the background color of an element?",
      choices: ["background-image", "background-color", "color", "text-color"],
      answer: "background-color",
    },
    {
      question: "In HTML, which tag is used to create a hyperlink?",
      choices: ["<a>", "<link>", "<href>", "<hyperlink>"],
      answer: "<a>",
    },
    {
      question: "What is the result of the expression '3' + 2 in JavaScript?",
      choices: ["5", "32", "7", "NaN"],
      answer: "32",
    },
    {
      question: "Which CSS property is used to control the spacing between letters?",
      choices: ["text-align", "text-decoration", "text-indent", "letter-spacing"],
      answer: "letter-spacing",
    },
  ];
  
  var currentQuestionIndex = 0;
  var timeLeft = 600; // 10 minutes in seconds
  var timerId;
  var score = 0; // Initialize score to 0
  
  var startButton = document.getElementById("start-button");
  var questionEl = document.getElementById("question");
  var choicesEl = document.getElementById("choices");
  var resultScreenEl = document.getElementById("result-screen");
  var scoreEl = document.getElementById("score");
  var timerEl = document.getElementById("timer");
  var initialsForm = document.getElementById("initials-form");
  var initialsInput = document.getElementById("initials");
  
  // Load leaderboard data and display it on the landing page
  function loadLeaderboard() {
    var leaderboardContainer = document.getElementById("leaderboard-container");
    var highscores = JSON.parse(localStorage.getItem("highscores")) || [];
  
    if (!leaderboardContainer) {
      console.error("Leaderboard container not found.");
      return;
    }
  
    leaderboardContainer.innerHTML = "";
  
    highscores.forEach(function (scoreData) {
      createLeaderboardCard(scoreData.initials, scoreData.score);
    });
  }
  
  // Call the loadLeaderboard function when the page is loaded
  window.addEventListener("load", loadLeaderboard);
  
  // Start the quiz
  function startQuiz() {
    startButton.disabled = true;
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");
    timerId = setInterval(updateTimer, 1000);
    showQuestion();
  }
  
  // Display a question
  function showQuestion() {
    var question = quizData[currentQuestionIndex];
    questionEl.textContent = question.question;
    choicesEl.innerHTML = "";
  
    question.choices.forEach(function (choice) {
      var label = document.createElement("label");
      var radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "choice";
      radio.value = choice;
  
      var span = document.createElement("span");
      span.textContent = choice;
  
      label.appendChild(radio);
      label.appendChild(span);
      choicesEl.appendChild(label);
    });
  
    var submitButton = document.createElement("button");
    submitButton.textContent = "Submit Answer";
    submitButton.addEventListener("click", submitAnswer);
    choicesEl.appendChild(submitButton);
  
    clearInterval(timerId);
    timerId = setInterval(updateTimer, 1000);
  }
  
  // Submit the selected answer
  function submitAnswer() {
    var selectedChoice = choicesEl.querySelector("input[type='radio']:checked");
    if (!selectedChoice) {
      return;
    }
  
    var selectedAnswer = selectedChoice.value;
    var question = quizData[currentQuestionIndex];
  
    if (selectedAnswer === question.answer) {
      score += 10;
      selectedChoice.parentNode.classList.add("correct");
      currentQuestionIndex++;
    } else {
      timeLeft -= 60;
      if (timeLeft < 0) {
        timeLeft = 0;
      }
      selectedChoice.parentNode.classList.add("incorrect");
      var notificationEl = document.getElementById("notification");
      notificationEl.textContent = "Incorrect! 1 minute has been deducted.";
      notificationEl.classList.add("incorrect");
      setTimeout(function () {
        notificationEl.textContent = "";
        notificationEl.classList.remove("incorrect");
      }, 2000);
    }
  
    if (currentQuestionIndex < quizData.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  }
  
  // Save the score and restart the quiz
  function saveScoreAndRestart(event) {
    event.preventDefault();
    var initials = initialsInput.value.toUpperCase();
  
    if (initials) {
      var highscores = JSON.parse(localStorage.getItem("highscores")) || [];
      var existingScore = highscores.find(function (scoreData) {
        return scoreData.initials === initials;
      });
  
      if (existingScore) {
        alert("You have already saved a score. Only one score per user is allowed.");
        return;
      }
  
      var scoreData = {
        initials: initials,
        score: score,
      };
  
      highscores.push(scoreData);
      highscores.sort((a, b) => b.score - a.score);
      highscores = highscores.slice(0, 10);
      localStorage.setItem("highscores", JSON.stringify(highscores));
      createLeaderboardCard(initials, score);
    }
  
    initialsForm.reset();
  }
  
  // End the quiz
  function endQuiz() {
    clearInterval(timerId);
    document.getElementById("quiz-screen").classList.add("hidden");
    resultScreenEl.classList.remove("hidden");
    scoreEl.textContent = Math.min(Math.floor((score / (quizData.length * 10)) * 100), 100);
  
    var refreshButton = document.createElement("button");
    refreshButton.id = "refresh-button";
    refreshButton.textContent = "Refresh Page";
    refreshButton.addEventListener("click", refreshPage);
    resultScreenEl.appendChild(refreshButton);
  }
  
  // Create leaderboard card
  function createLeaderboardCard(initials, score) {
    var leaderboardContainer = document.getElementById("leaderboard-container");
  
    if (!leaderboardContainer) {
      console.error("Leaderboard container not found.");
      return;
    }
  
    var card = document.createElement("div");
    card.classList.add("leaderboard-card");
  
    var initialsEl = document.createElement("span");
    initialsEl.classList.add("initials");
    initialsEl.textContent = initials;
  
    var scoreContainer = document.createElement("div");
    scoreContainer.classList.add("score-container");
  
    var scoreLabel = document.createElement("span");
    scoreLabel.classList.add("score-label");
    scoreLabel.textContent = "Score:";
  
    var scoreEl = document.createElement("span");
    scoreEl.classList.add("score");
    scoreEl.textContent = score;
  
    var deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "x";
    deleteButton.addEventListener("click", deleteScore);
  
    scoreContainer.appendChild(scoreLabel);
    scoreContainer.appendChild(scoreEl);
  
    card.appendChild(initialsEl);
    card.appendChild(scoreContainer);
    card.appendChild(deleteButton);
  
    leaderboardContainer.appendChild(card);
  }
  
  // Update the timer
  function updateTimer() {
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft % 60;
  
    var formattedTime = minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
  
    timerEl.textContent = "Time: " + formattedTime;
    timeLeft--;
  
    if (timeLeft < 0) {
      clearInterval(timerId);
      endQuiz();
    }
  }
  
  // Refresh the page
  function refreshPage() {
    location.reload();
  }
  
  // Delete a score from the leaderboard
  function deleteScore(event) {
    var card = event.target.closest(".leaderboard-card");
    var initials = card.querySelector(".initials").textContent;
    var score = card.querySelector(".score").textContent;
  
    var highscores = JSON.parse(localStorage.getItem("highscores")) || [];
    highscores = highscores.filter(function (scoreData) {
      return scoreData.initials !== initials || scoreData.score !== parseInt(score);
    });
    localStorage.setItem("highscores", JSON.stringify(highscores));
  
    card.remove();
  
    loadLeaderboard();
  }
  
  // Assign event listeners
  startButton.addEventListener("click", startQuiz);
  initialsForm.addEventListener("submit", saveScoreAndRestart);
  

  
  


  
  
  
  
  
  
  
  
  
  
  
  
  
  


  
  
  
  
  