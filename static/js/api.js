import { API_ENDPOINTS } from "./constants.js";

export async function LoginApi(event) {
  console.log(1);
  if (event) event.preventDefault();

  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const data = await fetchAPI(API_ENDPOINTS.login, {
      username,
      password,
    });
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
    const data = await fetchAPI(API_ENDPOINTS.signup, userData);
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
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP ERROR! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}
