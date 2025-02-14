import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Star,
  Play,
} from "lucide-react";
import {
  Box,
  Button,
  Container,
  Typography,
  IconButton,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";

const FloatingParticle = ({ delay }) => (
  <motion.div
    style={{
      position: "absolute",
      width: 8,
      height: 8,
      backgroundColor: "white",
      borderRadius: "50%",
    }}
    initial={{ x: Math.random() * 100, y: Math.random() * 100, opacity: 0 }}
    animate={{
      y: [0, -100, 0],
      x: [0, Math.random() * 50 - 25, 0],
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      delay: delay,
    }}
  />
);

const LandingPage = () => {
  const [currentPodcast, setCurrentPodcast] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [billingCycle, setBillingCycle] = useState("yearly");
  const [isVisible, setIsVisible] = useState({
    pricing: false,
    testimonials: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.2 }
    );

    ["pricing", "testimonials"].forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const podcastShowcase = [
    {
      title: "Tech Talk Daily",
      description: "Deep dives into the latest tech innovations and trends.",
      duration: "45 min episodes",
    },
    {
      title: "True Crime Stories",
      description: "Investigative journalism meets storytelling.",
      duration: "60 min episodes",
    },
    {
      title: "Mindful Moments",
      description: "Daily wellness and meditation guidance.",
      duration: "15 min episodes",
    },
  ];

  const testimonials = [
    {
      text: "Finally, a podcast app that understands my taste! The recommendations are spot-on, and I've discovered so many great shows I would have never found otherwise.",
      author: "James K.",
      role: "Daily Commuter",
      avatar: "/api/placeholder/64/64",
      rating: 5,
    },
    {
      text: "The personalized playlists make my workouts amazing. It's like having a personal podcast curator!",
      author: "Lisa M.",
      role: "Fitness Enthusiast",
      avatar: "/api/placeholder/64/64",
      rating: 5,
    },
    {
      text: "I love how it suggests shorter podcasts for my lunch breaks and longer ones for my weekend walks.",
      author: "David R.",
      role: "Busy Professional",
      avatar: "/api/placeholder/64/64",
      rating: 5,
    },
  ];

  const pricingTiers = [
    {
      name: "Free Listener",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "Basic podcast recommendations",
        "Listen to unlimited podcasts",
        "Create basic playlists",
        "Basic discovery tools",
      ],
      color: "primary",
      popular: false,
    },
    {
      name: "Premium Listener",
      monthlyPrice: 4.99,
      yearlyPrice: 49.99,
      features: [
        "Advanced AI recommendations",
        "Offline downloads",
        "Ad-free listening experience",
        "Custom playlists and queues",
        "Early access to new features",
      ],
      color: "secondary",
      popular: true,
    },
    {
      name: "Power Listener",
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      features: [
        "All Premium features",
        "Exclusive podcast content",
        "Priority access to live episodes",
        "Advanced audio quality",
        "Personal podcast curator",
        "Cross-platform sync",
      ],
      color: "warning",
      popular: false,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, opacity: 0.2 }}>
          {[...Array(30)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 0.2} />
          ))}
        </Box>

        <Container sx={{ position: "relative", zIndex: 10, textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{ fontSize: { xs: 48, md: 80 }, mb: 3, color: "white" }}
            >
              Your Perfect Podcast
              <Box component="span" sx={{ mx: 1, color: "white" }}>
                Is Waiting to Be Discovered
              </Box>
            </Typography>
            <Typography variant="h6" sx={{ color: "white", mb: 6 }}>
              AI-powered recommendations for every moment of your day
            </Typography>
            <Button
              component={Link}
              to="/interests"
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<Headphones />}
              sx={{ backgroundColor: "yellow", color: "black" }}
            >
              Start Listening
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Podcast Showcase Carousel */}
      <Box py={10} bgcolor="grey.100">
        <Container>
          <Typography variant="h4" textAlign="center" mb={6}>
            Featured Podcasts
          </Typography>
          <Box display="flex" justifyContent="center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPodcast}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                style={{ maxWidth: 600 }}
              >
                <Card sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h5" mb={2}>
                    {podcastShowcase[currentPodcast].title}
                  </Typography>
                  <Typography variant="body1" mb={2}>
                    {podcastShowcase[currentPodcast].description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {podcastShowcase[currentPodcast].duration}
                  </Typography>
                </Card>
              </motion.div>
            </AnimatePresence>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <IconButton
              onClick={() =>
                setCurrentPodcast(
                  (prev) =>
                    (prev - 1 + podcastShowcase.length) % podcastShowcase.length
                )
              }
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={() =>
                setCurrentPodcast((prev) => (prev + 1) % podcastShowcase.length)
              }
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box id="pricing" py={10}>
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible.pricing ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h3" textAlign="center" mb={4}>
              Choose Your Listening Experience
            </Typography>
            <ToggleButtonGroup
              value={billingCycle}
              exclusive
              onChange={(e, value) => setBillingCycle(value || billingCycle)}
              sx={{ display: "flex", justifyContent: "center", mb: 8 }}
            >
              <ToggleButton value="monthly">Monthly</ToggleButton>
              <ToggleButton value="yearly">Yearly (Save 20%)</ToggleButton>
            </ToggleButtonGroup>
            <Grid container spacing={4}>
              {pricingTiers.map((tier, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        {tier.name}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        $
                        {billingCycle === "monthly"
                          ? tier.monthlyPrice
                          : tier.yearlyPrice}{" "}
                        {billingCycle === "yearly" && "/ year"}
                      </Typography>
                      <Box mt={2}>
                        {tier.features.map((feature, idx) => (
                          <Chip
                            key={idx}
                            label={feature}
                            variant="outlined"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        component={Link}
                        to="/interests"
                        variant="contained"
                        color={tier.color}
                        fullWidth
                        startIcon={<Play />}
                      >
                        {tier.popular ? "Most Popular" : "Get Started"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box id="testimonials" py={10} bgcolor="grey.100">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible.testimonials ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h3" textAlign="center" mb={4}>
              What Our Listeners Say
            </Typography>
            <Box display="flex" justifyContent="center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  style={{ maxWidth: 600, textAlign: "center" }}
                >
                  <Typography variant="body1" mb={2}>
                    "{testimonials[currentTestimonial].text}"
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    - {testimonials[currentTestimonial].author},{" "}
                    <span style={{ fontStyle: "italic" }}>
                      {testimonials[currentTestimonial].role}
                    </span>
                  </Typography>
                  <Avatar
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].author}
                    sx={{ mx: "auto", mt: 2 }}
                  />
                </motion.div>
              </AnimatePresence>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <IconButton
                onClick={() =>
                  setCurrentTestimonial(
                    (prev) =>
                      (prev - 1 + testimonials.length) % testimonials.length
                  )
                }
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={() =>
                  setCurrentTestimonial(
                    (prev) => (prev + 1) % testimonials.length
                  )
                }
              >
                <ChevronRight />
              </IconButton>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
