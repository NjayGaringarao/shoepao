import React, { useEffect, useState } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { ChatProvider, useChat } from "./context/ChatContext";
import ConversationList from "./components/ConversationList";
import ChatInterface from "./components/ChatInterface";
import ErrorSnackbar from "./components/ErrorSnackbar";
import appTheme from "./theme";

const backgroundImages = [
  "/image_one.png",
  "/image_two.png",
  "/image_three.png",
  "/image_four.png",
];

const AppContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { error, clearError } = useChat();

  const handleErrorClose = () => {
    clearError();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % backgroundImages.length);
    }, 10_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        width: "100vw",
        padding: "1rem",
        gap: "1rem",
        paddingTop: "5rem",
      }}
    >
      {/** Background Images */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        {backgroundImages.map((url, index) => (
          <Box
            key={url}
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: activeImage === index ? 1 : 0,
              transition: "opacity 1s ease-in-out",
            }}
          />
        ))}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.35)",
          }}
        />
      </Box>

      {/** App Bar */}

      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setSidebarOpen(true)}
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Shoepao Chatbot
          </Typography>
        </Toolbar>
      </AppBar>

      {/** Conversation List */}
      <ConversationList
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/** Chat Interface */}
      <Box
        component="main"
        sx={{
          position: "relative",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          overflow: "auto",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <ChatInterface />
      </Box>
      <ErrorSnackbar error={error} onClose={handleErrorClose} />
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </ThemeProvider>
  );
};

export default App;
