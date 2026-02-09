// Admin users allowlist - add email addresses of users who should have admin access
export const ADMIN_EMAILS: string[] = [
  "uuuuuuxuninghua@gmail.com",
  // Add more admin emails here
];

export const isAdminUser = (email: string | undefined | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
