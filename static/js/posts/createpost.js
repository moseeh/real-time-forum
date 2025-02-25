import { Categories, Posts } from "../states.js";
import { createpost, allposts } from "../templates.js";

export function displayCreate() {
  const mainSection = document.getElementById("main");
  mainSection.innerHTML = createpost(Categories);

  const form = document.getElementById("create-post-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Add input validation
    setupFormValidation();

    if (!validateForm()) {
      return; 
    }

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        credentials: "include",
      });
      if (response.status === 401) {
        localStorage.removeItem("userData");
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      if (response.ok) {
        const result = await response.json();
        console.log("Post created successfully:", result);
        console.log(result.post);
        Posts.unshift(result.post);
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

function setupFormValidation() {
  const form = document.getElementById("create-post-form");
  const titleInput = form.querySelector('input[name="title"]');
  const contentTextarea = form.querySelector('textarea[name="content"]');

  // Add error message containers
  const titleErrorDiv = document.createElement("div");
  titleErrorDiv.className = "error-message";
  titleInput.insertAdjacentElement("afterend", titleErrorDiv);

  const contentErrorDiv = document.createElement("div");
  contentErrorDiv.className = "error-message";
  contentTextarea.insertAdjacentElement("afterend", contentErrorDiv);

  const categoriesErrorDiv = document.createElement("div");
  categoriesErrorDiv.className = "error-message";
  document
    .querySelector(".categories-grid")
    .insertAdjacentElement("afterend", categoriesErrorDiv);

  // Add real-time validation
  titleInput.addEventListener("input", () => {
    validateInput(titleInput, titleErrorDiv, "Title is required");
  });

  contentTextarea.addEventListener("input", () => {
    validateInput(contentTextarea, contentErrorDiv, "Content is required");
    sanitizeContent(contentTextarea);
  });

  // Check checkboxes when any is clicked
  const checkboxes = form.querySelectorAll(".category-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      validateCheckboxes(checkboxes, categoriesErrorDiv);
    });
  });
}

function validateForm() {
  const form = document.getElementById("create-post-form");
  const titleInput = form.querySelector('input[name="title"]');
  const contentTextarea = form.querySelector('textarea[name="content"]');
  const checkboxes = form.querySelectorAll(".category-checkbox");
  const titleErrorDiv = form.querySelector(
    'input[name="title"] + .error-message'
  );
  const contentErrorDiv = form.querySelector(
    'textarea[name="content"] + .error-message'
  );
  const categoriesErrorDiv = document.querySelector(
    ".categories-grid + .error-message"
  );

  let isValid = true;

  // Validate title
  if (!validateInput(titleInput, titleErrorDiv, "Title is required")) {
    isValid = false;
  }

  // Validate content
  if (!validateInput(contentTextarea, contentErrorDiv, "Content is required")) {
    isValid = false;
  }

  // Sanitize content for script tags
  sanitizeContent(contentTextarea);

  // Validate at least one category is selected
  if (!validateCheckboxes(checkboxes, categoriesErrorDiv)) {
    isValid = false;
  }

  return isValid;
}

function validateInput(input, errorDiv, errorMessage) {
  if (!input.value.trim()) {
    errorDiv.textContent = errorMessage;
    errorDiv.style.display = "block";
    input.classList.add("invalid-input");
    return false;
  } else {
    errorDiv.textContent = "";
    errorDiv.style.display = "none";
    input.classList.remove("invalid-input");
    return true;
  }
}

function validateCheckboxes(checkboxes, errorDiv) {
  const isAnyChecked = Array.from(checkboxes).some(
    (checkbox) => checkbox.checked
  );

  if (!isAnyChecked) {
    errorDiv.textContent = "Please select at least one category";
    errorDiv.style.display = "block";
    return false;
  } else {
    errorDiv.textContent = "";
    errorDiv.style.display = "none";
    return true;
  }
}

function sanitizeContent(textarea) {
  // Escape script tags to prevent XSS
  let content = textarea.value;
  content = content
    .replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      "&lt;script&gt;...&lt;/script&gt;"
    )
    .replace(/<script/gi, "&lt;script")
    .replace(/<\/script>/gi, "&lt;/script&gt;");

  textarea.value = content;
}
