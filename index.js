"use strict";

document.addEventListener("DOMContentLoaded", function() {
  window.addEventListener('message', messagesHandler);

  function messagesHandler(ev) {
    let newEvent = new Event('messageRecieved');
    newEvent.data = ev.data;
    window.dispatchEvent(newEvent);
  }
});

window.onload = function() {
  let currentIframe = null;

  let main = document.getElementsByTagName("body")[0];
  let iframeHome = document.createElement("iframe");
  iframeHome.style.width = "500px";
  iframeHome.style.height = "500px";

  let iframeMenu = document.createElement("iframe");
  iframeMenu.style.width = "500px";
  iframeMenu.style.height = "500px";

  let iframeGame = document.createElement("iframe");
  iframeGame.style.width = "500px";
  iframeGame.style.height = "500px";

  iframeHome.src = "home.html";
  iframeMenu.src = "songMenu.html";
  iframeGame.src = "game.html";

  mountIframe(iframeHome);

  const submit_email = document.getElementById("submit-email");
  submit_email.addEventListener("click", validate);

  window.addEventListener("messageRecieved", messageRecievedHandler);

  function messageRecievedHandler(ev) {
    let iframeDoc = null;

    switch (ev.data.msg) {
      case "menu":
        iframeMenu.name = "menu";
        mountIframe(iframeMenu);
        break;
      case "game":
        iframeGame.name = "game";
        mountIframe(iframeGame);
        talkWithChild(event, iframeGame, ev.data.song);
        break;
    }
  }

  function mountIframe(iframe) {
    if (currentIframe !== iframe) {
      if (currentIframe === null) {
        mount(main, iframe);
      } else {
        unmount(main, currentIframe);
        mount(main, iframe);
      }
      currentIframe = iframe;
    }
  }
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
    talkWithParent("menu");
  }
  return false;
}

function mount(root, element) {
  root.appendChild(element);
}

function unmount(root, element) {
  root.removeChild(element);
}

function talkWithChild(event, window_to, song) {
  console.log("Talking with Child");
  window_to.contentWindow.postMessage(song, '*');
}
