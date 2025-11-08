import { Box } from "@mui/material";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (session) redirect("/main");

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "92%",
        justifyContent: "center",
      }}
    >
      {children}
    </Box>
  );
}
