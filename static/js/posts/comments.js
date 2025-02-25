// Handle comment click event
export function handleCommentClick(modal, commentText) {
  modal.style.display = "flex";
  commentText.value = "";
  commentText.focus();
}

// Close comment modal and reset values
export function closeCommentModal(modal, currentPostId, commentText) {
  modal.style.display = "none";
  currentPostId = null;
  if (commentText) commentText.value = "";
}

// Handle comment submission
export async function handleCommentSubmission(
  modal,
  commentText,
  currentPostId
) {
  if (!commentText.value.trim() || !currentPostId) {
    alert("Comment cannot be empty")
    return;
  }

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
export async function submitComment(postId, comment) {
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
  if (response.status === 401) {
    localStorage.removeItem("userData");
    localStorage.clear();
    window.location.href = "/";
    return;
  }

  if (!response.ok) {
    throw new Error("Failed to submit comment");
  }

  return response.json();
}

// Update comment count in UI
export function updateCommentCount(postId, count) {
  const commentBtn = document.querySelector(
    `.comment-btn[data-post-id="${postId}"]`
  );
  if (!commentBtn) {
    console.error(
      `Could not find comment button with data-post-id="${postId}"`
    );
    return;
  }

  const commentSpan = commentBtn.querySelector("span");
  if (!commentSpan) {
    console.error("Could not find comment count span");
    return;
  }

  commentSpan.textContent = count;
}
