export const loginTemplate = () => `
  <div class="login-form-container">
    <h1>Login</h1>
    <input type="text" id="login-username" placeholder="Username or Email" class="input-field" />
    <br /><br />
    <input type="password" id="login-password" placeholder="Password" class="input-field" />
    <div id="logincheck" style="display:none;color:red;"></div>
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
    <div id="passwordcheck" style="display:none;color:red;"></div>
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

export const allposts = (posts) => `
  <div class="main-content" id="main">
    <h2>All Posts</h2>
    ${
      posts?.length
        ? posts
            .map(
              ({
                title,
                content,
                username,
                likes_count,
                dislikes_count,
                post_id,
                comments_count,
              }) => `
          <article class="post" data-post-id="${post_id}">
            <header>
              <h3>${title}</h3>
            </header>
            <p>${content}</p>
            <footer class="post-actions">
              <span class="author">By: ${username}</span>
              <div class="buttons">
                <button class="btn upvote-btn" aria-label="Upvote" data-post-id="${post_id}">
                  <i class="fa-solid fa-thumbs-up"></i><span>${likes_count}</span>
                </button>
                <button class="btn downvote-btn" aria-label="Downvote" data-post-id="${post_id}">
                  <i class="fa-solid fa-thumbs-down"></i><span>${dislikes_count}</span>
                </button>
                <button class="btn comment-btn" data-post-id="${post_id}">
                  <i class="fa-regular fa-comment"></i><span>${comments_count}</span>
                </button>
              </div>
            </footer>
          </article>`
            )
            .join("")
        : ""
    }
  </div>

   <div class="modal-overlay" id="commentModal">
    <div class="modal">
      <h3>Add Comment</h3>
      <textarea id="commentText" placeholder="Type your comment here..."></textarea>
      <div class="modal-buttons">
        <button class="btn cancel-btn" id="cancelComment">Cancel</button>
        <button class="btn submit-btn" id="submitComment">Submit</button>
      </div>
    </div>
  </div>

`;

export const singlepost = (post) => `
   <article class="post" data-post-id="${post.post_id}">
    <header>
      <h3>${post.title}</h3>
    </header>
    <p>${post.content}</p>
    <footer class="post-actions">
      <span class="author">By: ${post.username}</span>
      <div class="buttons">
        <button class="btn upvote-btn ${
          post.IsLiked ? "active" : ""
        }" aria-label="Upvote" data-post-id="${post.post_id}">
          <i class="fa-solid fa-thumbs-up"></i><span>${post.likes_count}</span>
        </button>
        <button class="btn downvote-btn ${
          post.IsDisliked ? "active" : ""
        }" aria-label="Downvote" data-post-id="${post.post_id}">
          <i class="fa-solid fa-thumbs-down"></i><span>${
            post.dislikes_count
          }</span>
        </button>
        <button class="btn comment-btn" data-post-id="${post.post_id}">
          <i class="fa-regular fa-comment"></i><span>${
            post.comments_count
          }</span>
        </button>
      </div>
    </footer>
 </article>

  <!-- Comments Section -->
  <div class="comments-section">
    <!-- Add Comment Form -->
    <div class="add-comment">
      <textarea placeholder="Add a comment..." rows="3"></textarea>
      <button class="btn submit-btn" id="submitComment" data-post-id="${
        post.post_id
      }">Submit</button>
    </div>
    <h3>Comments (${post.comments_count})</h3>
    ${renderComments(post.comments)}
  </div>
`;
const renderComments = (comments) => {
  if (!comments || comments.length === 0) {
    return '<p class="no-comments">No comments yet. Be the first to comment!</p>';
  }

  return comments
    .map(
      (comment) => `
    <div class="comment" data-comment-id="${comment.comment_id}">
      <span class="comment-author">${comment.username}</span>
      <p>${comment.text}</p>
      <span class="comment-date">${formatDate(comment.created_at)}</span>
      <div class="comment-actions">
        <button class="btn upvote-btn-sm ${
          comment.IsLiked ? "active" : ""
        }" aria-label="Upvote" data-comment-id="${comment.comment_id}">
          <i class="fa-solid fa-thumbs-up"></i><span>${
            comment.likes_count
          }</span>
        </button>
        <button class="btn downvote-btn-sm ${
          comment.IsDisliked ? "active" : ""
        }" aria-label="Downvote" data-comment-id="${comment.comment_id}">
          <i class="fa-solid fa-thumbs-down"></i><span>${
            comment.dislikes_count
          }</span>
        </button>
        <button class="btn reply-btn-sm" data-comment-id="${
          comment.comment_id
        }">
          <i class="fa-solid fa-reply"></i><span>Reply</span>
        </button>
      </div>
      ${
        comment.Replies && comment.Replies.length > 0
          ? `<div class="replies">
          ${renderComments(comment.Replies)}
        </div>`
          : ""
      }
    </div>
  `
    )
    .join("");
};
export const createpost = (categories) => `
    <form id="create-post-form" action="/posts/create" method="POST" enctype="multipart/form-data">
      <input type="text" name="title" placeholder="Post Title" required />
      <textarea name="content" placeholder="Post Content" required></textarea>

      <div class="categories-section">
        ${
          categories.length > 0
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

export const startchat = (username) => `
  <div class="chat-container">
    <div class="chathead">
      <h2>Chat with ${username}</h2><br /><br />
      <div id="typing" class="typing-indicator">
        <span class="typing-text">typing...</span>
        <span class="blinking-cursor">|</span>
      </div>
    </div>
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

export function addMessage(sender, message, time) {
  const chatMessages = document.getElementById("chat-messages");
  if (!chatMessages) return;

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");

  if (time === undefined) {
    time = new Date().getTime();
  }

  // Add message content
  messageDiv.innerHTML = `
    <div>
      <span class="sender">${sender}</span>
      <span class="time">${formatTimestamp(time)}</span>
    </div>
    <div class="content">${message}</div>
  `;

  // Append the message to the chat
  chatMessages.appendChild(messageDiv);
  // Scroll to the bottom of the chat
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

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString();
};
