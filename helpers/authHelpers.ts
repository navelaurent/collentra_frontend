import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface UserPayload {
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export function getUserInfo() {
  const token = Cookies.get("token");

  if (!token) return null;

  try {
    const decoded = jwtDecode<UserPayload>(token);

    return {
      name:
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        decoded.name,
      email:
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ] || decoded.email,
      sid:
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"] ||
        decoded.sid,
    };
  } catch (error) {
    return null;
  }
}
