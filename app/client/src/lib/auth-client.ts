export type DecodedUser = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
};

export function decodeToken(token: string) {
  const [, payloadBase64] = token.split(".");
  const payloadJson = atob(payloadBase64);
  return JSON.parse(payloadJson) as DecodedUser;
}

export function getUserFromToken(): DecodedUser | null {
  const token = document.cookie.match(/(^| )token=([^;]+)/)?.[2];
  if (!token) return null;

  try {
    return decodeToken(token);
  } catch {
    return null;
  }
}

export function getTokenFromCookie(): string | null {
  const token = document.cookie.match(/(^| )token=([^;]+)/)?.[2];
  if (!token) return null;

  return token;
}
