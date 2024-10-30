import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Tabs,
  Tab,
  CircularProgress,
  Box,
  Typography,
  styled,
  Skeleton,
  IconButton,
  Collapse,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { supabase } from "../supabaseClient";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiTabs-flexContainer": {
    justifyContent: "space-between",
    width: "100%",
  },
  "& .MuiTab-root": {
    fontSize: "1.1rem",
    padding: "16px 32px",
    minHeight: 64,
    fontWeight: 600,
    minWidth: "auto",
    flex: 1,
  },
}));

const SubscriptionBanner = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: theme.shadows[1],
}));

const NewsletterSkeleton = () => (
  <Card variant="outlined" sx={{ mb: 2 }}>
    <CardHeader
      avatar={<Skeleton variant="circular" width={40} height={40} />}
      title={<Skeleton variant="text" width="60%" />}
      subheader={<Skeleton variant="text" width="40%" />}
    />
    <Skeleton variant="rectangular" height={140} />
    <CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="rounded" width={100} height={36} />
      </Box>
      <Skeleton variant="text" count={3} />
    </CardContent>
  </Card>
);

const EmptyState = ({ message, icon }) => (
  <Box
    sx={{
      textAlign: "center",
      py: 8,
      px: 2,
      bgcolor: "background.paper",
      borderRadius: 1,
      boxShadow: 1,
    }}
  >
    {icon}
    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
      {message}
    </Typography>
  </Box>
);

const RecommendationFeed = () => {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState(new Set());
  const [feedback, setFeedback] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [subscriptionTier, setSubscriptionTier] = useState("free");
  const [interests, setInterests] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalNewsletters, setTotalNewsletters] = useState(0);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("User not logged in");
        return;
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("subscription_status, interests")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error.message);
      } else {
        setSubscriptionTier(userData.subscription_status);
        setInterests(userData.interests || []);
        setActiveTab(0);
      }
    };
    fetchUserData();
  }, []);

  // Fetch recommendations based on active interest
  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    const selectedInterest = interests[activeTab];
    const limit = subscriptionTier.toLowerCase() === "free" ? 5 : 15;

    if (selectedInterest) {
      try {
        const { count } = await supabase
          .from("substack_newsletters")
          .select("id", { count: "exact" })
          .ilike("interests", `%${selectedInterest}%`);

        setTotalNewsletters(count || 0);

        const { data, error } = await supabase
          .from("substack_newsletters")
          .select("*")
          .ilike("interests", `%${selectedInterest}%`)
          .limit(limit);

        if (error) throw new Error(error.message);

        const shuffled = data.sort(() => 0.5 - Math.random());
        setRecommendations(shuffled);
      } catch (err) {
        console.error("Error fetching newsletters:", err.message);
        setError(err);
      }
    } else {
      setRecommendations([]);
      setTotalNewsletters(0);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (interests.length > 0) fetchRecommendations();
  }, [activeTab, interests, subscriptionTier]);

  const toggleSave = (id) => {
    setSavedItems((prev) => {
      const newSavedItems = new Set(prev);
      newSavedItems.has(id) ? newSavedItems.delete(id) : newSavedItems.add(id);
      return newSavedItems;
    });
  };

  const giveFeedback = (id, type) => {
    setFeedback((prev) => ({ ...prev, [id]: type }));
  };

  const handleSubscribe = () => {
    navigate("/subscription");
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NewsletterCard = ({ item }) => (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        cursor: "pointer",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
      onClick={() => setExpandedCard(expandedCard === item.id ? null : item.id)}
    >
      <CardHeader
        title={item.title}
        subheader={
          <Typography variant="body2" color="text.secondary">
            {item.interests}
          </Typography>
        }
      />
      <CardMedia
        component="img"
        height="140"
        image={item.image_url || "/api/placeholder/400/200"}
        alt={item.title}
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar alt={item.author} src="/api/placeholder/32/32" />
            <Typography variant="subtitle2">{item.author}</Typography>
          </Box>
          <Button variant="outlined" onClick={() => toggleSave(item.id)}>
            {savedItems.has(item.id) ? "Saved" : "Save"}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {item.read_time} · {item.subscribers.toLocaleString()} subscribers
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {item.excerpt}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={() => giveFeedback(item.id, "like")}
              variant="outlined"
              color="success"
              size="small"
              startIcon={<StarIcon />}
            >
              Like
            </Button>
            <Button
              onClick={() => giveFeedback(item.id, "dislike")}
              variant="outlined"
              color="error"
              size="small"
            >
              Dislike
            </Button>
          </Box>
          {feedback[item.id] && (
            <Typography variant="body2" color="text.secondary">
              {feedback[item.id] === "like"
                ? "Thanks for liking!"
                : "Sorry to hear that!"}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ padding: 3 }}>
      <SubscriptionBanner>
        <Typography variant="h6">
          {subscriptionTier === "free"
            ? "Subscribe to see more recommendations"
            : "Premium User"}
        </Typography>
        <Button variant="contained" onClick={handleSubscribe}>
          {subscriptionTier === "free" ? "Subscribe" : "Manage Subscription"}
        </Button>
      </SubscriptionBanner>

      <StyledTabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
      >
        {interests.map((interest, index) => (
          <Tab key={index} label={interest} />
        ))}
      </StyledTabs>

      {loading ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : error ? (
        <EmptyState
          message="Error loading recommendations. Please try again later."
          icon={<ArrowUpwardIcon />}
        />
      ) : recommendations.length === 0 ? (
        <EmptyState
          message="No recommendations found for this interest."
          icon={<ArrowUpwardIcon />}
        />
      ) : (
        recommendations.map((item) => (
          <NewsletterCard key={item.id} item={item} />
        ))
      )}

      {showBackToTop && (
        <Button
          variant="contained"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          sx={{ position: "fixed", bottom: 16, right: 16 }}
        >
          Back to Top
        </Button>
      )}
    </Box>
  );
};

export default RecommendationFeed;
