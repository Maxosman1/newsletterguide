// rssProxyServer.js
const express = require("express");
const cors = require("cors");
const RSSParser = require("rss-parser");
const app = express();
const parser = new RSSParser();

app.use(cors());

app.get("/fetch-rss", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing RSS feed URL" });
  }

  try {
    const feed = await parser.parseURL(url);

    // Check if there are at least 5 articles
    if (feed.items.length < 5) {
      return res.status(400).json({ error: "Not enough articles in the feed" });
    }

    // Enhance article information
    const enhancedArticles = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      content: item.contentSnippet || item.content, // Fallback to full content if snippet is not available
      categories: item.categories || [],
      readTime: calculateReadTime(item.content || item.contentSnippet), // Assuming a function to calculate read time
    }));

    // Prepare the response
    const response = {
      title: feed.title,
      description: feed.description,
      link: feed.link,
      articles: enhancedArticles,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching RSS feed:", error.message);
    res.status(500).json({ error: "Failed to fetch RSS feed" });
  }
});

// Function to calculate read time based on word count
const calculateReadTime = (content) => {
  const wordsPerMinute = 200; // Average reading speed
  const text = content.replace(/<[^>]*>/g, " "); // Remove HTML tags
  const words = text.split(/\s+/).filter((word) => word.length > 0);
  const minutes = Math.ceil(words.length / wordsPerMinute);
  return `${minutes} min read`;
};

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
