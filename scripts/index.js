"use strict";

window.onload = function() {
  const buttonPlay = document.getElementById("play");
  buttonPlay.addEventListener("click", play);

  const songSelect = document.getElementsByClassName("song-select");
  for (let i = 0; i < songSelect.length; i++) {
    songSelect[i].addEventListener("click", select);
  }

  const restart = document.getElementById("restart");
  restart.addEventListener("click", restartDemo);
}

function play(event) {
  document.getElementById("home").style.display = "none";
  document.getElementById("song-menu").style.display = "block";
}

function select(event) {
  document.getElementById("song-menu").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById(event.target.innerHTML.replace(/ /g,'')).play();
  document.getElementsByClassName("phone")[0].style.backgroundColor = "white";
  songStart(parseFloat(event.target.value), event.target.innerHTML.replace(/ /g,''));
}

function restartDemo(event) {
  document.getElementById("results").style.display = "none";
  document.getElementById("home").style.display = "block";
}

function songStart(timeBetweenBeats, song) {
  let i = 12;
  const touch = document.getElementById("touch");
  const counter = document.getElementById("counter");
  const duration = (timeBetweenBeats/1000).toString() + 's';

  let interval = setInterval(function(){
    touch.style.transitionDuration = "0s";
    touch.style.transform = "rotate(-45deg) scale(1)";
    if (i >= 1) {
      setTimeout(function() {
        touch.style.transform = "rotate(-45deg) scale(1.2)";
        touch.style.transitionDuration = duration;
      }, 100);

      if(i < 4) {
        counter.innerHTML = i;
      }
    }
    i -= 1;
    if (i === -1) {
      let futureTime = new Date().getTime();
      clearInterval(interval);
      counter.innerHTML = "";
      document.getElementById("explain").style.display = "none";
      document.getElementById("keep").style.display = "block";
      document.getElementById(song).pause();
      document.getElementById(song).currentTime = 0;
      gameStart(timeBetweenBeats, futureTime);
    }
  }, timeBetweenBeats);
}

function gameStart(timeBetweenBeats, futureTime) {
  const touch = document.getElementById("touch");
  const duration = (timeBetweenBeats/1000).toString() + 's';
  const maximumNumberOfClicks = 12;
  let averageScore = 0;
  let numberOfClicks = 0;
  let scoresArray = [];
  let text = "";
  let color = "";
  document.getElementById("counter").style.fontSize = "1em";

  touch.addEventListener("click", function handler() {
    [numberOfClicks, futureTime, scoresArray, text, color] = rhythmClick(timeBetweenBeats, numberOfClicks, futureTime, scoresArray);
    touch.style.transitionDuration = "0s";
    touch.style.transform = "rotate(-45deg) scale(1)";

    if (numberOfClicks != maximumNumberOfClicks) {
      setTimeout(function() {
        document.getElementById("counter").style.color = color;
        document.getElementById("counter").innerHTML = text;
        touch.style.transform = "rotate(-45deg) scale(1.2)";
        touch.style.transitionDuration = duration;
      }, 100);
    }

    else {
      document.getElementById("song-menu").style.backgroundColor = "black";
      document.getElementById("explain").style.display = "block";
      document.getElementById("keep").style.display = "none";
      this.removeEventListener('click', handler);
      for (let i = 0; i < maximumNumberOfClicks; i++) {
        averageScore += scoresArray[i];
      }
      averageScore = (averageScore / maximumNumberOfClicks) * (1000 / timeBetweenBeats);
      let finalScore = (timeBetweenBeats - averageScore);
      if (finalScore < 0) {
        finalScore = 0;
      }
      showResults(parseInt(finalScore));
      return;
    }

  }, false);
}

function rhythmClick(timeBetweenBeats, numberOfClicks, futureTime, scoresArray) {
  const score = Math.abs(futureTime - new Date().getTime());
  const tempTime = timeBetweenBeats / 20;
  const touch = document.getElementById("touch");
  const duration = (timeBetweenBeats/1000).toString() + 's';

  let text = "";
  let color = "";

  if (score < tempTime) {
    text = "Perfect";
    color = "#00FFA6";
  }
  else if (score >= tempTime && score < (tempTime * 2)) {
    text = "Great";
    color = "#00cc85";
  }
  else if (score >= (tempTime * 2) && score < (tempTime * 4)) {
    text = "Good";
    color = "#009963";
  }
  else if (score >= (tempTime * 4) && score < (tempTime * 6)) {
    text = "Okay"
    color = "#006642";
  }
  else {
    text = "Bad";
    color = "#003321";
  }

  numberOfClicks += 1;
  scoresArray.push(score);
  futureTime = new Date().getTime() + timeBetweenBeats;
  return [numberOfClicks, futureTime, scoresArray, text, color];
}

function showResults(finalScore) {
  document.getElementById("counter").innerHTML = "";
  document.getElementById("counter").style.fontSize = "2.5em";
  document.getElementById("counter").style.color = "white";
  document.getElementById("game").style.display = "none";
  document.getElementById("calculating-results").style.display = "block";

  setTimeout(function() {
    document.getElementById("calculating-results").style.display = "none";
    document.getElementById("results").style.display = "block";
    document.getElementById("score").innerHTML = finalScore;
    document.getElementsByClassName("phone")[0].style.backgroundColor = "black";
  }, 2000);
}
