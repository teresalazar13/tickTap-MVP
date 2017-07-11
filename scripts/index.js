"use strict";

window.onload = function() {
  const buttonPlay = document.getElementById("play");
  buttonPlay.addEventListener("click", play);

  const submitEmail = document.getElementById("submit-email");
  submitEmail.addEventListener("click", validate);

  const songSelect = document.getElementById("song-select");
  songSelect.addEventListener("click", select);

  const restart = document.getElementById("restart");
  restart.addEventListener("click", restartDemo);
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validate(event) {
  let email = document.getElementById("email").value;
  event.preventDefault();
  if (!validateEmail(email)) {
    document.getElementById("result").innerHTML = email + " is not a valid email";
  } else {
    // TODO -> store emails
  }
  return false;
}

function play(event) {
  document.getElementById("home").style.display = "none";
  document.getElementById("song-menu").style.display = "initial";
}

function select(event) {
  document.getElementById("song-menu").style.display = "none";
  document.getElementById("game").style.display = "initial";
  document.getElementById(event.target.innerHTML).play();
  songStart(parseInt(event.target.value));  // event.target.value has timeBetweenBeats
}

function restartDemo(event) {
  document.getElementById("results").style.display = "none";
  document.getElementById("home").style.display = "initial";
}

function songStart(timeBetweenBeats) {
  let i = 3;

  // In each beat, an image and a counter appears in the screen
  let interval = setInterval(function(){

    const touch = document.getElementById("touch");
    const counter = document.getElementById("counter");

    counter.innerHTML = i;
    i -= 1;

    if (i === -1) {
      let futureTime = new Date().getTime();
      clearInterval(interval);
      counter.innerHTML = "";
      document.getElementById("explain").style.display = "none";
      document.getElementById("keep").style.display = "initial";
      gameStart(timeBetweenBeats, futureTime);
    }
  }, timeBetweenBeats);
}

function gameStart(timeBetweenBeats, futureTime) {
  const touch = document.getElementById("touch");
  let numberOfClicks = 0;
  let scoresArray = [];
  let text = "";

  touch.addEventListener("click", function() {
    [numberOfClicks, futureTime, scoresArray, text] = rhythmClick(timeBetweenBeats, numberOfClicks, futureTime, scoresArray);

    // Displays level of success to the user for a short time
    setTimeout(function() {
      document.getElementById("level-of-success").innerHTML = text;
    }, 100);

    if (numberOfClicks == 3) {
      showResults(scoresArray);
      return;
    }

  }, false);
}

function rhythmClick(timeBetweenBeats, numberOfClicks, futureTime, scoresArray) {
  // Score is the difference in 'tenths' of seconds
  const score = Math.abs(futureTime - new Date().getTime());

  let text = "";
  let tempTime = timeBetweenBeats / 10;

  if (score < tempTime) {
    text = "Perfect";
  }
  else if (score >= tempTime && score < (tempTime * 2)) {
    text = "Great";
  }
  else if (score >= (tempTime * 2) && score < (tempTime * 3)) {
    text = "Good";
  }
  else if (score >= (tempTime * 3) && score < (tempTime * 4)) {
    text = "Okay"
  }
  else {
    text = "Bad";
  }

  numberOfClicks += 1;
  scoresArray.push(score);
  futureTime = new Date().getTime() + timeBetweenBeats;
  return [numberOfClicks, futureTime, scoresArray, text];
}

function showResults(scoresArray) {
  setTimeout(function() {
    document.getElementById("game").style.display = "none";
    document.getElementById("calculating-results").style.display = "initial";
  }, 1000);

  setTimeout(function() {
    document.getElementById("calculating-results").style.display = "none";
    const finalScore = Math.round((scoresArray[0] + scoresArray[1] + scoresArray[2]) / 3);
    document.getElementById("results").style.display = "initial";
    document.getElementById("score").innerHTML = finalScore;
  }, 2000);
}
