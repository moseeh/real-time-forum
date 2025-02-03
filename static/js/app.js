import { render, hideBox1, showBox1 } from "./ui.js";
import {
  signupTemplate,
  loginTemplate,
  loggedInTemplate,
} from "./templates.js";
import { LoginApi, SignupAPi } from "./api.js";

export function signup() {
  render(signupTemplate); // Render the signup template
  document.querySelector(".button-1").style.cssText = "display: none";
  document.querySelector(".button-2").style.cssText = "display: block";
}

// Function to show the login form and hide the signup form
export function login() {
  render(loginTemplate); // Render the login template
  document.querySelector(".button-2").style.cssText = "display: none";
  document.querySelector(".button-1").style.cssText = "display: block";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signup-button").addEventListener("click", signup);
  document.getElementById("login-button").addEventListener("click", login);
  login();

  const loginButton = document.querySelector(".login-button");
  const signupButton = document.querySelector(".signup-button");

  if (loginButton) {
    loginButton.addEventListener('click', LoginApi)
  }
  if (signupButton) {
    signupButton.addEventListener('click', SignupAPi)
  }
});
