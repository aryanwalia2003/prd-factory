import { headers } from "next/headers";
import { auth } from "./auth";

// Route handlers mein session check karne ke liye — har write endpoint pe use karo.
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}
