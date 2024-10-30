import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Badge,
} from "@mui/material";
import {
  Check as CheckIcon,
  Star as StarIcon,
  EmojiEvents as CrownIcon,
  StarPurple500 as SparklesIcon,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SubscriptionPage = () => {
  const [billingCycle, setBillingCycle] = useState("yearly");
  const [selectedTier, setSelectedTier] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const pricingTiers = [
    {
      id: "basic",
      name: "Basic",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description:
        "Perfect for exploring newsletters and discovering new content",
      features: [
        "Access to weekly recommendations",
        "Save newsletters for later",
        "5 newsletters per interest category",
        "Basic personalization",
        "Standard support",
      ],
      icon: <StarIcon />,
      color: "blue",
      popular: false,
    },
    {
      id: "premium",
      name: "Premium",
      monthlyPrice: 9.99,
      yearlyPrice: 99,
      description: "Enhanced features for the dedicated newsletter enthusiast",
      features: [
        "All Basic features",
        "Daily and weekly recommendations",
        "15 newsletters per interest category",
        "Advanced personalization",
        "Early access to trending newsletters",
        "Priority support",
        "Ad-free experience",
      ],
      icon: <CrownIcon />,
      color: "yellow",
      popular: true,
    },
    {
      id: "pro",
      name: "Pro",
      monthlyPrice: 29.99,
      yearlyPrice: 299,
      description: "Ultimate package for power users and creators",
      features: [
        "All Premium features",
        "Unlimited newsletters per category",
        "Early access to new features",
        "Exclusive newsletter events",
        "AI-powered content suggestions",
        "Premium analytics dashboard",
        "24/7 priority support",
        "Custom reading lists",
      ],
      icon: <SparklesIcon />,
      color: "purple",
      popular: false,
    },
  ];

  const handleSelectTier = (tierId) => {
    setSelectedTier(tierId);
    console.log(`Selected tier: ${tierId}`);
    navigate(`/subscription-details/${tierId}`); // Navigate to subscription details with the selected tier
  };

  const Feature = ({ text }) => (
    <Box display="flex" alignItems="center" py={1}>
      <CheckIcon color="success" />
      <Typography variant="body2" color="textSecondary" ml={1}>
        {text}
      </Typography>
    </Box>
  );

  return (
    <Box minHeight="100vh" bgcolor="grey.50" py={6} px={2}>
      <Box maxWidth="lg" mx="auto">
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Choose Your Perfect Plan
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Unlock the full potential of your newsletter discovery journey
          </Typography>

          {/* Billing Toggle */}
          <Box display="flex" justifyContent="center" mb={4}>
            <Button
              variant="contained"
              onClick={() => setBillingCycle("monthly")}
              color={billingCycle === "monthly" ? "primary" : "default"}
              sx={{ mr: 2 }}
            >
              Monthly
            </Button>
            <Button
              variant="contained"
              onClick={() => setBillingCycle("yearly")}
              color={billingCycle === "yearly" ? "primary" : "default"}
            >
              Yearly <span style={{ color: "green" }}>(Save 20%)</span>
            </Button>
          </Box>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={4}>
          {pricingTiers.map((tier) => (
            <Grid item xs={12} md={4} key={tier.id}>
              <Card
                variant="outlined"
                sx={{
                  position: "relative",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                  border: tier.popular ? "2px solid yellow" : "none",
                }}
              >
                {tier.popular && (
                  <Badge
                    color="warning"
                    badgeContent="Most Popular"
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    sx={{ position: "absolute", top: 16, right: 16 }}
                  />
                )}
                <CardHeader
                  avatar={tier.icon}
                  title={
                    <Typography variant="h5" component="div">
                      {tier.name}
                    </Typography>
                  }
                  sx={{ bgcolor: tier.color, color: "white" }}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    {tier.description}
                  </Typography>
                  <Typography variant="h4" gutterBottom>
                    $
                    {billingCycle === "monthly"
                      ? tier.monthlyPrice
                      : tier.yearlyPrice}
                    <span style={{ color: "grey" }}>
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                  </Typography>
                  <Button
                    variant="contained"
                    color={tier.popular ? "warning" : "primary"}
                    fullWidth
                    onClick={() => handleSelectTier(tier.id)} // Navigate to subscription details
                  >
                    {tier.monthlyPrice === 0 ? "Get Started" : "Subscribe Now"}
                  </Button>
                  <Box mt={2}>
                    {tier.features.map((feature, index) => (
                      <Feature key={index} text={feature} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SubscriptionPage;
