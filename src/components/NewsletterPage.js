import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Link,
  CircularProgress,
  Button,
  CardHeader,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NewsletterPage = () => {
  const { url } = useParams();
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        setLoading(true);
        const decodedUrl = decodeURIComponent(url);

        // Convert URL to RSS feed URL
        const feedUrl = decodedUrl.includes("substack.com")
          ? `${decodedUrl.replace(/\/$/, "")}/feed`
          : `${decodedUrl.replace(/\/$/, "")}/feed`;

        const response = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
            feedUrl
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch newsletter content");
        }

        const feedData = await response.json();

        if (feedData.status !== "ok") {
          throw new Error(feedData.message || "Failed to parse RSS feed");
        }

        setNewsletter({
          title: feedData.feed.title,
          description: feedData.feed.description,
          image: feedData.feed.image,
          author: feedData.feed.author,
          articles: feedData.items.map((item) => ({
            title: item.title,
            link: item.link,
            pubDate: new Date(item.pubDate).toLocaleDateString(),
            description: item.description,
            readTime: `${Math.ceil(item.description?.length / 1000)} min read`,
          })),
        });
      } catch (err) {
        console.error("Error fetching newsletter:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, [url]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography color="error">Error loading newsletter: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      {newsletter && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardHeader
              avatar={
                <Avatar
                  src={newsletter.image || "/api/placeholder/40/40"}
                  alt={newsletter.title}
                />
              }
              title={
                <Typography variant="h4" component="h1">
                  {newsletter.title}
                </Typography>
              }
              subheader={newsletter.author}
            />
            {newsletter.description && (
              <CardContent>
                <Typography variant="body1" color="text.secondary">
                  {newsletter.description}
                </Typography>
              </CardContent>
            )}
          </Card>

          <Typography variant="h5" sx={{ mb: 2 }}>
            Recent Articles
          </Typography>

          {newsletter.articles.map((article, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Link
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  underline="hover"
                >
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {article.title}
                  </Typography>
                </Link>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {article.pubDate} · {article.readTime}
                </Typography>

                <Typography variant="body1">
                  {article.description.slice(0, 200)}...
                </Typography>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Box>
  );
};

export default NewsletterPage;
