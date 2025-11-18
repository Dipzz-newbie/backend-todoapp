import crypto from "crypto";

export const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
}