import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { CssBaseline } from "@mui/material";
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
import Profile from "./components/Profile"; // Import the Profile component

// Theme setup
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ff4081",
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Error checking auth status:", error);
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
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <TopNavBar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                ) : (
                  <Navigate to="/recommendations" replace />
                )
              }
            />
            <Route path="/submit-substack" element={<SubstackSubmit />} />

            {/* Subscription routes */}
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

            {/* Interest selection and account creation flow */}
            <Route
              path="/interests"
              element={
                !isAuthenticated ? (
                  <InterestSelection />
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

            {/* Protected routes */}
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <RecommendationFeed />
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

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
};

export default App;
