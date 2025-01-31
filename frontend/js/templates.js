export const loginTemplate = () => `
    <div class="container">
        <div class="box-1">
            <div class="content-holder">
                <h2>Hello!</h2>
                <button class="button-1" onclick="signup()">Sign up</button>
                <button class="button-2" onclick="login()">Login</button>
            </div>
        </div>

        <div class="box-2">
            <div class="login-form-container">
                <h1>Login Form</h1>
                <input type="text" placeholder="Username or Email" class="input-field" />
                <br /><br />
                <input type="password" placeholder="Password" class="input-field" />
                <br /><br />
                <button class="login-button" type="button">Login</button>
            </div>
        </div>
    </div>
`;

export const signupTemplate = () => `
    <div class="container">
        <div class="box-1">
            <div class="content-holder">
                <h2>Hello!</h2>
                <button class="button-1" onclick="signup()">Sign up</button>
                <button class="button-2" onclick="login()">Login</button>
            </div>
        </div>

        <div class="box-2">
            <div class="signup-form-container">
                <h1>Sign Up Form</h1>
                <input type="text" placeholder="First Name" class="input-field" />
                <input type="text" placeholder="Second Name" class="input-field" />
                <br /><br />
                <input type="text" placeholder="Username" class="input-field" />
                <br /><br />
                <input type="email" placeholder="Email" class="input-field" />
                <br /><br />
                <select name="Gender" id="Gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <br /><br />
                <!-- Age Input -->
                <div class="age-selector">
                    <label for="age">Age:</label>
                    <input type="number" id="age" class="input-field" placeholder="Enter age" />
                    <br />
                    <div class="age-buttons">
                        <button type="button" onclick="decrementAge()">-</button>
                        <span id="ageValue">18</span> <!-- Initial age set to 18 -->
                        <button type="button" onclick="incrementAge()">+</button>
                    </div>
                </div>
                <br /><br />
                <input type="password" placeholder="Password" class="input-field" />
                <input type="password" placeholder="Confirm Password" class="input-field" />
                <br /><br />
                <button class="signup-button" type="button">Sign Up</button>
            </div>
        </div>
    </div>
`;
