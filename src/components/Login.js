import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signIn({ email, password });

      if (error) throw error;

      // Assuming user has an account, redirect to Recommendation Feed
      navigate("/recommendations");
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Error logging in: " + error.message);
    }
  };

  const handleSignUp = () => {
    // Redirect to Interest Selection for signup
    navigate("/interests");
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 12, px: 4, backgroundColor: "#f0f4f8" }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
        <Button
          onClick={handleSignUp}
          variant="text"
          color="secondary"
          sx={{ mt: 2 }}
        >
          Don't have an account? Sign Up
        </Button>
      </form>
    </Box>
  );
};

export default Login;
