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
  const username = document.getElementById("signup-username");
  const email = document.getElementById("signup-email");
  const first = document.getElementById("first-name");
  const second = document.getElementById("second-name");
  let ok = false;

  username.addEventListener("input", debounce(confirmName, 300));
  email.addEventListener("input", debounce(confirmEmail, 300));
  first.addEventListener("input", debounce(confirmfirst, 300));
  second.addEventListener("input", debounce(confirmpatern(second.value), 300));

  function confirmfirst() {
    const firstname = first.value.trim();
    const available = document.getElementById("firstcheck");
    if (validateUsername(firstname) === null){
      available.style.display = "none";
      ok = true;
    } else {
      available.textContent = "Enter a valid name"
      available.style.display = "block";
      ok = false
      return
    }
  }

  function confirmsecond() {
    const secondname = second.value.trim();
    const available = document.getElementById("secondcheck");
    if (validateUsername(secondname) === null){
      available.style.display = "none";
      ok = true;
    } else {
      available.textContent = "Enter a valid name"
      available.style.display = "block";
      ok = false
      return
    }
  }


  async function confirmName() {
    const user = username.value.trim().toLowerCase();

    try {
      const response = await fetch("/check-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      const available = document.getElementById("nameavailable");
      // Handle the response

      if (validateUsername(user) === null){
        available.style.display = "none";
        ok = true;
      } else {
        available.textContent = "Enter a valid name"
        available.style.display = "block";
        ok = false
        return
      }
      if (data.success) {
        available.style.display = "none";
        ok = true;
      } else {
        available.textContent = "Username already exists";
        available.style.display = "block";
        ok = false
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  }

  async function confirmEmail() {
    const mail = email.value.trim();

    try {
      const response = await fetch("/check-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: mail }),
      });

      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Decode the JSON response
      const data = await response.json();
      const available = document.getElementById("emailavailable");

      if (validateEmail(mail)) {
        available.textContent = ""
        available.style.display = "none";
        ok = true;
      } else {
        available.textContent = "Enter a valid email"
        available.style.display = "block"
        ok = false
        return
      }
      // Handle the response
      if (data.success) {
        available.textContent = ""
        available.style.display = "none";
        ok = true;
      } else {
         available.textContent = "Email already exists!"
        available.style.display = "block";
        ok = false
      }

    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  }

  const signupButton = document.getElementById("signup-form-button");
  if (signupButton && ok) {
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

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validateUsername(username) {
  // Ensure it starts with a letter
  if (!/^[a-zA-Z]/.test(username)) {
      return "username must start with a letter";
  }

  // Allow only letters, numbers, and underscores
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "username can only contain letters, numbers, and underscores";
  }

  // Avoid consecutive underscores
  if (/__+/.test(username)) {
      return "username cannot have consecutive underscores";
  }

  // Reserved usernames
  const reserved = new Set(["admin", "root", "system", "test", "null", "localhost", "void", "guest"]);
  if (reserved.has(username)) {
      return "username is reserved";
  }

  // If all checks pass, return null (no error)
  return null;
}