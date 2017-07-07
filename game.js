"use strict"

const timeBetweenBeats = 1000;

window.onload = function() {
  songStart();
}

function songStart() {
  let i = 3;

  // In each beat, an image and a counter appears in the screen
  let interval = setInterval(function(){
    const image = document.getElementById("circle");
    const counter = document.getElementById("counter");

    displayImageAndCounter(image, counter, i);
    i -= 1;

    if (i == 0) {
      counter.innerHTML = "";
      clearInterval(interval);
      let futureTime = new Date().getTime() + timeBetweenBeats;
      gameStart(futureTime);
    }

  }, timeBetweenBeats);
}

function displayImageAndCounter(image, counter, i) {
  image.style.display = "initial";
  counter.innerHTML = i;
  setTimeout(function() {
    image.style.display = "none";
  }, 100);
}

function gameStart(futureTime) {
  const button = document.getElementById("button");
  let numberOfClicks = 0;
  let scoresArray = [];

  button.addEventListener("click", function() {
    numberOfClicks = rhythmClick(futureTime, numberOfClicks, scoresArray);
  }, false);
}

function rhythmClick(futureTime, numberOfClicks, scoresArray) {

  if (numberOfClicks >= 3) {
    document.getElementById("button").display = "none";
    document.getElementById("array-of-scores").innerHTML = scoresArray;
    document.getElementById("button").removeEventListener("click", rhythmClick);
    return;
  }

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
  numberOfClicks += 1;
  scoresArray.push(score);

  // Displays level of success to the user for a short time
  setTimeout(function() {
    document.getElementById("level-of-success").innerHTML = text;
  }, 100);

  return numberOfClicks;
}
