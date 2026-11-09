// Cryptographic client-side authentication utility using standard Web Crypto API
// Uses one-way salted SHA-512 hashing to ensure no plaintext passcode is ever revealed in bundles
const AUTH_SALT = 'c7e8a49b2f6d10385e91b4a7d6c2e5f8';
const AUTH_DIGEST = 'f3011a566e37791f0a2b607593bd8f1df8331601e97780d94d1bffa99ca6f9261f8e4f71c42cc235cb8ad6d0c4e36ebdb6365fb012e28e68116581953d40d1b8';

export async function verifyPasswordHash(candidate: string): Promise<boolean> {
  try {
    if (!candidate || !candidate.trim()) return false;
    const encoder = new TextEncoder();
    const data = encoder.encode(AUTH_SALT + candidate.trim());
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex === AUTH_DIGEST;
  } catch {
    return false;
  }
}
