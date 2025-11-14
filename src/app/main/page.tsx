"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LunchDiningOutlinedIcon from "@mui/icons-material/LunchDiningOutlined";
import { findTodayEvents } from "../api/eventos";
import { Evento } from "@/models/evento.model";

type jobType = "Participantes" | "Eventos" | "Lanches";

function JobPaper({ type }: { type: jobType }) {
  const icons = {
    Participantes: <PeopleAltOutlinedIcon color="primary" />,
    Eventos: <CalendarTodayOutlinedIcon color="primary" />,
    Lanches: <LunchDiningOutlinedIcon color="primary" />,
  };

  const router = useRouter();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      onClick={() => router.push(`/main/${type.toLowerCase()}`)}
      sx={{
        p: 3,
        width: isMobile ? "100%" : 300,
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
          backgroundColor: (theme) =>
            theme.palette.mode === "light" ? "#f5f5f5" : "#333",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {icons[type]}
        <Typography variant="h6" sx={{ mb: 2 }}>
          {type}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function MainPage() {
  const { data: session } = useSession();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const fullName = session?.user?.name || "Usuário";

  const firstName = fullName ? fullName.split(" ")[0] : "Usuário";

  useEffect(() => {
    fetchEventos();
  }, []);

  async function fetchEventos() {
    try {
      const result = await findTodayEvents();
      setEventos(result.data);
    } catch (e) {
      console.error(e);
      setEventos([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        py: 3,
        px: isMobile ? 0 : isTablet ? 5 : 20,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Bem-vindo, {firstName}!
        </Typography>
        <Typography color="text.secondary">
          Veja seus eventos e opções para hoje!
        </Typography>
      </Box>

      <Box sx={{ width: "70%" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Eventos de hoje
        </Typography>

        {loading ? (
          <CircularProgress size={28} />
        ) : eventos.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Paper sx={{ p: 2 }}>
              <Typography color="text.secondary">
                Você não tem eventos hoje.
              </Typography>
            </Paper>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {eventos.map((ev) => (
              <Paper key={ev.id} sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {ev.nome}
                </Typography>
                {ev.local && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {ev.local}
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ width: "70%", mt: 5 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Tarefas
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            justifyContent: "space-around",
          }}
        >
          <JobPaper type="Participantes" />
          <JobPaper type="Eventos" />
          <JobPaper type="Lanches" />
        </Box>
      </Box>
    </Box>
  );
}
