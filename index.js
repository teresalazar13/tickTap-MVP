"use strict"

window.onload = function() {
  const button = document.getElementById("validate");
  button.addEventListener("click", validate);
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
    window.location.href = "songMenu.html";
  }
  return false;
}
