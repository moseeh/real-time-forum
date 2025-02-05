import { render } from "./ui.js";
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
  const  username = document.getElementById("signup-username")
  const  email = document.getElementById("signup-email")

  username.addEventListener("input", debounce(confirmName, 300));
  // email.addEventListener("input", debounce(confirmEmail, 300));

  async function confirmName() {
    const user = username.value
    console.log(user)
    try {
      const response = await fetch('/check-username', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: user }),
      });

      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Decode the JSON response
      const data = await response.json();
      console.log(data);
      // Handle the response
      if (data.success) {
          console.log("Username is available!");
      } else {
          console.log("Error:", data.message);
      }
  } catch (error) {
      console.error("Failed to fetch:", error);
  }
  }

  const signupButton = document.getElementById("signup-form-button");
  if (signupButton) {
    signupButton.addEventListener("click", SignupAPi);
  }
}

// Function to show the login form and hide the signup form
export function login() {
  render(loginTemplate); // Render the login template
  document.querySelector(".button-2").style.cssText = "display: none";
  document.querySelector(".button-1").style.cssText = "display: block";

  const loginButton = document.getElementById("login-form-button");

  if (loginButton) {
    loginButton.addEventListener("click", LoginApi);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signup-button").addEventListener("click", signup);
  document.getElementById("login-button").addEventListener("click", login);
  login();
});

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}