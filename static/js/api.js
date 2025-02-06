import { API_ENDPOINTS } from "./constants.js";
import { login, signup } from "./app.js";
import { render } from "./ui.js";
import { headerTemplate, loggedInTemplate } from "./templates.js";

export async function LoginApi(event) {
  if (event) event.preventDefault();

  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetchAPI(API_ENDPOINTS.login, {
      username,
      password,
    });
    if (response.success) {
      render(loggedInTemplate)
      setTimeout(Homepage, 2000)
    } else {
      alert(response.message)
    }
  } catch (error) {
    console.error("Login Failed", error);
  }
}

export async function SignupAPi(event) {
  if (event) event.preventDefault();

  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    alert("passwords do not match");
    return;
  }
  const userData = {
    firstName: document.getElementById("first-name").value,
    lastName: document.getElementById("second-name").value,
    username: document.getElementById("signup-username").value,
    email: document.getElementById("signup-email").value,
    gender: document.getElementById("gender").value,
    age: parseInt(document.getElementById("age").value, 10),
    password,
  };

  try {
    const response = await fetchAPI(API_ENDPOINTS.signup, userData);

    if (response.success) {
      login()
    } else {
      alert(response.message)
    }
  } catch (error) {
    console.error("signup failed:", error);
  }
}

async function fetchAPI(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const responseData = await response.json()

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP ERROR! status: ${response.status}`);
    }
    return responseData;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

function Homepage() {
  const authdiv = document.getElementById("authentication");
  if (authdiv) {
    authdiv.style.display = "none";
  }

  const header = document.querySelector("header.card");
  if (header) {
    const username = "Guest"; // Replace this with actual username logic
    header.innerHTML = headerTemplate(username); // Correct way to insert HTML
  }
}