export function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function validateUsername(username) {
  // Ensure it starts with a letter
  if (!/^[a-zA-Z]/.test(username)) {
    return "username must start with a letter";
  }

  // Allow only letters, numbers, and underscores
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "username can only contain letters, numbers, and underscores";
  }

  // Avoid consecutive underscores
  if (/__+/.test(username)) {
    return "username cannot have consecutive underscores";
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
  if (reserved.has(username)) {
    return "username is reserved";
  }

  // If all checks pass, return null (no error)
  return null;
}