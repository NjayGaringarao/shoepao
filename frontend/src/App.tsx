import React, { useState } from "react";
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

const AppContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { error, clearError } = useChat();

  const handleErrorClose = () => {
    clearError();
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        width: "100vw",
      }}
    >
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setSidebarOpen(true)}
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Chatbot
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      <ConversationList
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100%",
          overflow: "auto",
          mt: isMobile ? "64px" : 0,
          alignItems: "center",
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
