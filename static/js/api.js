import { API_ENDPOINTS } from "./constants.js";
import { login, signup } from "./app.js";
import { render } from "./ui.js";
import {
  headerTemplate,
  loggedInTemplate,
  leftBar,
  allposts,
  rightBar,
  createpost,
} from "./templates.js";
import { getUserData } from "./states.js";
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
      localStorage.setItem("userData", JSON.stringify(response.data));
      render(loggedInTemplate);
      setTimeout(Homepage, 2000);
    } else {
      alert(response.message);
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
      login();
    } else {
      alert(response.message);
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
      credentials: "include",
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        responseData.message || `HTTP ERROR! status: ${response.status}`
      );
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
    authdiv.remove();
  }
  const UserData = getUserData();
  const header = document.querySelector("header.card");
  if (header) {
    const username = UserData.username;
    header.innerHTML = headerTemplate(username); 
  }

  const content = document.getElementById("body");
  let data = ["username", "password"];
  content.innerHTML += leftBar(data);
  content.innerHTML += allposts(data);
  content.innerHTML += rightBar(data);
  content.style.display = "grid";

  const create = document.getElementById("create-post-btn");
  if (create) {
    create.addEventListener("click", displayCreate);
  }
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn = document.addEventListener("click", logout)
  }
}

export function displayCreate() {
  console.log("displayCreate");
  const mainsection = document.getElementById("main");
  let data = ["username", "password"];
  mainsection.innerHTML = createpost(data);
}

async function logout() {
  try {
    const response = await fetch(API_ENDPOINTS.logout, {
      method: 'POST',
      credentials: 'include',
    });
    if (response.ok) {
      localStorage.removeItem('userData')
      localStorage.clear()
    } else {
      console.error('Logout failed')
    }
  } catch (error) {
    console.error('Logout error:', error)
  }
  login()
}