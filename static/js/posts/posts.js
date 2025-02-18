import { allposts, singlepost } from "../templates.js";
import { fetchPosts } from "../posts.js";

import { allposts, singlepost } from "../templates.js";

// Main function to display posts
export async function displayPosts() {
  try {
    const posts = await fetchPosts();
    renderInitialPosts(posts);
    setupEventListeners();
  } catch (error) {
    handleError(error, "Error displaying posts:");
  }
}

// Render initial posts to the page
function renderInitialPosts(posts) {
  const content = document.getElementById("body");
  content.innerHTML += allposts(posts);
}

// Setup all event listeners
function setupEventListeners() {
  setTimeout(() => {
    const mainContent = document.getElementById("main");
    if (!mainContent) {
      console.error("Could not find main element");
      return;
    }

    const { modal, commentText, currentPostId } = setupCommentModal();
    setupMainContentListeners(mainContent, modal, commentText, currentPostId);
  });
}

// Setup comment modal and its listeners
function setupCommentModal() {
  const modal = document.getElementById("commentModal");
  const commentText = document.getElementById("commentText");
  const cancelComment = document.getElementById("cancelComment");
  const submitComment = document.getElementById("submitComment");
  let currentPostId = null;

  cancelComment.addEventListener("click", () => {
    closeCommentModal(modal, currentPostId, commentText);
  });

  submitComment.addEventListener("click", async () => {
    await handleCommentSubmission(modal, commentText, currentPostId);
  });

  return { modal, commentText, currentPostId };
}

// Close comment modal and reset values
function closeCommentModal(modal, currentPostId, commentText) {
  modal.style.display = "none";
  currentPostId = null;
  if (commentText) commentText.value = "";
}

// Handle comment submission
async function handleCommentSubmission(modal, commentText, currentPostId) {
  if (!commentText.value.trim() || !currentPostId) return;

  try {
    const data = await submitComment(currentPostId, commentText.value.trim());
    updateCommentCount(currentPostId, data.comments_count);
    closeCommentModal(modal, currentPostId, commentText);
  } catch (error) {
    console.error("Error:", error);
    alert(error);
  }
}

// Submit comment to API
async function submitComment(postId, comment) {
  const response = await fetch("/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      content_id: postId,
      comment: comment,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit comment");
  }

  return response.json();
}

// Update comment count in UI
function updateCommentCount(postId, count) {
  const commentBtn = document.querySelector(
    `.comment-btn[data-post-id="${postId}"]`
  );
  if (!commentBtn) {
    console.error(`Could not find comment button with data-post-id="${postId}"`);
    return;
  }

  const commentSpan = commentBtn.querySelector("span");
  if (!commentSpan) {
    console.error("Could not find comment count span");
    return;
  }

  commentSpan.textContent = count;
}

// Setup main content event listeners
function setupMainContentListeners(mainContent, modal, commentText, currentPostId) {
  mainContent.addEventListener("click", async (e) => {
    if (handlePostClick(e, mainContent)) return;
    if (await handleVoteClick(e)) return;
    handleCommentClick(e, modal, commentText, currentPostId);
  });
}

// Handle post click event
async function handlePostClick(e, mainContent) {
  const postArticle = e.target.closest(".post");
  if (!postArticle || e.target.closest(".buttons")) return false;

  const postId = postArticle.getAttribute("data-post-id");
  if (!postId) return false;

  try {
    const postDetails = await fetchPostDetails(postId);
    mainContent.innerHTML = singlepost(postDetails.post);
    return true;
  } catch (error) {
    console.error("Error fetching post details:", error);
    return false;
  }
}

// Fetch post details from API
async function fetchPostDetails(postId) {
  const response = await fetch(`/api/post/details?postID=${postId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Handle vote click event
async function handleVoteClick(e) {
  const voteButton = e.target.matches(".upvote-btn, .downvote-btn")
    ? e.target
    : e.target.closest(".upvote-btn, .downvote-btn");

  if (!voteButton) return false;

  const postId = voteButton.dataset.postId;
  const isUpvote = voteButton.classList.contains("upvote-btn");
  const interactionType = isUpvote ? "like" : "dislike";

  try {
    const data = await submitVote(postId, interactionType);
    updateVoteButtons(voteButton, data);
    return true;
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to update vote. Please try again.", error);
    return false;
  }
}

// Submit vote to API
async function submitVote(postId, interactionType) {
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

  return response.json();
}

// Update vote buttons in UI
function updateVoteButtons(voteButton, data) {
  const article = voteButton.closest("article");
  const upvoteBtn = article.querySelector(".upvote-btn");
  const downvoteBtn = article.querySelector(".downvote-btn");
  
  updateButtonUI(upvoteBtn, data.likes_count, data.is_liked);
  updateButtonUI(downvoteBtn, data.dislikes_count, data.is_disliked);
}

// Update button UI helper
function updateButtonUI(button, count, isActive) {
  const countSpan = button.querySelector("span");
  countSpan.textContent = count;
  button.classList.toggle("active", isActive);
}

// Handle comment click event
function handleCommentClick(e, modal, commentText, currentPostId) {
  const commentButton = e.target.matches(".comment-btn")
    ? e.target
    : e.target.closest(".comment-btn");

  if (!commentButton) return;

  currentPostId = commentButton.dataset.postId;
  modal.style.display = "flex";
  commentText.value = "";
  commentText.focus();
}

// Handle errors
function handleError(error, message) {
  console.error(message, error);
  const content = document.getElementById("body");
  content.innerHTML += `<div class="error">Error loading posts: ${error.message}</div>`;
}