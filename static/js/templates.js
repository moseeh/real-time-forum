export const loginTemplate = () => `
  <div class="login-form-container">
    <h1>Login</h1>
    <input type="text" id="login-username" placeholder="Username or Email" class="input-field" />
    <br /><br />
    <input type="password" id="login-password" placeholder="Password" class="input-field" />
    <br /><br />
    <button id="login-form-button" class="login-form-button" type="button">Login</button>
  </div>
`;

export const signupTemplate = () => `
  <div class="signup-form-container">
    <h1>Sign Up</h1>
    <input type="text" id="first-name" placeholder="First Name" class="input-field" required />
    <div id="firstcheck" style="display:none;color:red;"></div>
    <br /><br />
    <input type="text" id="second-name" placeholder="Second Name" class="input-field" required />
    <div id="secondcheck" style="display:none;color:red;"></div>
    <br /><br />
    <input type="text" id="signup-username" placeholder="Username" class="input-field" required />
    <div id="nameavailable" style="display:none;color:red;"></div>
    <br /><br />
    <input type="email" id="signup-email" placeholder="Email" class="input-field" required />
    <div id="emailavailable" style="display:none;color:red;"></div>
    <br /><br />
    <div class="gender-container">
      <label for="gender" class="gender-label">Gender:</label>
      <select name="gender" id="gender" class="gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>
    <br /><br />
    <!-- Age Input -->
    <input type="number" id="age" class="input-field" placeholder="Enter age" required />
    <br /><br />
    <input type="password" id="signup-password" placeholder="Password" class="input-field" required/>
    <br /><br />
    <input type="password" id="confirm-password" placeholder="Confirm Password" class="input-field" required/>
    <br /><br />
    <button id="signup-form-button" class="signup-form-button" type="button">Sign Up</button>
  </div>
`;

export const loggedInTemplate = (username) => `
    <h1>Welcome, ${username}!</h1>
    <p>You're successfully logged in.</p>
    <button class="logout-button" onclick="logout()">Log Out</button>
`;

export const headerTemplate = (username) => `
    <div class="header-content">
      <div class="logo">
        <a href="/">
          <h1>Forum</h1>
        </a>
      </div>
      <div class="header-actions">
        <div class="user-menu">
          <span class="username">Welcome, ${username}</span>
          <button class="btn" id="create-post-btn">Create Post</button>
          <button class="btn" id="logout-btn">Logout</button>
        </div>
      </div>
    </div>
  `;
export const leftBar = (categories) => `
      <div class="sidebar-left">
          <div class="posts-section">
            <h3>Posts</h3>
            <ul>
              <li><a href="#" class="active">All Posts</a></li>
              <li><a href="#">Created Posts</a></li>
              <li><a href="#">Liked Posts</a></li>
            </ul>
          </div>
          <div class="categories-section">
            <h3>Categories</h3>
            <ul id="category">
              ${categories
    .map((category) => `<li><a href="#">${category.name}</a></li>`)
    .join("")}
            </ul>
          </div>
        </div>
`;

export const rightBar = (users, username) => `
  <div class="sidebar-right">
    <h3>All Users</h3>
    <ul id="users">
      ${users
    .map((user) => {
      // Only create a list item if the user's name is not the same as the current username
      if (user.name !== username) {
        return `<li><a href="#" onclick="Chat('${user.name}')">${user.name}</a></li>`;
      }
      return ""; // Skip this user
    })
    .join("")}
    </ul>
  </div>
`;

export const allposts = (posts) => `
        <div class="main-content" id="main">
          <h2>All Posts</h2>
        ${posts
    .map(
      (post) => `<div class="post">
          <h3>${post.title}</h3>
          <p>${post.content}</p>
          <div class="post-actions">
            <span class="author">Author: ${post.author}</span>
            <span class="likes">${post.likes} Likes</span>
            <button class="btn">Like</button>
            <span class="dislikes">${post.dislikes} Dislikes</span>
            <button class="btn">Dislikes</button>
          </div>
        </div>`
    )
    .join("")}
        </div>
`;

export const singlepost = (post) => `
          <div class="post">
            <h4>${post.title}</h4>
            <p>${post.content}</p>
            <span class="post-author">${post.author} at ${post.createdat
  }</span><br>
            <div class="post-actions">
              <span class="likes">${post.likes} Likes</span>
              <button class="btn like-btn">Like</button>
              <span class="dislikes">${post.dislikes} Dislikes</span>
              <button class="btn dislike-btn">Dislike</button>
            </div>
          </div>
        
          <!-- Comments Section -->
          <div class="comments-section">
            <h3>Comments</h3>
            ${post.contents
    .map(
      (comment) => `<div class="comment">
              <span class="comment-author">${comment.author}</span>
              <p>${comment.content}</p>
              <span class="comment-date">${comment.createdat}</span>
            </div>`
    )
    .join("")}
        
            <!-- Add Comment Form -->
            <div class="add-comment">
              <textarea placeholder="Add a comment..." rows="3"></textarea>
              <button class="btn comment-btn">Submit</button>
            </div>
          </div>
`;

export const createpost = (categories) => `
    <form id="create-post-form" action="/posts/create" method="POST" enctype="multipart/form-data">
      <input type="text" name="title" placeholder="Post Title" required />
      <textarea name="content" placeholder="Post Content" required></textarea>

      <div class="categories-section">
        ${categories.length > 0
    ? `
          <label>Select Categories (Choose one or more):</label>
          <div class="categories-grid">
            ${categories
      .map(
        (category) => `
              <div class="category-item">
                <input type="checkbox" name="categories[]" value="${category.id}" id="category-${category.id}" class="category-checkbox" />
                <label for="category-${category.id}">${category.name}</label>
              </div>
            `
      )
      .join("")}
          </div>
        `
    : "<p>No categories available</p>"
  }
      </div>

      <label for="image-upload">Upload Image (Max: 20MB)</label>
      <input type="file" id="image-upload" name="image" accept="image/*" />

      <button type="submit" id="submitBtn" class="btn">Submit Post</button><br>
      <button type="button" id="closeModal" class="btn">Close</button>
    </form>
  `;

const startchat = () => `
    <div class="chat-container">
    <div class="chat-
  <!-- Chat Messages Display -->
  <div class="chat-messages" id="chat-messages">
    <!-- Messages will be dynamically added here -->
  </div>

  <!-- Typing Textarea -->
  <div class="chat-input">
    <textarea id="chat-textarea" placeholder="Type your message..."></textarea>
    <button id="send-btn" class="btn">Send</button>
  </div>
</div>
`;
window.Chat = (username) => {
  console.log(`Starting chat with ${username}`);
  const mainSection = document.getElementById("main");
  mainSection.innerHTML = startchat();
  const userData = localStorage.getItem("userData");
  const data = JSON.parse(userData)
  const sender = data.username
  const reciver = username
  console.log(reciver, sender)

  // Connect to WebSocket server
  const socket = new WebSocket(`ws://${window.location.host}/ws`);

  socket.onopen = () => {
    socket.send(sender);
    console.log("Connected to WebSocket server");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.senderId) {
      // Display chat message
      addMessage(data.senderId, data.message)
    } else if (data.userId) {
      // Update online status
      const statusDiv = document.getElementById("onlineStatus");
      const userStatus = document.getElementById(`status-${data.userId}`);
      if (userStatus) {
        userStatus.textContent = data.online ? "Online" : "Offline";
        userStatus.className = data.online ? "online" : "offline";
      } else {
        statusDiv.innerHTML += `<p id="status-${data.userId}" class="${data.online ? "online" : "offline"}">${data.userId}: ${data.online ? "Online" : "Offline"}</p>`;
      }
    }
  };

  const sendBtn = document.getElementById("send-btn");

  sendBtn.addEventListener("click", sendMessage);

  function sendMessage() {
    const messageInput = document.getElementById("chat-textarea");
    const message = messageInput.value;

    if (message) {
        const data = {
            senderId: sender,
            receiverId: reciver,
            message: message,
        };
        socket.send(JSON.stringify(data));
        addMessage(sender, message); // Display the message locally
        messageInput.value = ""; // Clear input field
    }
}
};

// Function to add a new message
function addMessage(sender, message) {
  const chatMessages = document.getElementById("chat-messages");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");

  // Get current time
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Add message content
  messageDiv.innerHTML = `
    <div>
      <span class="sender">${sender}</span>
      <span class="time">${time}</span>
    </div>
    <div class="content">${message}</div>
  `;

  // Append the message to the chat
  chatMessages.appendChild(messageDiv);

  // Scroll to the bottom of the chat
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
