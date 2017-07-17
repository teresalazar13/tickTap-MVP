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
      //touch.style.visibility = "hidden";
      setTimeout(function() {
        //touch.style.visibility = "visible";
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
  let numberOfClicks = 0;
  let scoresArray = [];
  let text = "";
  const duration = (timeBetweenBeats/1000).toString() + 's';

  touch.addEventListener("click", function handler() {
    [numberOfClicks, futureTime, scoresArray, text] = rhythmClick(timeBetweenBeats, numberOfClicks, futureTime, scoresArray);
    touch.style.transitionDuration = "0s";
    touch.style.transform = "rotate(-45deg) scale(1)";

    if (numberOfClicks != 12) {
      setTimeout(function() {
        document.getElementById("level-of-success").innerHTML = text;
        touch.style.transform = "rotate(-45deg) scale(1.2)";
        touch.style.transitionDuration = duration;

      }, 100);
    }

    else {
      document.getElementById("song-menu").style.backgroundColor = "black";
      document.getElementById("explain").style.display = "block";
      document.getElementById("keep").style.display = "none";
      this.removeEventListener('click', handler);
      const averageScore = Math.round((scoresArray[0] + scoresArray[1] + scoresArray[2]) / 3) * (1000 / timeBetweenBeats);
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

  if (score < tempTime) {
    text = "Perfect";
  }
  else if (score >= tempTime && score < (tempTime * 2)) {
    text = "Great";
  }
  else if (score >= (tempTime * 2) && score < (tempTime * 4)) {
    text = "Good";
  }
  else if (score >= (tempTime * 4) && score < (tempTime * 6)) {
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

function showResults(finalScore) {
  document.getElementById("level-of-success").innerHTML = "";
  document.getElementById("game").style.display = "none";
  document.getElementById("calculating-results").style.display = "block";

  setTimeout(function() {
    document.getElementById("calculating-results").style.display = "none";
    document.getElementById("results").style.display = "block";
    document.getElementById("score").innerHTML = finalScore;
    document.getElementsByClassName("phone")[0].style.backgroundColor = "black";
  }, 2000);
}
