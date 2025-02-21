export async function fetchPosts() {
  try {
    const response = await fetch("/api/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // to include cookies for auth
    });
    if (response.status === 401) {
      localStorage.removeItem("userData");
      localStorage.clear();
      window.location.href = "/";
      return;
    }
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

// Fetch post details from API
export async function fetchPostDetails(postId) {
  const response = await fetch(`/api/post/details?postID=${postId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (response.status === 401) {
    localStorage.removeItem("userData");
    localStorage.clear();
    window.location.href = "/";
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
