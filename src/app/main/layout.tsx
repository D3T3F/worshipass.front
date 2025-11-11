import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { jwtVerify } from "@/utils/jwe";
import TokenGuard from "@/components/TokenGuard";
import Header from "@/components/Header";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const token = (session as any)?.accessToken;

  const validated = await jwtVerify(token);

  return (
    <>
      <Header />
      <TokenGuard error={validated.error ?? null} />
      {children}
    </>
  );
}
