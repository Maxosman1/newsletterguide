// src/components/LandingPage.js

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  Star,
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
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const FloatingParticle = ({ delay }) => (
  <motion.div
    style={{
      position: "absolute",
      width: 8,
      height: 8,
      backgroundColor: "white",
      borderRadius: "50%",
    }}
    initial={{
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: 0,
    }}
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
  const [currentNewsletter, setCurrentNewsletter] = useState(0);
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

  const newsletterShowcase = [
    {
      title: "Tech Bytes",
      description: "Your weekly roundup of the latest in tech.",
    },
    {
      title: "Health Tips",
      description: "Stay informed on health and wellness trends.",
    },
    {
      title: "Finance Daily",
      description: "Daily insights on markets, crypto, and investment.",
    },
  ];

  const testimonials = [
    {
      text: "I've discovered so many amazing writers I never knew existed! The personalized recommendations have completely transformed my reading habits.",
      author: "Sarah M.",
      role: "Tech Enthusiast",
      avatar: "/api/placeholder/64/64",
      rating: 5,
    },
    {
      text: "The recommendations are spot-on. I save hours of searching and find exactly what I want to read.",
      author: "Michael P.",
      role: "Product Manager",
      avatar: "/api/placeholder/64/64",
      rating: 5,
    },
    {
      text: "This platform helped me find my niche community. The content quality is outstanding!",
      author: "Alex K.",
      role: "Content Creator",
      avatar: "/api/placeholder/64/64",
      rating: 5,
    },
  ];

  const pricingTiers = [
    {
      name: "Basic Subscription",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        "Access to weekly recommendations",
        "Save newsletters for later",
        "Limited personalization (5 interest categories)",
      ],
      color: "primary",
      popular: false,
    },
    {
      name: "Premium Subscription",
      monthlyPrice: 4,
      yearlyPrice: 48,
      features: [
        "Daily and weekly recommendations",
        "Advanced personalization",
        "Early access to trending newsletters",
        "Limited promotional placement",
      ],
      color: "secondary",
      popular: true,
    },
    {
      name: "Gold/Pro Subscription",
      monthlyPrice: 12,
      yearlyPrice: 99,
      features: [
        "All Premium features",
        "Gold-tier newsletter placement",
        "In-depth reader engagement analytics",
        "Exclusive support and tips",
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
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.2,
          }}
        >
          {[...Array(30)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 0.2} />
          ))}
        </Box>

        <Container
          sx={{ position: "relative", zIndex: 10, textAlign: "center" }}
        >
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
              Discover the Best of Substack,
              <Box component="span" sx={{ mx: 1, color: "white" }}>
                Tailored Just for You
              </Box>
            </Typography>
            <Typography variant="h6" sx={{ color: "white", mb: 6 }}>
              Find your next favorite newsletter among thousands of amazing
              writers
            </Typography>
            <Button
              component={Link} // Use Link for navigation
              to="/interests" // Navigate to Interest Selection page
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<ArrowRight />}
              sx={{ backgroundColor: "yellow", color: "black" }}
            >
              Get Started
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Newsletter Showcase Carousel */}
      <Box py={10} bgcolor="grey.100">
        <Container>
          <Typography variant="h4" textAlign="center" mb={6}>
            Explore Our Newsletter Highlights
          </Typography>
          <Box display="flex" justifyContent="center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentNewsletter}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                style={{ maxWidth: 600 }}
              >
                <Card sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h5" mb={2}>
                    {newsletterShowcase[currentNewsletter].title}
                  </Typography>
                  <Typography variant="body1">
                    {newsletterShowcase[currentNewsletter].description}
                  </Typography>
                </Card>
              </motion.div>
            </AnimatePresence>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <IconButton
              onClick={() =>
                setCurrentNewsletter(
                  (prev) =>
                    (prev - 1 + newsletterShowcase.length) %
                    newsletterShowcase.length
                )
              }
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={() =>
                setCurrentNewsletter(
                  (prev) => (prev + 1) % newsletterShowcase.length
                )
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
              Simple, Transparent Pricing
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
                            sx={{ mr: 1 }}
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
                      >
                        {tier.popular ? "Popular Choice" : "Choose Plan"}
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
              What Our Users Are Saying
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
