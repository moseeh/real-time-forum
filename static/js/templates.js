import { formatDate } from "./time.js";

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
    <div id="agecheck" style="display:none;color:red;"></div>
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
          <span class="username">Welcome, ${escapeHtml(username)}</span>
          <img src="static/images/default-avatar.png" alt="author avatar" class="avatar">
          <button class="btn" id="create-post-btn">Create Post</button>
          <button class="btn" id="logout-btn">Logout</button>
        </div>
      </div>
    </div>
  `;
export const leftBar = (categories) => `
    <div class="sidebar-left">
        <div class="posts-section">
            <h2>Posts</h2>
            <ul>
                <li><a href="#" class="filter-link active" data-filter="all">All Posts</a></li>
                <li><a href="#" class="filter-link" data-filter="created">Created Posts</a></li>
                <li><a href="#" class="filter-link" data-filter="liked">Liked Posts</a></li>
            </ul>
        </div>
        <div class="categories-section">
            <h2>Categories</h2>
            <ul id="category">
                ${categories
                  .map(
                    (category) =>
                      `<li><a href="#" class="filter-link" data-filter="category-${category.name}">${category.name}</a></li>`
                  )
                  .join("")}
            </ul>
        </div>
    </div>
`;
export const nullpost = () => `
    <h2>No posts found.</h2>
`;

export const allposts = (posts) => `
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
                image_url,
                post_id,
                comments_count,
                categories,
                created_at,
                is_liked,
                is_disliked,
              }) => `
               <article class="post" data-post-id="${post_id}">
                <div class="post-header">
                 <img src="static/images/default-avatar.png" alt="author avatar" class="avatar">
                  <div class="author-info">
                    <p class="author-name">${escapeHtml(username)}</p>
                    <p class="post-date">${formatDate(created_at)}</p>
                  </div>
                </div>
                <h2 class="post-title">${escapeHtml(title)}</h2> 
                <p class="post-text">${escapeHtml(content)}</p>
                  <div class="categories">
                    ${
                      categories?.length
                        ? categories
                            .map(
                              (category) =>
                                `<span class="category">${escapeHtml(category.name)}</span>`
                            )
                            .join(" ")
                        : ""
                    }
                  </div>
                  ${
                    image_url
                      ? `<div class="post-image">
                          <img src="static/images/${image_url}" alt="Post image" class="post-image">
                         </div>`
                      : ""
                  }
                  <footer class="post-actions">
                      <button class="action-button upvote-btn ${
                        is_liked ? "active" : ""
                      }" aria-label="Upvote" data-post-id="${post_id}">
                        <i class="fa-solid fa-thumbs-up"></i><span>${likes_count}</span>
                      </button>
                      <button class="action-button downvote-btn ${
                        is_disliked ? "active" : ""
                      }" aria-label="Downvote" data-post-id="${post_id}">
                        <i class="fa-solid fa-thumbs-down"></i><span>${dislikes_count}</span>
                      </button>
                      <button class="action-button comment-btn" data-post-id="${post_id}">
                        <i class="fa-regular fa-comment"></i><span>${comments_count}</span>
                      </button>
                  </footer>
              </article>`
            )
            .join("")
        : '<p class="empty-state">No posts available</p>'
    }

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
            <div class="post-header">
              <img src="static/images/default-avatar.png" alt="author avatar" class="avatar">
              <div class="author-info">
                <p class="author-name">${escapeHtml(post.username)}</p>
                <p class="post-date">${formatDate(post.created_at)}</p>
              </div>
            </div>
            <h2 class="post-title">${escapeHtml(post.title)}</h2> 
            <p class="post-text">${escapeHtml(post.content)}</p>
            <div class="categories">
              ${
                post.categories?.length
                  ? post.categories
                      .map(
                        (category) =>
                          `<span class="category">${escapeHtml(category.name)}</span>`
                      )
                      .join(" ")
                  : ""
              }
              </div>
              ${
                post.image_url
                  ? `<div class="post-image">
                      <img src="static/images/${post.image_url}" alt="Post image" class="post-image">
                     </div>`
                  : ""
              }
            <footer class="post-actions">
              <button class="action-button upvote-btn ${
                post.is_liked ? "active" : ""
              }" aria-label="Upvote" data-post-id="${post.post_id}">
                  <i class="fa-solid fa-thumbs-up"></i><span>${
                    post.likes_count
                  }</span>
              </button>
              <button class="action-button downvote-btn ${
                post.is_disliked ? "active" : ""
              }" aria-label="Downvote" data-post-id="${post.post_id}">
                  <i class="fa-solid fa-thumbs-down"></i><span>${
                    post.dislikes_count
                  }</span>
              </button>
              <button class="action-button comment-btn" data-post-id="${
                post.post_id
              }">
                  <i class="fa-regular fa-comment"></i><span>${
                    post.comments_count
                  }</span>
              </button>
            </footer>
          </article>

  <!-- Comments Section -->
  <div class="comments-section">
    
    <h3>Comments (${post.comments_count})</h3>
    ${renderComments(post.comments)}
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
const renderComments = (comments) => {
  if (!comments || comments.length === 0) {
    return '<p class="no-comments">No comments yet. Be the first to comment!</p>';
  }

  return comments
    .map(
      (comment) => `
    <article class="post" data-post-id="${comment.comment_id}">
        <div class="post-header">
         <img src="static/images/default-avatar.png" alt="author avatar" class="avatar">
         <div class="author-info">
            <p class="author-name">${escapeHtml(comment.username)}</p>
            <p class="post-date">${formatDate(comment.created_at)}</p>
          </div>
        </div>
        <p class="post-text">${escapeHtml(comment.text)}</p>
        <footer class="post-actions">
          <button class="action-button upvote-btn ${
            comment.is_liked ? "active" : ""
          }" aria-label="Upvote" data-post-id="${comment.comment_id}">
              <i class="fa-solid fa-thumbs-up"></i><span>${
                comment.likes_count
              }</span>
          </button>

          <button class="action-button downvote-btn ${
            comment.is_disliked ? "active" : ""
          }" aria-label="Downvote" data-post-id="${comment.comment_id}">
            <i class="fa-solid fa-thumbs-down"></i><span>${
              comment.dislikes_count
            }</span>
          </button>
                     
          <button class="action-button comment-btn" data-post-id="${
            comment.comment_id
          }">
            <i class="fa-regular fa-comment"></i><span>${
              comment.comments_count
            }</span>
          </button>
        </footer>

      ${
        comment.Replies && comment.Replies.length > 0
          ? `<div class="replies">
          ${renderComments(comment.Replies)}
        </div>`
          : ""
      }
    </article>
  `
    )
    .join("");
};
export const createpost = (categories) => `
    <style>
      .error-message {
        color: red;
        font-size: 14px;
        margin-top: 4px;
        display: none;
      }
      
      .invalid-input {
        border: 1px solid red;
      }
    </style>
    <form id="create-post-form" action="/posts/create" method="POST" enctype="multipart/form-data">
      <input type="text" name="title" placeholder="Post Title" />
      <textarea name="content" placeholder="Post Content"></textarea>

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
                <input type="checkbox" name="categories[]" value="${
                  category.id
                }" id="category-${category.id}" class="category-checkbox" />
                <label for="category-${category.id}">${escapeHtml(
                  category.name
                )}</label>
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
      <h2>Chat with ${escapeHtml(username)}</h2><br /><br />
      <div class="closediv">
        <button id="closechat" class="btn">Close</button>
      </div>
    </div>
    <!-- Chat Messages Display -->
    <div class="chat-messages" id="chat-messages">
      <!-- Messages will be dynamically added here -->
    </div>
    <!-- Typing animation container - moved outside the message list -->
    <div class="typing-animation" id="typing-animation">
      <div class="message-wrapper received-wrapper">
        <div class="message received">
          <div class="message-info"> <span class="sender">${escapeHtml(username)} is typing</span> </div>
          <div class="content">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40">
              <rect x="0" y="0" width="120" height="40" rx="20" fill="#E9E9EB">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
              </rect>
              <circle cx="40" cy="20" r="4" fill="#8E8E93">
                <animate attributeName="cy" values="20;16;20" dur="1s" repeatCount="indefinite"/>
              </circle>
              <circle cx="60" cy="20" r="4" fill="#8E8E93">
                <animate attributeName="cy" values="20;16;20" dur="1s" begin="0.2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="80" cy="20" r="4" fill="#8E8E93">
                <animate attributeName="cy" values="20;16;20" dur="1s" begin="0.4s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>


    <!-- Typing Textarea -->
    <div class="chat-input">
      <textarea id="chat-textarea" placeholder="Type your message ..."></textarea>
      <button id="send-btn" class="btn">Send</button>
    </div>
  </div>
`;

// Helper function to escape HTML content
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
