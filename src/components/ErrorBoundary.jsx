// src/components/ErrorBoundary.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              p: 3,
              textAlign: "center",
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <Typography variant="h4" gutterBottom color="error">
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              We're sorry for the inconvenience. Please try refreshing the page.
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{
                mt: 2,
                px: 4,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Refresh Page
            </Button>
          </Box>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
