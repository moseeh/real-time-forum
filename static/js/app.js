import { render } from "./ui.js";
import {
  signupTemplate,
  loginTemplate,
  loggedInTemplate,
} from "./templates.js";
import { fetchCategories, Homepage, LoginApi, SignupAPi } from "./api.js";
import { validateEmail, validateUsername } from "./validators.js";
import { getUserData } from "./states.js";

export function signup() {
  render(signupTemplate); // Render the signup template
  document.querySelector(".button-1").style.cssText = "display: none";
  document.querySelector(".button-2").style.cssText = "display: block";
  const username = document.getElementById("signup-username");
  const email = document.getElementById("signup-email");
  const first = document.getElementById("first-name");
  const second = document.getElementById("second-name");
  let ok;

  username.addEventListener("input", debounce(confirmName, 300));
  email.addEventListener("input", debounce(confirmEmail, 300));
  first.addEventListener("input", debounce(confirmfirst, 300));
  second.addEventListener("input", debounce(confirmsecond, 300));

  function confirmfirst() {
    const firstname = first.value.trim();
    const available = document.getElementById("firstcheck");
    if (validateUsername(firstname) === null) {
      available.style.display = "none";
    } else {
      available.textContent = validateUsername(firstname);
      available.style.display = "block";
      return;
    }
  }

  function confirmsecond() {
    const secondname = second.value.trim();
    const available = document.getElementById("secondcheck");
    if (validateUsername(secondname) === null) {
      available.style.display = "none";
    } else {
      available.textContent = validateUsername(secondname);
      available.style.display = "block";
      return;
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
      console.log(data, user);

      const available = document.getElementById("nameavailable");
      // Handle the response

      if (validateUsername(user) === null) {
        available.textContent = "";
        available.style.display = "none";
      } else {
        available.textContent = validateUsername(user);
        available.style.display = "block";
        return;
      }

      if (data.success) {
        console.log(data.success);
        available.style.display = "none";
      } else {
        available.textContent = "Username already exists";
        available.style.display = "block";
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
        available.textContent = "";
        available.style.display = "none";
      } else {
        available.textContent = "Enter a valid email";
        available.style.display = "block";
        return;
      }
      // Handle the response
      if (data.success) {
        available.textContent = "";
        available.style.display = "none";
      } else {
        available.textContent = "Email already exists!";
        available.style.display = "block";
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

document.addEventListener("DOMContentLoaded", async() => {
  document.getElementById("signup-button").addEventListener("click", signup);
  document.getElementById("login-button").addEventListener("click", login);
  const userData = getUserData()
  if (userData) {
    console.log(userData)
    await fetchCategories()
    Homepage()
  } else {
    login();
  }
});

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
