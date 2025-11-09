import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const apiClient = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.user && (session as any).accessToken)
    config.headers.Authorization = `Bearer ${(session as any).accessToken}`;

  return config;
});

apiClient.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error?.response?.status === 401)
      await signOut({ callbackUrl: "/login" });
  }
);

export default apiClient;
