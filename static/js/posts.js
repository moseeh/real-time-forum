import { createpost } from "./templates.js";
import { Categories } from "./states.js";

export function displayCreate() {
  const mainSection = document.getElementById("main");
  mainSection.innerHTML = createpost(Categories);

  const form = document.getElementById("create-post-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
      });

      if (response.ok) {
        const result = await response.text();
        console.log("Post created successfully:", result);
        mainSection.innerHTML = "";
      } else {
        const errorText = await response.text();
        console.error("Error creating post:", errorText);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  });
const closeModalBtn = document.getElementById("closeModal");
  closeModalBtn.addEventListener("click", () => {
    mainSection.innerHTML = "";
  });
}

export async function fetchPosts() {
  console.log(1)
  try {
      const response = await fetch("/api/posts", {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          },
          credentials: "include" // to include cookies for auth
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)
      return data;
  } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
  }
}
