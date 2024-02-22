export function generateSecurePassword(length = 16) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};':\",./<>?";
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[Math.floor(bytes[i] % charset.length)];
  }
  return password;
}
