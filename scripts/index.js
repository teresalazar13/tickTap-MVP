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
  document.getElementById("song-menu").style.display = "flex";
}

function select(event) {
  document.getElementById("song-menu").style.display = "none";
  document.getElementById("game").style.display = "flex";
  document.getElementById(event.target.innerHTML.replace(/ /g,'')).play();
  document.getElementsByClassName("phone")[0].style.backgroundColor = "white";
  songStart(parseFloat(event.target.value), event.target.innerHTML.replace(/ /g,''));
}

function restartDemo(event) {
  document.getElementById("results").style.display = "none";
  document.getElementById("home").style.display = "flex";
}

function songStart(timeBetweenBeats, song) {
  let i = 12;
  const touch = document.getElementById("touch");
  const counter = document.getElementById("counter");
  const duration = (timeBetweenBeats/1000).toString() + 's';

  let interval = setInterval(function(){
    touch.style.transitionDuration = "0s";
    touch.style.transform = "rotate(-45deg) scale(1.4)";
    touch.style.boxShadow = "0 0 40px -4px rgba(0,0,0,0.3);";
    touch.style.backgroundColor = "#00FFA6";
    if (i >= 1) {
      setTimeout(function() {
        touch.style.transform = "rotate(-45deg) scale(1)";
        touch.style.backgroundColor = "black";
        touch.style.boxShadow = "0 0 20px 0px rgba(0,0,0,0.3);";
        touch.style.transitionDuration = duration;
        touch.style.transitionTimingFunction = "ease";
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
      document.getElementById("keep").style.display = "flex";
      document.getElementById(song).pause();
      document.getElementById(song).currentTime = 0;
      gameStart(timeBetweenBeats, futureTime);
    }
  }, timeBetweenBeats);
}

function gameStart(timeBetweenBeats, futureTime) {
  const touch = document.getElementById("touch");
  const screen = document.getElementById("game");
  const duration = (timeBetweenBeats/1000).toString() + 's';
  const maximumNumberOfClicks = 12;
  let averageScore = 0;
  let numberOfClicks = 0;
  // Number of Bads, Goods, Okays, Greats, Perfects
  let scoresArray = [0, 0, 0, 0, 0];
  let text = "";
  let color = "";
  document.getElementById("counter").style.fontSize = "1em";

  screen.addEventListener("click", function handler() {
    [numberOfClicks, futureTime, scoresArray, text, color] = rhythmClick(timeBetweenBeats, numberOfClicks, futureTime, scoresArray);
    touch.style.transitionDuration = "0s";
    touch.style.transform = "rotate(-45deg) scale(1.4)";
    touch.style.boxShadow = "0 0 40px -4px rgba(0,0,0,0.3);";
    touch.style.backgroundColor = "#00FFA6";

    if (numberOfClicks != maximumNumberOfClicks) {
      setTimeout(function() {
        document.getElementById("counter").style.color = color;
        document.getElementById("counter").innerHTML = text;
        touch.style.transform = "rotate(-45deg) scale(1)";
        touch.style.backgroundColor = "black";
        touch.style.boxShadow = "0 0 20px 0px rgba(0,0,0,0.3);";
        touch.style.transitionDuration = duration;
        touch.style.transitionTimingFunction = "ease";
      }, 100);
    }

    else {
      document.getElementById("song-menu").style.backgroundColor = "black";
      document.getElementById("explain").style.display = "block";
      document.getElementById("keep").style.display = "none";
      this.removeEventListener('click', handler);
      let finalScore = 0;
      for (let i = 1; i < scoresArray.length; i++) {
        finalScore += scoresArray[i] * i;
      }
      finalScore = (100 * finalScore) / 48;
      showResults(scoresArray, parseInt(finalScore));
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
  let index = 0;

  if (score < tempTime) {
    text = "Perfect";
    color = "#00FFA6";
    index = 4;
  }
  else if (score >= tempTime && score < (tempTime * 2)) {
    text = "Great";
    color = "#fff";
    index = 3;
  }
  else if (score >= (tempTime * 2) && score < (tempTime * 4)) {
    text = "Good";
    color = "#aaa";
    index = 2;
  }
  else if (score >= (tempTime * 4) && score < (tempTime * 6)) {
    text = "Okay"
    color = "#999";
    index = 1;
  }
  else {
    text = "Bad";
    color = "#333";
  }

  numberOfClicks += 1;
  scoresArray[index] = scoresArray[index] + 1;
  futureTime = new Date().getTime() + timeBetweenBeats;
  return [numberOfClicks, futureTime, scoresArray, text, color];
}

function showResults(scoresArray, finalScore) {
  document.getElementById("counter").innerHTML = "";
  document.getElementById("counter").style.fontSize = "2.5em";
  document.getElementById("counter").style.color = "white";
  document.getElementById("game").style.display = "none";
  document.getElementById("calculating-results").style.display = "flex";

  setTimeout(function() {
    document.getElementById("calculating-results").style.display = "none";
    document.getElementById("results").style.display = "flex";
    document.getElementById("score").innerHTML = finalScore + "%";
    document.getElementById("detailed-results").innerHTML = "Number of Perfects " + scoresArray[4] + "<br>Number of Greats " +
    scoresArray[3] + "<br>Number of Goods " + scoresArray[2] + "<br>Number of Okays " + scoresArray[1] + "<br>Number of Bads " + scoresArray[0];
    document.getElementsByClassName("phone")[0].style.backgroundColor = "black";
  }, 2000);
}
