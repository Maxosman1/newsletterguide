import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  FormControl,
  Select,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { UploadFile, CardGiftcard } from "@mui/icons-material";

const SubstackSubmit = () => {
  const [singleSubstack, setSingleSubstack] = useState({
    url: "",
    title: "",
    category: "",
  });
  const [file, setFile] = useState(null);
  const [bulkCategory, setBulkCategory] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const categories = [
    "Finance",
    "Wellness",
    "Art & Design",
    "Music",
    "Literature",
    "Lifestyle",
    "Culture",
    "Photography",
    "Food & Cooking",
    "Science",
    "Fitness",
    "N/A",
  ];

  // Fetch user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        setUser(userData);
      }
    };
    fetchUser();
  }, []);

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const { error } = await supabase.from("substacks").insert([
        {
          title: singleSubstack.title,
          url: singleSubstack.url,
          category: singleSubstack.category,
        },
      ]);

      if (error) throw error;

      setStatus({
        type: "success",
        message: "Your Substack has been successfully submitted!",
      });
      setSingleSubstack({ url: "", title: "", category: "" });

      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
    } catch (error) {
      setStatus({
        type: "error",
        message: "Error submitting Substack: " + error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!file || !user) return;
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // 1. Upload CSV to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from("CSVS")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Update user's subscription status to premium
      const { error: updateError } = await supabase
        .from("users")
        .update({
          subscription_status: "premium",
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setStatus({
        type: "success",
        message:
          "Database submitted successfully! Your account has been upgraded to premium.",
      });
      setFile(null);
      setBulkCategory("");

      // Update local user state
      setUser({
        ...user,
        subscription_status: "premium",
      });

      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
    } catch (error) {
      setStatus({
        type: "error",
        message: "Error processing submission: " + error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <Typography variant="h3" align="center" gutterBottom>
        Submit Your Substack
      </Typography>

      {/* Single Submission Card */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Submit Individual Substack"
          subheader="Share your favorite Substack with the community"
        />
        <CardContent>
          <form onSubmit={handleSingleSubmit}>
            <TextField
              fullWidth
              label="Substack Title"
              value={singleSubstack.title}
              onChange={(e) =>
                setSingleSubstack({
                  ...singleSubstack,
                  title: e.target.value,
                })
              }
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Substack URL"
              type="url"
              placeholder="https://yoursubstack.substack.com"
              value={singleSubstack.url}
              onChange={(e) =>
                setSingleSubstack({
                  ...singleSubstack,
                  url: e.target.value,
                })
              }
              required
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={singleSubstack.category}
                onChange={(e) =>
                  setSingleSubstack({
                    ...singleSubstack,
                    category: e.target.value,
                  })
                }
                label="Category"
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category.toLowerCase()}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <CardActions>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? "Submitting..." : "Submit Substack"}
              </Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>

      {/* Bulk Submission Card */}
      <Card>
        <CardHeader
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CardGiftcard color="primary" />
              <span>Submit Multiple Substacks</span>
            </div>
          }
          subheader={
            <>
              <Typography variant="subtitle1" color="purple">
                Special Offer: Get Premium Status when you submit your database!
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Share your collection of Substacks and get rewarded. Submit a
                CSV file containing Substack URLs and their categories.
              </Typography>
            </>
          }
        />
        <CardContent>
          <form onSubmit={handleBulkSubmit}>
            <FormControl fullWidth margin="normal">
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFile />}
                fullWidth
              >
                {file ? file.name : "Upload CSV File"}
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </Button>
              <Typography variant="caption" color="textSecondary">
                CSV files only
              </Typography>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Default Category (Optional)</InputLabel>
              <Select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                label="Default Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category.toLowerCase()}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="textSecondary">
                If your CSV doesn't include categories, this will be used as the
                default
              </Typography>
            </FormControl>

            <Typography variant="subtitle1" color="primary" sx={{ mt: 2 }}>
              CSV Format Guidelines:
            </Typography>
            <ul>
              <li>
                Include columns for "url", "title", and optionally "category"
              </li>
              <li>Categories can be any of the listed categories above</li>
              <li>URLs should be complete Substack addresses</li>
            </ul>

            <CardActions>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={!file || isLoading || !user}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? "Processing..." : "Submit Database"}
              </Button>
            </CardActions>
          </form>

          {status.message && (
            <Alert severity={status.type} sx={{ mt: 2 }}>
              {status.message}
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubstackSubmit;
