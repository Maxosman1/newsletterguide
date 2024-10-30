import React, { useState } from "react";
import {
  Laptop,
  LineChart,
  Heart,
  Palette,
  Music,
  BookOpen,
  Coffee,
  Globe,
  Camera,
  Utensils,
  Brain,
  Dumbbell,
  Check,
} from "lucide-react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import AccountCreation from "./AccountCreation"; // Import AccountCreation component

const InterestSelection = () => {
  const [selectedInterests, setSelectedInterests] = useState(new Set());
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const [frequency, setFrequency] = useState("");
  const [contentLength, setContentLength] = useState("");

  const categories = [
    { id: "tech", name: "Technology", icon: Laptop },
    { id: "finance", name: "Finance", icon: LineChart },
    { id: "wellness", name: "Wellness", icon: Heart },
    { id: "art", name: "Art & Design", icon: Palette },
    { id: "music", name: "Music", icon: Music },
    { id: "literature", name: "Literature", icon: BookOpen },
    { id: "lifestyle", name: "Lifestyle", icon: Coffee },
    { id: "culture", name: "Culture", icon: Globe },
    { id: "photography", name: "Photography", icon: Camera },
    { id: "food", name: "Food & Cooking", icon: Utensils },
    { id: "science", name: "Science", icon: Brain },
    { id: "fitness", name: "Fitness", icon: Dumbbell },
  ];

  const toggleInterest = (id) => {
    const newSelected = new Set(selectedInterests);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else if (newSelected.size < 3) {
      newSelected.add(id);
    }
    setSelectedInterests(newSelected);
  };

  const canContinue =
    selectedInterests.size === 3 && frequency && contentLength;

  const handleSaveAndContinue = () => {
    if (canContinue) {
      setShowAccountCreation(true);
    }
  };

  if (showAccountCreation) {
    return (
      <AccountCreation
        selectedInterests={Array.from(selectedInterests)} // Pass interests as an array
        frequency={frequency} // Pass frequency
        contentLength={contentLength} // Pass content length
        toggleAuthView={() => setShowAccountCreation(false)}
      />
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
        py: 12,
        px: 4,
      }}
    >
      <Box maxWidth="lg" mx="auto">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h1" gutterBottom>
            What interests you?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select 3 topics, frequency, and content length to continue
          </Typography>
        </Box>

        {/* Categories Grid */}
        <Grid container spacing={4} mb={6}>
          {categories.map(({ id, name, icon: Icon }) => {
            const isSelected = selectedInterests.has(id);
            return (
              <Grid item xs={6} md={4} lg={3} key={id}>
                <Card
                  variant="outlined"
                  onClick={() => toggleInterest(id)}
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    border: isSelected ? "2px solid #1976d2" : "2px solid #ccc",
                    backgroundColor: isSelected ? "#e3f2fd" : "#fff",
                    "&:hover": {
                      borderColor: "#1976d2",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Icon
                        style={{
                          width: "40px",
                          height: "40px",
                          color: isSelected ? "#1976d2" : "#666",
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: isSelected ? "bold" : "normal",
                          color: isSelected ? "#1976d2" : "#333",
                        }}
                      >
                        {name}
                      </Typography>
                    </Box>
                    {isSelected && (
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "#1976d2",
                          color: "#fff",
                        }}
                      >
                        <Check size={16} />
                      </IconButton>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Customize Your Experience */}
        <Card variant="outlined" sx={{ mb: 6 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customize Your Experience
            </Typography>

            {/* Frequency Preference */}
            <Box mb={4}>
              <Typography variant="body1" gutterBottom>
                How often would you like to receive newsletters?
              </Typography>
              <Box display="flex" gap={2}>
                {["daily", "weekly", "monthly"].map((option) => (
                  <Button
                    key={option}
                    onClick={() => setFrequency(option)}
                    variant={frequency === option ? "contained" : "outlined"}
                    sx={{
                      textTransform: "capitalize",
                      flexGrow: 1,
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Content Length Preference */}
            <Box>
              <Typography variant="body1" gutterBottom>
                Preferred content length
              </Typography>
              <Box display="flex" gap={2}>
                {[
                  { id: "short", label: "Short Reads" },
                  { id: "mixed", label: "Mixed" },
                  { id: "long", label: "In-Depth" },
                ].map(({ id, label }) => (
                  <Button
                    key={id}
                    onClick={() => setContentLength(id)}
                    variant={contentLength === id ? "contained" : "outlined"}
                    sx={{
                      flexGrow: 1,
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <Box textAlign="center">
          <Button
            disabled={!canContinue}
            variant="contained"
            color="primary"
            sx={{
              padding: "12px 24px",
              fontWeight: "bold",
              fontSize: "1.25rem",
            }}
            onClick={handleSaveAndContinue}
          >
            {canContinue ? "Save and Continue" : "Complete all selections"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InterestSelection;
