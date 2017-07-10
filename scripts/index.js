"use strict";

const timeBetweenBeats = 1000;

window.onload = function() {
  const button_play = document.getElementById("play");
  button_play.addEventListener("click", play);

  const submit_email = document.getElementById("submit-email");
  submit_email.addEventListener("click", validate);

  const song_select = document.getElementById("song-select");
  song_select.addEventListener("click", select);
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
    // TODO
  }
  return false;
}

function play() {
  document.getElementById("home").style.display = "none";
  document.getElementById("song-menu").style.display = "initial";
}

function select() {
  document.getElementById("song-menu").style.display = "none";
  document.getElementById("game").style.display = "initial";
  songStart();
}

function songStart() {
  let i = 3;

  // In each beat, an image and a counter appears in the screen
  let interval = setInterval(function(){
    const touch = document.getElementById("touch");
    const counter = document.getElementById("counter");

    displayImageAndCounter(touch, counter, i);
    i -= 1;
    if (i < 0) {
      counter.innerHTML = "";
      clearInterval(interval);
      let futureTime = new Date().getTime() + timeBetweenBeats;
      gameStart(futureTime);
    }

  }, timeBetweenBeats);
}

function displayImageAndCounter(touch, counter, i) {
  counter.innerHTML = i;
  /*
  setTimeout(function() {
    image.style.display = "none";
  }, 100);*/
}

function gameStart(futureTime) {
  const touch = document.getElementById("touch");
  let numberOfClicks = 0;
  let scoresArray = [];

  touch.addEventListener("click", function() {
    numberOfClicks = rhythmClick(futureTime, numberOfClicks, scoresArray);
  }, false);
}

function rhythmClick(futureTime, numberOfClicks, scoresArray) {
  numberOfClicks += 1;

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

  // Stores the time that the next rhythm should have
  futureTime = new Date().getTime() + timeBetweenBeats;
  scoresArray.push(score);

  // Displays level of success to the user for a short time
  setTimeout(function() {
    document.getElementById("level-of-success").innerHTML = text;
  }, 100);

  if (numberOfClicks == 3) {
    const final_score = Math.round((scoresArray[0] + scoresArray[1] + scoresArray[2]) / 3);
    document.getElementById("game").style.display = "none";
    document.getElementById("results").style.display = "initial";
    document.getElementById("score").innerHTML = final_score;
    return;
  }

  return numberOfClicks;
}
