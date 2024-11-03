import React, { useEffect, useState } from "react";
import { fetchNewsletters } from "../services/rssService";
import DigestView from "./DigestView";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Snackbar,
  Box,
  Collapse,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const RecommendationFeed = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [digest, setDigest] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewType, setViewType] = useState("grid");
  const [showArticles, setShowArticles] = useState(false);

  useEffect(() => {
    const loadNewsletters = async () => {
      setLoading(true);
      try {
        const { newsletters: fetchedNewsletters, digest: fetchedDigest } =
          await fetchNewsletters();
        setNewsletters(fetchedNewsletters || []);
        setDigest(fetchedDigest || "");
      } catch (err) {
        console.error("Failed to load newsletters:", err);
        setError("Failed to load newsletters. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadNewsletters();
  }, []);

  const handleCloseSnackbar = () => {
    setError("");
  };

  const getArticleImage = (article) => {
    if (article.enclosure?.url) {
      return article.enclosure.url;
    }

    const imgRegex = /<img[^>]+src="([^">]+)"/;
    if (article.content) {
      const match = article.content.match(imgRegex);
      return match ? match[1] : null;
    }

    return null;
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, my: 3 }}>
        Your Daily Newsletter Digest
      </Typography>

      {digest && <DigestView digest={digest} />}

      {/* Toggle Button for Articles */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          my: 4,
          borderTop: "1px solid #eaeaea",
          pt: 4,
        }}
      >
        <Button
          variant="outlined"
          onClick={() => setShowArticles(!showArticles)}
          endIcon={
            showArticles ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
          }
          sx={{
            borderRadius: "20px",
            px: 3,
            py: 1,
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          {showArticles ? "Hide Full Articles" : "Show Full Articles"}
        </Button>
      </Box>

      {/* Collapsible Articles Section */}
      <Collapse in={showArticles}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Full Articles
            </Typography>
            <Button
              variant="contained"
              onClick={() => setViewType(viewType === "grid" ? "list" : "grid")}
              size="small"
            >
              {viewType === "grid" ? "List View" : "Grid View"}
            </Button>
          </Box>

          {Array.isArray(newsletters) && newsletters.length === 0 ? (
            <Typography>No newsletters available.</Typography>
          ) : (
            <Grid container spacing={3}>
              {newsletters.map((newsletter) => (
                <Grid item xs={12} sm={6} md={4} key={newsletter.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {newsletter.feedImage && (
                      <CardMedia
                        component="img"
                        alt={`${newsletter.title} logo`}
                        height="140"
                        image={newsletter.feedImage}
                        sx={{ objectFit: "cover" }}
                      />
                    )}
                    <CardContent>
                      <Typography
                        variant="h5"
                        component="div"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          color: "#1a1a1a",
                        }}
                      >
                        {newsletter.title}
                        <Typography
                          component="span"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          ({newsletter.category})
                        </Typography>
                      </Typography>

                      {newsletter.articles.length === 0 ? (
                        <Typography>
                          No articles available for this newsletter.
                        </Typography>
                      ) : (
                        newsletter.articles.map((article) => (
                          <Box key={article.link} sx={{ mb: 4 }}>
                            {getArticleImage(article) && (
                              <CardMedia
                                component="img"
                                height="200"
                                image={getArticleImage(article)}
                                alt={article.title}
                                sx={{
                                  borderRadius: 1,
                                  mb: 2,
                                }}
                              />
                            )}
                            <Typography
                              variant="h6"
                              component="h3"
                              sx={{
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                lineHeight: 1.3,
                                mb: 1,
                                color: "#1a1a1a",
                              }}
                            >
                              {article.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                mb: 1,
                                color: "#2c2c2c",
                                lineHeight: 1.6,
                              }}
                            >
                              {article.description}
                            </Typography>
                            <Typography
                              variant="caption"
                              display="block"
                              sx={{ mb: 1 }}
                            >
                              By {article.author || "Unknown"}
                            </Typography>
                            <Button
                              href={article.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="outlined"
                              size="small"
                              sx={{ mt: 1 }}
                            >
                              Read more
                            </Button>
                          </Box>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Collapse>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
      />
    </Container>
  );
};

export default RecommendationFeed;
