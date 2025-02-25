export function getUserData() {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
}

export let Categories = [];
export let Users = [];
export let Messages = [];
export let Page = 1
export const Posts = [];
export let newPostsAvailable = false;

export function setNewPostsAvailable(value) {
  newPostsAvailable = value;
}