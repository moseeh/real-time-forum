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
    <input type="text" id="first-name" placeholder="First Name" class="input-field" />
    <br /><br />
    <input type="text" id="second-name" placeholder="Second Name" class="input-field" />
    <br /><br />
    <input type="text" id="signup-username" placeholder="Username" class="input-field" />
    <br /><br />
    <input type="email" id="signup-email" placeholder="Email" class="input-field" />
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
    <input type="number" id="age" class="input-field" placeholder="Enter age" />
    <br /><br />
    <input type="password" id="signup-password" placeholder="Password" class="input-field" />
    <br /><br />
    <input type="password" id="confirm-password" placeholder="Confirm Password" class="input-field" />
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
