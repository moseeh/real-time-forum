export function validateUsername(username) {
  // Check if username is empty or just whitespace
  if (!username || username.trim() === "") {
    return "Username cannot be empty";
  }

  // Ensure it starts with a letter
  if (!/^[a-zA-Z]/.test(username)) {
    return "Username must start with a letter";
  }

  // Allow only letters, numbers, and underscores
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username can only contain letters, numbers, and underscores";
  }

  // Avoid consecutive underscores
  if (/__+/.test(username)) {
    return "Username cannot have consecutive underscores";
  }

  // Reserved usernames
  const reserved = new Set([
    "admin",
    "root",
    "system",
    "test",
    "null",
    "localhost",
    "void",
    "guest",
  ]);

  if (reserved.has(username.toLowerCase())) {
    return "Username is reserved";
  }

  // If all checks pass, return null (no error)
  return null;
}

export function validateEmail(email) {
  // Check if email is empty or just whitespace
  if (!email || email.trim() === "") {
    return "Email cannot be empty";
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  // If validation passes, return null (no error)
  return null;
}
