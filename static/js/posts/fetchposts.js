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
  