import { API_ENDPOINTS } from "./constants.js";

export async function LoginApi(event) {
  if (event) event.preventDefault();

  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const data = await fetchAPI(API_ENDPOINTS.login, {
        username, 
        password
    })
  } catch (error) {
    console.error('Login Failed', error)
  }
}

export function SignupAPi() {}

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
    throw error
  }
}
