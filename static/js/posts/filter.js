import { getUserData } from "../states.js";
import { allposts } from "../templates.js";

export function setupSidebarEventListener(leftSidebar, posts, mainContent) {
  leftSidebar.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-link")) {
      e.preventDefault();
      const allFilters = document.querySelectorAll(".filter-link");
      allFilters.forEach((filter) => filter.classList.remove("active"));

      // Add active class to clicked filter
      e.target.classList.add("active");

      // Get the new filter parameter
      const newFilter = e.target.dataset.filter;
      console.log(newFilter);
      handleFilterChange(newFilter, posts, mainContent);
    }
  });
}

function handleFilterChange(filter, originalPosts, mainContent) {
  const posts = originalPosts;
  const filteredPosts = filterPosts(posts, filter);
  mainContent.innerHTML = allposts(filteredPosts);

  const mainTitle = document.querySelector(".main-content h2");
  if (mainTitle) {
    switch (filter) {
      case "all":
        mainTitle.textContent = "All Posts";
        break;
      case "created":
        mainTitle.textContent = "My Posts";
        break;
      case "liked":
        mainTitle.textContent = "Liked Posts";
        break;
      default:
        if (filter.startsWith("category-")) {
          const categoryName = filter.replace("category-", "");
          mainTitle.textContent = `${categoryName} Posts`;
        }
    }
  }
}

function filterPosts(posts, filterType) {
  const loggedInUser = getUserData().username;
  if (!posts || !posts.length) return [];

  switch (filterType) {
    case "all":
      return posts;
    case "created":
      return posts.filter((post) => post.username === loggedInUser);
    case "liked":
      return posts.filter((post) => post.is_liked);
    default:
      if (filterType.startsWith("category-")) {
        const categoryName = filterType.replace("category-", "");
        return posts.filter((post) =>
          post.categories.some(
            (category) =>
              category.name.toLowerCase() === categoryName.toLowerCase()
          )
        );
      }
      return posts;
  }
}
