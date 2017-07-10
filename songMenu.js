"use strict";

window.onload = function() {
  const songs = document.getElementsByClassName("song");
  for (let i = 0; i < songs.length; i++) {
    songs[i].addEventListener("click", talkWithParent);
  }
}

function talkWithParent(event) {
  parent.postMessage({msg: "game", song: event.target.innerHTML}, '*');
}
