import { render } from "./ui.js";
import { signupTemplate, loginTemplate } from "./templates.js";
import { Homepage, LoginApi, logouterr, SignupAPi } from "./api.js";
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
  const password = document.getElementById("signup-password");
  const age = document.getElementById("age");
  const signupButton = document.getElementById("signup-form-button");

  let isUsernameValid = false;
  let isEmailValid = false;
  let isFirstNameValid = false;
  let isSecondNameValid = false;
  let isPasswordValid = false;
  let isOfAge = false;

  username.addEventListener("input", debounce(confirmName, 300));
  email.addEventListener("input", debounce(confirmEmail, 300));
  first.addEventListener("input", debounce(confirmfirst, 300));
  second.addEventListener("input", debounce(confirmsecond, 300));
  password.addEventListener("input", debounce(validatePassword, 300));
  age.addEventListener("input", debounce(validateAge, 300));

  function validatePassword() {
    console.log("Checking password");
    const passwordtxt = password.value.trim();
    const available = document.getElementById("passwordcheck");
    if (
      passwordtxt.length >= 8 &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        passwordtxt
      )
    ) {
      available.style.display = "none";
      isPasswordValid = true;
    } else {
      available.textContent =
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
      available.style.fontSize = "12px";
      available.style.display = "block";
      isPasswordValid = false;
    }
    checkAllValidations();
  }
  function validateAge() {
    const validAge = document.getElementById("agecheck");
    const ageValue = parseInt(age.value);
    if (!isNaN(ageValue) && ageValue >= 16 && ageValue <= 150) {
      validAge.style.display = "none";
      isOfAge = true;
    } else {
      validAge.textContent =
        "To access this website, you must be at least 16 years old";
      validAge.style.fontSize = "12px";
      validAge.style.display = "block";
      isOfAge = false;
    }
  }

  function confirmfirst() {
    const firstname = first.value.trim();
    const available = document.getElementById("firstcheck");
    if (validateUsername(firstname) === null) {
      available.style.display = "none";
      isFirstNameValid = true;
    } else {
      available.textContent = validateUsername(firstname);
      available.style.display = "block";
      isFirstNameValid = false;
    }
    checkAllValidations();
  }

  function confirmsecond() {
    const secondname = second.value.trim();
    const available = document.getElementById("secondcheck");
    if (validateUsername(secondname) === null) {
      available.style.display = "none";
      isSecondNameValid = true;
    } else {
      available.textContent = validateUsername(secondname);
      available.style.display = "block";
      isSecondNameValid = false;
    }
    checkAllValidations();
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
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data, user,1);

      const available = document.getElementById("nameavailable");

      if (validateUsername(user) === null) {
        available.textContent = "";
        available.style.display = "none";
        isUsernameValid = true;
      } else {
        available.textContent = validateUsername(user);
        available.style.display = "block";
        isUsernameValid = false;
      }

      if (data.success) {
        console.log(data.success);
        available.style.display = "none";
        isUsernameValid = true;
      } else {
        available.textContent = "Username already exists";
        available.style.display = "block";
        isUsernameValid = false;
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
      isUsernameValid = false;
    }
    checkAllValidations();
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
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const available = document.getElementById("emailavailable");

      if (validateEmail(mail)) {
        available.textContent = "";
        available.style.display = "none";
        isEmailValid = true;
      } else {
        available.textContent = "Enter a valid email";
        available.style.display = "block";
        isEmailValid = false;
      }

      if (data.success) {
        available.textContent = "";
        available.style.display = "none";
        isEmailValid = true;
      } else {
        available.textContent = "Email already exists!";
        available.style.display = "block";
        isEmailValid = false;
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
      isEmailValid = false;
    }
    checkAllValidations();
  }

  function checkAllValidations() {
    if (
      isUsernameValid &&
      isEmailValid &&
      isOfAge &&
      isFirstNameValid &&
      isSecondNameValid &&
      isPasswordValid
    ) {
      signupButton.disabled = false;
    } else {
      signupButton.disabled = true;
    }
  }

  if (signupButton) {
    signupButton.addEventListener("click", SignupAPi);
    signupButton.disabled = true; // Initially disable the button
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

document.addEventListener("DOMContentLoaded", async () => {
  const sign = document.getElementById("signup-button")
  if (sign) {
    sign.addEventListener("click", signup);
  }
  const loginButton = document.getElementById("login-button")
  if (loginButton) {
    loginButton.addEventListener("click", login);
  }
  const logoutButton = document.getElementById("logout-btn")
  if (logoutButton) {
    logoutButton.addEventListener("click", logouterr);
    return
  }
  const userData = getUserData();
  if (userData) {
    console.log(userData);
    Homepage();
  } else {
    login();
  }
});

function debounce(func, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
