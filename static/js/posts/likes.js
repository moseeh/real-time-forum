export async function handleVoteClick(e) {
  const voteButton = e.target.closest(".upvote-btn, .downvote-btn");
  const postId = voteButton.dataset.postId;
  const isUpvote = voteButton.classList.contains("upvote-btn");
  const interactionType = isUpvote ? "like" : "dislike";

  try {
    const data = await submitVote(postId, interactionType);
    updateVoteButtons(voteButton, data);
    return true;
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to update vote. Please try again.");
    return false;
  }
}

// Submit vote to API
export async function submitVote(postId, interactionType) {
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
  if (response.status === 401) {
    localStorage.removeItem("userData");
    localStorage.clear();
    window.location.href = "/";
    return;
  }

  if (!response.ok) {
    throw new Error("Failed to update interaction");
  }

  return response.json();
}

// Update vote buttons in UI
export function updateVoteButtons(voteButton, data) {
  const article = voteButton.closest("article");
  const upvoteBtn = article.querySelector(".upvote-btn");
  const downvoteBtn = article.querySelector(".downvote-btn");

  updateButtonUI(upvoteBtn, data.likes_count, data.is_liked);
  updateButtonUI(downvoteBtn, data.dislikes_count, data.is_disliked);
}

// Update button UI helper
export function updateButtonUI(button, count, isActive) {
  const countSpan = button.querySelector("span");
  countSpan.textContent = count;
  button.classList.toggle("active", isActive);
}

export function updateInteractionToAllUsers(data) {
  const postId = data.post.content_id;
  const article = document.querySelector(`article[data-post-id="${postId}"]`);

  if (!article) {
    console.warn(`Article with ID ${postId} not found`);
    return;
  }

  // Get vote buttons
  const upvoteBtn = article.querySelector(".upvote-btn");
  const downvoteBtn = article.querySelector(".downvote-btn");

  // Update the UI using existing function
  const updateCountOnly = (button, count) => {
    const countSpan = button.querySelector("span");
    countSpan.textContent = count;
  };

  updateCountOnly(upvoteBtn, data.post.likes_count);
  updateCountOnly(downvoteBtn, data.post.dislikes_count);
}
