import React from "react";
import {
  Paper,
  Typography,
  Box,
  Container,
  Card,
  CardContent,
  Avatar,
  Stack,
  Link,
} from "@mui/material";
import { AutoStories } from "@mui/icons-material";

const DigestView = ({ digest }) => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Function to convert URLs to clickable links
  const formatTextWithLinks = (text) => {
    // Regex for matching URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split the text by URLs
    const parts = text.split(urlRegex);

    // Match all URLs in the text
    const urls = text.match(urlRegex) || [];

    // Combine parts and URLs
    return parts.map((part, index) => {
      // If this part matches a URL, make it a link
      if (urls.includes(part)) {
        return (
          <Link
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "#0066cc",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
                color: "#004499",
              },
            }}
          >
            {part}
          </Link>
        );
      }
      // Otherwise return the text as is
      return part;
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card elevation={1} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Email Header */}
          <Stack direction="row" spacing={2} alignItems="flex-start" mb={3}>
            <Avatar
              sx={{
                bgcolor: "#f0f0f0",
                color: "#1a1a1a",
                width: 48,
                height: 48,
              }}
            >
              <AutoStories />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#1a1a1a",
                  mb: 0.5,
                }}
              >
                Daily Digest
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#666",
                  fontWeight: 400,
                }}
              >
                {today}
              </Typography>
            </Box>
          </Stack>

          {/* Subject Line */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#1a1a1a",
              mb: 3,
              fontSize: "1.5rem",
            }}
          >
            Your Daily Summary
          </Typography>

          {/* Digest Content */}
          <Box
            sx={{
              maxHeight: "600px",
              overflowY: "auto",
              pr: 2,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(0, 0, 0, 0.03)",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0, 0, 0, 0.15)",
                borderRadius: "3px",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.25)",
                },
              },
            }}
          >
            {digest &&
              digest.split("\n").map((paragraph, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  paragraph
                  sx={{
                    color: "#2c2c2c",
                    lineHeight: 1.7,
                    fontSize: "1rem",
                    "&:last-child": {
                      mb: 0,
                    },
                  }}
                >
                  {formatTextWithLinks(paragraph)}
                </Typography>
              ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DigestView;
