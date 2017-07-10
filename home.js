"use strict"

window.onload = function() {
  const button_play = document.getElementById("play");
  button_play.addEventListener("click", play);
}

function play(event) {
  talkWithParent("menu");
}

function talkWithParent(msg_given) {
  parent.postMessage({msg: msg_given}, '*');
}
