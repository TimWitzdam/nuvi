export function formatUserName(userName: string): string {
  // No symbols, no spaces, all lowercase, only underscores. Remove the @ at the front
  return userName.replace(/@/g, "").toLowerCase().replace(/\W/g, "_");
}
