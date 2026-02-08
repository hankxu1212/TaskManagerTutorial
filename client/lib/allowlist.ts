// Email allowlist for internal users
export const ALLOWED_EMAILS = [
  "uuuuuuxuninghua@gmail.com", // hank
  "ninghuax@teamcrescendo.net", // hank
  "chihungf@andrew.cmu.edu", // stanley
  "Danielek353@gmail.com", // daniel
  "dstankie@andrew.cmu.edu", // daniel
  "colesavomusic@gmail.com", // cole
  "csetiabu@andrew.cmu.edu", // chris
  "jyuan3@andrew.cmu.edu", // xiao
  "leog@andrew.cmu.edu", // leo
  "leogong21@gmail.com", // leo
  "markzhou@cmu.edu", // mark
  "ruoyid@andrew.cmu.edu" // emma
  // Add more allowed emails here
];

export const isEmailAllowed = (email: string): boolean => {
  return ALLOWED_EMAILS.includes(email?.toLowerCase());
};
