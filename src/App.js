import React, { useState, useEffect, useMemo } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { motion, AnimatePresence } from "framer-motion";
import {
  CssBaseline,
  Box,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { supabase } from "./supabaseClient";

// Import components
import LandingPage from "./components/LandingPage";
import InterestSelection from "./components/InterestSelection";
import AccountCreation from "./components/AccountCreation";
import RecommendationFeed from "./components/RecommendationFeed";
import SubstackSubmit from "./components/SubstackSubmit";
import Login from "./components/Login";
import TopNavBar from "./components/TopNavBar";
import SubscriptionPage from "./components/SubscriptionPage";
import Profile from "./components/Profile";
import NewsletterPage from "./components/NewsletterPage";
import ErrorBoundary from "./components/ErrorBoundary";

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Theme configuration
const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#1976d2" },
      secondary: { main: "#ff4081" },
      background: {
        default: mode === "dark" ? "#121212" : "#f5f5f5",
        paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
          },
        },
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
    },
  });

// Loading component
const LoadingScreen = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      bgcolor: "background.default",
    }}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CircularProgress />
    </motion.div>
  </Box>
);

// Protected route component with animation
const ProtectedRoute = ({ children, isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Page transition wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    checkAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <CssBaseline />
          <ErrorBoundary>
            <Router>
              <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
                <TopNavBar
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                  toggleTheme={toggleTheme}
                  mode={mode}
                />
                <Box
                  component="main"
                  sx={{
                    maxWidth: "lg",
                    mx: "auto",
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 2, sm: 3, md: 4 },
                  }}
                >
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <PageTransition>
                            <LandingPage />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/login"
                        element={
                          !isAuthenticated ? (
                            <PageTransition>
                              <Login setIsAuthenticated={setIsAuthenticated} />
                            </PageTransition>
                          ) : (
                            <Navigate to="/recommendations" replace />
                          )
                        }
                      />
                      <Route
                        path="/submit-substack"
                        element={
                          <PageTransition>
                            <SubstackSubmit />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/subscription"
                        element={
                          <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <SubscriptionPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/subscription-details/:tierId"
                        element={
                          <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <SubscriptionPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/interests"
                        element={
                          !isAuthenticated ? (
                            <PageTransition>
                              <InterestSelection />
                            </PageTransition>
                          ) : (
                            <Navigate to="/recommendations" replace />
                          )
                        }
                      />
                      <Route
                        path="/account-creation"
                        element={
                          <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <AccountCreation />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/recommendations"
                        element={
                          <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <RecommendationFeed />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/newsletter/:url"
                        element={
                          <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <NewsletterPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="*"
                        element={
                          <PageTransition>
                            <Navigate to="/" replace />
                          </PageTransition>
                        }
                      />
                    </Routes>
                  </AnimatePresence>
                </Box>
              </Box>
            </Router>
          </ErrorBoundary>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
