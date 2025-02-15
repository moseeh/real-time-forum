import { allposts, createpost } from "./templates.js";
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
  try {
    const response = await fetch("/api/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // to include cookies for auth
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export async function displayPosts() {
  try {
    let posts = await fetchPosts();
    const content = document.getElementById("body");
    content.innerHTML += allposts(posts);

    // Wait for a moment to ensure DOM is updated
    setTimeout(() => {
      const mainContent = document.getElementById("main");
      if (!mainContent) {
        console.error("Could not find main element");
        return;
      }
      const modal = document.getElementById("commentModal");
      const commentText = document.getElementById("commentText");
      const cancelComment = document.getElementById("cancelComment");
      const submitComment = document.getElementById("submitComment");
      let currentPostId = null;

      const updateButtonUI = (button, count, isActive) => {
        const countSpan = button.querySelector("span");
        countSpan.textContent = count;
        button.classList.toggle("active", isActive);
      };
      // Setup cancel comment button listener once
      cancelComment.addEventListener("click", () => {
        modal.style.display = "none";
        currentPostId = null;
      });

      // Setup submit comment button listener once
      submitComment.addEventListener("click", async () => {
        if (commentText.value.trim() && currentPostId) {
          try {
            const response = await fetch("/api/comments", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                content_id: currentPostId,
                comment: commentText.value.trim(),
              }),
            });
            if (!response.ok) {
              throw new Error("Failed to submit comment");
            }
            const data = await response.json();
            const commentBtn = document.querySelector(
              `.comment-btn[data-post-id="${currentPostId}"]`
            );
            if (!commentBtn) {
              console.error(
                `Could not find comment button with data-post-id="${currentPostId}"`
              );
              return;
            }
            const commentSpan = commentBtn.querySelector("span");
            if (!commentSpan) {
              console.error("Could not find comment count span");
              return;
            }
            commentSpan.textContent = data.comments_count;
            modal.style.display = "none";
            currentPostId = null;
            commentText.value = "";
          } catch (error) {
            console.error("Error:", error);
            alert(error);
          }
        }
      });

      mainContent.addEventListener("click", async (e) => {
        const voteButton = e.target.matches(".upvote-btn, .downvote-btn")
          ? e.target
          : e.target.closest(".upvote-btn, .downvote-btn");
        // handle user interactions
        if (voteButton) {
          const postId = voteButton.dataset.postId;
          const isUpvote = voteButton.classList.contains("upvote-btn");
          const interactionType = isUpvote ? "like" : "dislike";

          try {
            const response = await fetch("/api/interactions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                content_id: postId,
                interaction_type: interactionType,
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to update interaction");
            }

            const data = await response.json();
            const article = voteButton.closest("article");
            const upvoteBtn = article.querySelector(".upvote-btn");
            const downvoteBtn = article.querySelector(".downvote-btn");
            updateButtonUI(upvoteBtn, data.likes_count, data.is_liked);
            updateButtonUI(downvoteBtn, data.dislikes_count, data.is_disliked);
          } catch (error) {
            console.error("Error:", error);
            alert("Failed to update vote. Please try again.");
          }
          return;
        }
        // Handle comment button
        const commentButton = e.target.matches(".comment-btn")
          ? e.target
          : e.target.closest(".comment-btn");

        if (commentButton) {
          const postId = commentButton.dataset.postId;
          currentPostId = postId;
          modal.style.display = "flex";
          commentText.value = "";
          commentText.focus();
        }
      });
    });
  } catch (error) {
    console.error("Error displaying posts:", error);
    const content = document.getElementById("body");
    content.innerHTML += `<div class="error">Error loading posts: ${error.message}</div>`;
  }
}
