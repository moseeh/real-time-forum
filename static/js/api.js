import { API_ENDPOINTS } from "./constants.js";
import { login, signup } from "./app.js";
import { render } from "./ui.js";
import {
  headerTemplate,
  loggedInTemplate,
  leftBar,
  allposts,
  addMessage,
  showNotification,
  startchat,
} from "./templates.js";
import { Categories, getUserData, Users, Messages } from "./states.js";
import { displayCreate } from "./posts.js";

let Sender = [];
let Reciver = [];
let Socket;

export async function LoginApi(event) {
  if (event) event.preventDefault();

  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetchAPI(API_ENDPOINTS.login, {
      username,
      password,
    });
    if (response.success) {
      localStorage.setItem("userData", JSON.stringify(response.data));
      render(loggedInTemplate);
      setTimeout(Homepage, 2000);
    } else {
      alert(response.message);
    }
  } catch (error) {
    console.error("Login Failed", error);
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
  await startSocket();
  const UserData = getUserData();
  await fetchUsers(UserData.userID);
  const header = document.querySelector("header.card");
  if (header) {
    const username = UserData.username;
    header.innerHTML = headerTemplate(username);
  }

  const content = document.getElementById("body");
  let data = ["username", "password"];
  content.innerHTML += leftBar(Categories);
  content.innerHTML += allposts(data);
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

async function logout() {
  try {
    const response = await fetch(API_ENDPOINTS.logout, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      localStorage.removeItem("userData");
      localStorage.clear();
      login();
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
  Socket = new WebSocket(`ws://${window.location.host}/ws`);

  const userData = localStorage.getItem("userData");
  const Data = JSON.parse(userData);
  // console.log(data)
  Sender = [Data.username, Data.userID];
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
      // displayTyping(data.name);
      if (data.senderId === Reciver[1]) {
        displaytyping();
      }
    } else if (data.senderId) {
      // Display chat message
      if (data.senderId === Reciver[1]) {
        addMessage(Reciver[0], data.message);
      }
      showNotification(`New Message from ${data.sendername}`);
    } else if (data.userId) {
      if (data.userId !== Sender[1] && data.online === true) {
        showNotification(`${data.name} is online`);
      }
      changestatus(data.userId, data.online)
      newusers(Data)
    }
  };
}

async function newusers(Data) {
  const old = Users.length
  await fetchUsers(Data.userID)
  if (Users.length > old) {
    const content = document.getElementById("body");
    const user = document.getElementById("userlist")
    if (user) {
      user.remove()
    }
    content.innerHTML += rightBar(Users, Data.username)
  }
}

function changestatus(id, online) {
  const list = document.getElementById(id);
  if (list) {
    if (online) {
      list.style.color = "rgb(0, 255, 0)"; // Green for online
      list.innerHTML = list.innerHTML.replace("(Offline)", "(Online)"); // Update status text
    } else {
      list.style.color = "rgb(255, 255, 255)"; // White for offline
      list.innerHTML = list.innerHTML.replace("(Online)", "(Offline)"); // Update status text
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
        const statusColor = user.online ? "rgb(0, 255, 0)" : "rgb(255, 255, 255)";
        return `
              <li>
                <a href="#" id="${user.id}" style="color: ${statusColor};" onclick="Chat('${user.name}','${user.id}')">
                  ${user.name} ${user.online ? "(Online)" : "(Offline)"}
                </a>
              </li>`;
      }
      return ""; // Skip this user
    })
    .join("")}
    </ul>
  </div>
`;

window.Chat = async function (username, id) {
  console.log(`Starting chat with ${username}`);
  const mainSection = document.getElementById("main");
  mainSection.innerHTML = startchat(username);
  let page = 1;
  let isLoading = false; // Flag to prevent multiple fetches
  // console.log(data)
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
  const chatInput = document.getElementById("chat-textarea");
  if (chatInput) {
    chatInput.addEventListener("input", sendTyping);
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
  const typingDiv = document.getElementById("typing");
  if (typingDiv) {
    // Show the typing indicator
    typingDiv.classList.add("show");

    // Hide the typing indicator after 2 seconds
    setTimeout(() => {
      typingDiv.classList.remove("show");
    }, 2000);
  }
}

function sendMessage() {
  const messageInput = document.getElementById("chat-textarea");
  const message = messageInput.value;

  if (message) {
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
  const end = start + 10;
  const messages = Messages.slice(start, end);
  // Add messages to the chat
  messages.map((message) =>
    addMessage(message.sender_username, message.message, message.timestamp)
  );

  // Restore the scroll position to maintain the user's view
  chatMessages.scrollTop = chatMessages.scrollHeight - scrollHeightBefore;
}
