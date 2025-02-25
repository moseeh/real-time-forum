import { allposts, singlepost, nullpost } from "../templates.js";
import { fetchPosts, fetchPostDetails } from "./fetchposts.js";
import { handleVoteClick } from "./likes.js";
import { handleCommentClick, handleCommentSubmission, closeCommentModal } from "./comments.js";
import { setupSidebarEventListener } from "./filter.js";
import { Posts, newPostsAvailable, setNewPostsAvailable } from "../states.js";
// Main function to display posts

let currentPostId = null;

export async function displayPosts() {
  try {
    const posts = await fetchPosts();
    Posts.length = 0;
    Posts.push(...posts);

    renderInitialPosts(Posts);
    setupEventListeners(Posts);
  } catch (error) {
    handleError(error, "Error displaying posts:");
  }
}

// Render initial posts to the page
function renderInitialPosts(posts) {
  const mainContent = document.getElementById("main");
  mainContent.innerHTML = allposts(posts);
}

// Setup all event listeners
function setupEventListeners(posts) {
  setTimeout(() => {
    const mainContent = document.getElementById("main");
    const leftSidebar = document.querySelector(".sidebar-left");
    if (!mainContent || !leftSidebar) {
      console.error("Could not find main element");
      return;
    }
    setupMainContentListeners(mainContent);
    setupSidebarEventListener(leftSidebar, posts, mainContent);
  });
}

function setupMainContentListeners(mainContent) {
  mainContent.addEventListener("click", async (e) => {
    console.log("clicked");
    // Stop handling if the click was on a link
    if (e.target.closest("a")) return;

    // Check for specific button clicks first
    const voteButton = e.target.closest(".upvote-btn, .downvote-btn");
    const commentButton = e.target.closest(".comment-btn");
    const postElement = e.target.closest(".post");

    // Handle vote buttons
    if (voteButton) {
      await handleVoteClick(e);
      return;
    }

    // Handle comment button
    if (commentButton) {
      const modal = document.getElementById("commentModal");
      const commentText = document.getElementById("commentText");
      const cancelComment = document.getElementById("cancelComment");
      const submitComment = document.getElementById("submitComment");

      const commentButton = e.target.closest(".comment-btn");
      currentPostId = commentButton.dataset.postId;

      cancelComment.addEventListener("click", () => {
        closeCommentModal(modal, currentPostId, commentText);
      });

      submitComment.addEventListener("click", async () => {
        await handleCommentSubmission(modal, commentText, currentPostId);
      });

      console.log(modal);
      handleCommentClick(modal, commentText);
      return;
    }

    // Handle post click (only if not clicking buttons)
    if (postElement && !e.target.closest(".buttons")) {
      await handlePostClick(e, mainContent);
      return;
    }
  });

  document
    .getElementById("new-posts-notification")
    .addEventListener("click", () => {
      if (newPostsAvailable) {
        document.getElementById("new-posts-notification").style.display =
          "none";
        setNewPostsAvailable(false);
        mainContent.innerHTML = allposts(Posts);
      }
    });
}
async function handlePostClick(e, mainContent) {
  const postArticle = e.target.closest(".post");
  const postId = postArticle.getAttribute("data-post-id");

  try {
    const postDetails = await fetchPostDetails(postId);
    mainContent.innerHTML = singlepost(postDetails.post);
    return true;
  } catch (error) {
    console.error("Error fetching post details:", error);
    return false;
  }
}

// Handle errors
function handleError(error, message) {
  console.error(message, error);
  const content = document.getElementById("main");
  content.innerHTML = nullpost();
}
