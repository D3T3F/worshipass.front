"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LunchDiningOutlinedIcon from "@mui/icons-material/LunchDiningOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [navAnchorEl, setNavAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleCloseMenu();
    await signOut({ callbackUrl: "/login" });
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNavAnchorEl(event.currentTarget);
  };
  const handleCloseNavMenu = () => setNavAnchorEl(null);

  const userName = session?.user?.name ?? "Usuário";

  const pages = [
    {
      label: "Participantes",
      icon: <PeopleAltOutlinedIcon sx={{ mr: 1 }} />,
    },
    {
      label: "Eventos",
      icon: <CalendarTodayOutlinedIcon sx={{ mr: 1 }} />,
    },
    {
      label: "Lanches",
      icon: <LunchDiningOutlinedIcon sx={{ mr: 1 }} />,
    },
  ];

  const currentPath = pathname?.split("/").pop()?.toLowerCase();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: theme.palette.primary.main }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={() => router.push("/main")}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.5,
              userSelect: "none",
            }}
          >
            WorshipPass
          </Typography>
        </Box>

        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            {pages.map((page) => {
              const isActive = currentPath === page.label.toLowerCase();

              return (
                <Button
                  key={page.label}
                  onClick={() =>
                    router.push(`/main/${page.label.toLowerCase()}`)
                  }
                  startIcon={page.icon}
                  sx={{
                    p: 1.5,
                    color: "white",
                    fontWeight: isActive ? 700 : 400,
                    bgcolor: isActive ? "rgba(255,255,255,0.2)" : "transparent",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.15)",
                    },
                    textTransform: "none",
                  }}
                >
                  {page.label}
                </Button>
              );
            })}
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isMobile && (
            <>
              <IconButton
                onClick={handleOpenNavMenu}
                size="small"
                sx={{ color: "white" }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={navAnchorEl}
                open={Boolean(navAnchorEl)}
                onClose={handleCloseNavMenu}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.label}
                    onClick={() => {
                      router.push(`/main/${page.label.toLowerCase()}`);
                      handleCloseNavMenu();
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {page.icon}
                      <Typography>{page.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
          {session && (
            <>
              {!isMobile && (
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {userName}
                </Typography>
              )}
              <IconButton onClick={handleOpenMenu} size="small">
                <Avatar
                  sx={{
                    bgcolor: theme.palette.text.disabled,
                    width: 34,
                    height: 34,
                    fontSize: 14,
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2">{userName}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
