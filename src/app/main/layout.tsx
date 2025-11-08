import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { jwtVerify } from "@/lib/jwe";
import { signOut } from "next-auth/react";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const token = (session as any)?.accessToken;

  const validated = await jwtVerify(token);

  if (validated.error) await signOut({ callbackUrl: "/login" });

  return <>{children}</>;
}
