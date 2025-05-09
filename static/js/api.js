import { API_ENDPOINTS } from "./constants.js";
import { login, signup } from "./app.js";
import { headerTemplate, leftBar, startchat } from "./templates.js";
import {
  Categories,
  getUserData,
  Users,
  Messages,
  Posts,
  setNewPostsAvailable,
} from "./states.js";
import { displayCreate } from "./posts/createpost.js";
import { displayPosts } from "./posts/posts.js";
import { updateInteractionToAllUsers } from "./posts/likes.js";
import { updateCommentCount } from "./posts/comments.js";

let Sender = [];
let Reciver = [];
let Socket;
let UserData;
const typingTimers = {};

export async function LoginApi(event) {
  if (event) event.preventDefault();

  const username = document.getElementById("login-username").value.toLowerCase();
  const password = document.getElementById("login-password").value;

  if (username.trim() == "" || password.trim() == "") {
    alert("Login Credentials required ");
    return;
  }

  try {
    const response = await fetchAPI(API_ENDPOINTS.login, {
      username,
      password,
    });
    if (response.success) {
      localStorage.setItem("userData", JSON.stringify(response.data));
      setTimeout(Homepage, 100);
    } else {
      console.log(response.message);
      alert(response.message);
    }
  } catch (error) {
    console.error("Login Failed", error);
    // alert("Invalid credentials");
    const errorMessage = document.getElementById("logincheck");
    errorMessage.textContent = "Invalid credentials";
    errorMessage.style.display = "block";
  }
}

export async function SignupAPi(event) {
  if (event) event.preventDefault();

  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    alert("passwords do not match");
    return;
  }
  const userData = {
    firstName: document.getElementById("first-name").value,
    lastName: document.getElementById("second-name").value,
    username: document.getElementById("signup-username").value,
    email: document.getElementById("signup-email").value,
    gender: document.getElementById("gender").value,
    age: parseInt(document.getElementById("age").value, 10),
    password,
  };

  try {
    const response = await fetchAPI(API_ENDPOINTS.signup, userData);

    if (response.success) {
      login();
    } else {
      alert(response.message);
    }
  } catch (error) {
    console.error("signup failed:", error);
  }
}

async function fetchAPI(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        responseData.message || `HTTP ERROR! status: ${response.status}`
      );
    }
    return responseData;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

export async function Homepage() {
  const authdiv = document.getElementById("authentication");
  if (authdiv) {
    authdiv.remove();
  }
  await fetchCategories();
  UserData = getUserData();
  await startSocket();
  await fetchUsers(UserData.userID);
  const header = document.querySelector("header.card");
  if (header) {
    const username = UserData.username;
    header.innerHTML = headerTemplate(username);
  }

  const content = document.getElementById("body");
  content.innerHTML += leftBar(Categories);
  content.innerHTML += `<div class="main-content" id="main"></div>`;
  await displayPosts();
  content.innerHTML += rightBar(Users, UserData.username);
  content.style.display = "grid";

  const create = document.getElementById("create-post-btn");
  if (create) {
    create.addEventListener("click", displayCreate);
  }
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}

export function logouterr () {
  logout()
  
}

async function logout() {
  try {
    const response = await fetch(API_ENDPOINTS.logout, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok || response.status === 401) {
      localStorage.removeItem("userData");
      localStorage.clear();
      window.location.href = "/";
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
}

export async function fetchCategories() {
  try {
    const response = await fetch(API_ENDPOINTS.categories, {
      method: "GET",
      credentials: "include",
    });
    if (response.status === 401) {
      localStorage.removeItem("userData");
      localStorage.clear();
      window.location.href = "/";
      return;
    }
    if (response.ok) {
      const responseData = await response.json();

      Categories.length = 0; // Clear the array
      Categories.push(...responseData.data);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching categories", error);
  }
}

export async function fetchUsers(user) {
  try {
    const response = await fetch(API_ENDPOINTS.allusers, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ username: user }),
    });
    if (response.status === 401) {
      localStorage.removeItem("userData");
      localStorage.clear();
      window.location.href = "/";
      return;
    }

    if (response.ok) {
      const responseData = await response.json();

      Users.length = 0; // Clear the array
      Users.push(...responseData.data);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching users", error);
  }
}

async function startSocket() {
  Socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}${window.location.host}/ws`);
  Sender = [UserData.username, UserData.userID];
  Socket.onopen = () => {
    const data = {
      senderId: Sender[1],
      name: Sender[0],
    };
    Socket.send(JSON.stringify(data));
    console.log("Connected to WebSocket server");
  };

  Socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.istyping === true) {
      if (data.senderId === Reciver[1]) {
        displaytyping();
      }
      typingonlist(data.senderId);
    } else if (data.senderId && !data.type) {
      // Display chat message
      if (data.senderId === Reciver[1]) {
        addMessage(Reciver[0], data.message);
      }
      newusers();
      showNotification(
        data.sendername,
        `New Message from ${data.sendername}`,
        data.senderId
      );
    } else if (data.userId) {
      if (data.userId !== Sender[1] && data.online === true) {
        showNotification(data.name, `${data.name} is online`, data.userId);
        newusers();
      }
      changestatus(data.userId, data.online);
    } else if (data.type === "new_post") {
      if (data.senderId !== Sender[1]) {
        Posts.unshift(data.post);
        showNewPostsNotification();
      }
    } else if (data.type === "interaction") {
      if (data.senderId !== Sender[1]) {
        updateInteractionToAllUsers(data);
      }
    } else if (data.type === "comment") {
      if (data.senderId !== Sender[1]) {
        updateCommentCount(data.post.content_id, data.post.comments_count);
      }
    }
  };
}
function showNewPostsNotification() {
  const notification = document.getElementById("new-posts-notification");
  notification.style.display = "flex";
  setNewPostsAvailable(true);
}

async function newusers() {
  await fetchUsers(UserData.userID);
  const user = document.getElementById("userlist");
  user.innerHTML = reorder(Users, UserData.username);
}

function changestatus(id, online) {
  const list = document.getElementById(id);
  if (list) {
    if (online) {
      list.style.color = "rgb(0, 255, 0)"; // Green for online
    } else {
      list.style.color = "rgb(255, 255, 255)"; // White for offline
    }
    const indicator = list.querySelector(".online-indicator");
    if (indicator) {
      if (online) {
        indicator.classList.remove("offline");
      } else {
        indicator.classList.add("offline");
      }
    }
  }
}

const rightBar = (users, username) => `
  <div class="sidebar-right" id="userlist">
    <h3>All Users</h3>
    <ul id="users">
      ${users
        .map((user) => {
          // Only create a list item if the user's name is not the same as the current username
          if (user.name !== username) {
            // Determine the color based on the user's online status
            const statusColor = user.online
              ? "rgb(0, 255, 0)"
              : "rgb(255, 255, 255)";
            return `
              <li>
                <a href="#" class="chat-link" id="${
                  user.id
                }" style="color: ${statusColor};" onclick="Chat('${
              user.name
            }','${user.id}')">
              <div class="profile-container">
                 <img src="static/images/default-avatar.png" alt="author avatar" class="avatar">
                 <div class="online-indicator ${
                   user.online ? "" : "offline"
                 }"></div>
              </div>
                  <span id="user-${user.id}" class="user">${user.name}</span>
                </a>
              </li>
              <hr>`;
          }
          return ""; // Skip this user
        })
        .join("")}
    </ul>
  </div>
`;

const reorder = (users, username) => `
    <h3>All Users</h3>
    <ul id="users">
      ${users
        .map((user) => {
          // Only create a list item if the user's name is not the same as the current username
          if (user.name !== username) {
            // Determine the color based on the user's online status
            const statusColor = user.online
              ? "rgb(0, 255, 0)"
              : "rgb(255, 255, 255)";
            return `
              <li>
                <a href="#" class="chat-link" id="${
                  user.id
                }" style="color: ${statusColor};" onclick="Chat('${
              user.name
            }','${user.id}')">
              <div class="profile-container">
                 <img src="static/images/default-avatar.png" alt="author avatar" class="avatar">
                 <div class="online-indicator ${
                   user.online ? "" : "offline"
                 }"></div>
              </div>
                  <span id="user-${user.id}" class="user">${user.name}</span>
                </a>
              </li>
              <hr>`;
          }
          return ""; // Skip this user
        })
        .join("")}
    </ul>
`;

window.Chat = async function (username, id) {
  console.log(`Starting chat with ${username}`);
  const mainSection = document.getElementById("main");
  mainSection.innerHTML = startchat(username);
  let page = 1;
  let isLoading = false; // Flag to prevent multiple fetches
  Reciver = [username, id];
  await fetchMessages();
  await displayMessages(page);

  const chatMessages = document.getElementById("chat-messages");
  if (chatMessages) {
    chatMessages.addEventListener("scroll", async () => {
      if (chatMessages.scrollTop === 0 && !isLoading) {
        isLoading = true; // Set flag to prevent multiple fetches
        page++; // Increment page
        await displayMessages(page); // Display the new messages
        isLoading = false; // Reset flag
      }
    });
  }

  const sendBtn = document.getElementById("send-btn");
  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents new line in textarea
      sendMessage(); // Call the function that sends the message
    }
  });
  const chatInput = document.getElementById("chat-textarea");
  if (chatInput) {
    chatInput.addEventListener("input", sendTyping);
  }
  const closechat = document.getElementById("closechat");
  if (closechat) {
    closechat.addEventListener("click", async () => {
      await displayPosts();
    });
  }
};

function sendTyping() {
  const data = {
    senderId: Sender[1],
    sendername: Sender[0],
    receiverId: Reciver[1],
    istyping: true,
  };
  Socket.send(JSON.stringify(data));
}

function displaytyping() {
  // Show the typing indicator in the chat container
  const animation = document.querySelector(".typing-animation");
  const chatMessages = document.getElementById("chat-messages");

  if (animation) {
    animation.classList.add("active");
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (typingTimers["typing"]) {
      clearTimeout(typingTimers["typing"]);
    }
    typingTimers["typing"] = setTimeout(() => {
      animation.classList.remove("active");
    }, 1000);
  }
}

function typingonlist(userId) {
  console.log("receive typing");
  const list = document.getElementById(`user-${userId}`);

  if (list) {
    list.style.color = "rgb(49, 238, 11)";
    if (!list.innerHTML.includes("(Typing ...)")) {
      list.innerHTML += " (Typing ...)";
    }

    // Clear the previous timeout if typing continues
    if (typingTimers[userId]) {
      clearTimeout(typingTimers[userId]);
    }

    // Set a timeout to remove the indicator after inactivity
    typingTimers[userId] = setTimeout(() => {
      list.style.color = "rgb(49, 238, 11)"; // Reset to default color
      list.innerHTML = list.innerHTML.replace(" (Typing ...)", "");
      delete typingTimers[userId];
    }, 1000);
  }
}

function sendMessage() {
  const messageInput = document.getElementById("chat-textarea");
  const message = messageInput.value;

  if (message && message.trim().length > 0) {
    const data = {
      senderId: Sender[1],
      sendername: Sender[0],
      receiverId: Reciver[1],
      message: message,
    };
    Socket.send(JSON.stringify(data));
    addMessage(Sender[0], message); // Display the message locally
    messageInput.value = ""; // Clear input field
  }

  newusers();
}

async function fetchMessages() {
  try {
    const response = await fetch(API_ENDPOINTS.messages, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ senderId: Sender[1], receiverId: Reciver[1] }),
    });
    if (response.status === 401) {
      localStorage.removeItem("userData");
      localStorage.clear();
      window.location.href = "/";
      return;
    }
    if (response.ok) {
      let responseData = await response.json();

      Messages.length = 0; // Clear the array
      Messages.push(...responseData);
      console.log(Messages);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching messages", error);
  }
}

async function displayMessages(page) {
  const chatMessages = document.getElementById("chat-messages");
  if (!chatMessages) return;

  // Store the current scroll height
  const scrollHeightBefore = chatMessages.scrollHeight;
  const start = (page - 1) * 10;
  const end = page * 10;
  console.log(`Page: ${page}, Start: ${start}, End: ${end}`);
  const messages = Messages.slice(start, end);
  console.log(messages);

  // Add messages to the chat
  messages.map((message) =>
    addMessage(
      message.sender_username,
      message.message,
      message.timestamp,
      false
    )
  );

  // Restore the scroll position to maintain the user's view
  if (page > 1) {
    const scrollHeightAfter = chatMessages.scrollHeight;
    chatMessages.scrollTop = scrollHeightAfter - scrollHeightBefore;
  } else {
    // Scroll to the bottom if it's the first page
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

function showNotification(senderName, message, id) {
  // Create the notification element
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  // Add a click event listener to the notification
  notification.addEventListener("click", () => {
    Chat(senderName, id); // Call the Chat function with the sender's name and ID
    notification.remove(); // Remove the notification after clicking
  });

  // Append the notification to the body
  document.body.appendChild(notification);

  // Remove the notification after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

function addMessage(sender, message, time, single = true) {
  const chatMessages = document.getElementById("chat-messages");
  if (!chatMessages) return;

  const isCurrentUser = sender === UserData.username;

  // Create a wrapper for alignment
  const wrapperDiv = document.createElement("div");
  wrapperDiv.classList.add(
    "message-wrapper",
    isCurrentUser ? "sent-wrapper" : "received-wrapper"
  );

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", isCurrentUser ? "sent" : "received");

  if (time === undefined) {
    time = new Date().getTime();
  }

  // Add message content
  messageDiv.innerHTML = `
    <div class="message-info">
      <span class="sender">${escapeHtml(sender)}</span>
      <span class="time">${formatTimestamp(time)}</span>
    </div>
    <div class="content">${escapeHtml(message)}</div>
  `;

  // Append message inside its wrapper
  wrapperDiv.appendChild(messageDiv);

  // Append the message to the chat
  if (single) {
    chatMessages.appendChild(wrapperDiv);
  } else {
    chatMessages.prepend(wrapperDiv);
  }

  // Ensure smooth scrolling to the latest message
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  // Format time as "09:40 AM"
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // If message is from today
  if (diffInDays === 0) {
    if (diffInMinutes < 60) {
      // Show "X minutes ago" for messages less than an hour old
      return diffInMinutes <= 1 ? "just now" : `${diffInMinutes} minutes ago`;
    }
    return `today at ${formattedTime}`;
  }

  // If message is from yesterday
  if (diffInDays === 1) {
    return `yesterday at ${formattedTime}`;
  }

  // For older messages, show full date
  const formattedDate = date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

  return `${formattedDate} at ${formattedTime}`;
}

// Helper function to escape HTML content
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
