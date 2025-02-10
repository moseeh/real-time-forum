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
import { Categories, getUserData, Users } from "./states.js";
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

export async function Homepage() {
  const authdiv = document.getElementById("authentication");
  if (authdiv) {
    authdiv.remove();
  }
  await fetchUsers()
  await fetchCategories()
  const UserData = getUserData();
  const header = document.querySelector("header.card");
  if (header) {
    const username = UserData.username;
    header.innerHTML = headerTemplate(username);
  }

  const content = document.getElementById("body");
  let data = ["username", "password"];
  content.innerHTML += leftBar(Categories);
  content.innerHTML += allposts(data);
  content.innerHTML += rightBar(Users);
  content.style.display = "grid";

  const create = document.getElementById("create-post-btn");
  if (create) {
    create.addEventListener("click", displayCreate);
  }
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}

export function displayCreate() {
  console.log("displayCreate");
  const mainsection = document.getElementById("main");
  // let data = ["username", "password"];
  mainsection.innerHTML = createpost(Categories);

  // Get form values on submit
  document
    .getElementById("create-post-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent default form submission

      // Get basic form fields
      const title = document.querySelector('input[name="title"]').value;
      const content = document.querySelector('textarea[name="content"]').value;

      // Get selected categories
      const selectedCategories = Array.from(
        document.querySelectorAll('input[name="categories[]"]:checked')
      ).map((checkbox) => checkbox.value);

      // Get the uploaded image file
      const imageFile = document.querySelector('input[name="image"]').files[0];

      // Create FormData object for sending files
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      selectedCategories.forEach((categoryId) => {
        formData.append("categories[]", categoryId);
      });
      if (imageFile) {
        formData.append("image", imageFile);
      }

      try {
        const response = await fetch("/posts/create", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log("Post created successfully:", result);

        // Optional: Clear form after successful submission
        document.getElementById("create-post-form").reset();

        // Close modal if needed
        document.getElementById("closeModal").click();
      } catch (error) {
        console.error("Error creating post:", error);
        // Handle error appropriately
      }
    });
}

async function logout() {
  try {
    const response = await fetch(API_ENDPOINTS.logout, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      localStorage.removeItem("userData");
      localStorage.clear();
      login();
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
}

export async function fetchCategories() {
  try {
    const response = await fetch(API_ENDPOINTS.categories, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const responseData = await response.json();

      Categories.length = 0; // Clear the array
      Categories.push(...responseData.data);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching categories", error);
  }
}

export async function fetchUsers() {
  try {
    const response = await fetch(API_ENDPOINTS.allusers, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const responseData = await response.json();

      Users.length = 0; // Clear the array
      Users.push(...responseData.data);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching users", error);
  }
}