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