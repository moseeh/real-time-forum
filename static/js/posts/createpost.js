import { Categories, Posts } from "../states.js";
import { createpost, allposts } from "../templates.js";

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
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Post created successfully:", result);
        console.log(result.post)
        Posts.unshift(result.post)
        mainSection.innerHTML = allposts(Posts);
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
    mainSection.innerHTML = allposts(Posts);
  });
}
