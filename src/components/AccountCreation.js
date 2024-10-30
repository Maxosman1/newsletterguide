import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AccountCreation = ({ selectedInterests, frequency, contentLength }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Sign up the user with Supabase Auth
        const { data: user, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        // Save additional user information in the 'users' table
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: user.user.id, // Use the id from the auth table
            name: formData.name,
            email: formData.email,
            frequency: frequency,
            content_length: contentLength,
            interests: selectedInterests,
          },
        ]);

        if (insertError) throw insertError;

        alert("Account created successfully!");

        // Navigate to the Recommendation Feed
        navigate("/recommendation-feed");
      } catch (error) {
        console.error("Error creating account:", error.message);
        alert("Error creating account: " + error.message);
      }
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 12, px: 4, backgroundColor: "#f0f4f8" }}>
      <Box maxWidth="lg" mx="auto">
        <Typography variant="h4" gutterBottom>
          Create Your Account
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                margin="normal"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                margin="normal"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </IconButton>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                variant="outlined"
                margin="normal"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
              <Box mt={2}>
                <Button type="submit" variant="contained" color="primary">
                  Create Account
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AccountCreation;
