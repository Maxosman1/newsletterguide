import React, { useState } from "react";
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
} from "@mui/material";
import { UploadFile, CardGiftcard } from "@mui/icons-material"; // Corrected Icons

const SubstackSubmit = () => {
  const [singleSubstack, setSingleSubstack] = useState("");
  const [singleCategory, setSingleCategory] = useState("");
  const [file, setFile] = useState(null);
  const [bulkCategory, setBulkCategory] = useState("");
  const [singleSuccess, setSingleSuccess] = useState(false);
  const [bulkSuccess, setBulkSuccess] = useState(false);

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

  const handleSingleSubmit = (e) => {
    e.preventDefault();
    setSingleSuccess(true);
    setTimeout(() => setSingleSuccess(false), 3000);
    setSingleSubstack("");
    setSingleCategory("");
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    setBulkSuccess(true);
    setTimeout(() => setBulkSuccess(false), 3000);
    setFile(null);
    setBulkCategory("");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <Typography variant="h3" align="center" gutterBottom>
        Submit Your Substack
      </Typography>

      {/* Single Submission Card */}
      <Card>
        <CardHeader
          title="Submit Individual Substack"
          subheader="Share your favorite Substack with the community"
        />
        <CardContent>
          <form onSubmit={handleSingleSubmit}>
            <TextField
              fullWidth
              label="Substack URL"
              type="url"
              placeholder="https://yoursubstack.substack.com"
              value={singleSubstack}
              onChange={(e) => setSingleSubstack(e.target.value)}
              required
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={singleCategory}
                onChange={(e) => setSingleCategory(e.target.value)}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category.toLowerCase()}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <CardActions>
              <Button variant="contained" type="submit" fullWidth>
                Submit Substack
              </Button>
            </CardActions>
          </form>
          {singleSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Your Substack has been successfully submitted!
            </Alert>
          )}
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
                Special Offer: Get a 2-month Free Subscription when you submit
                your database!
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
              <li>Include columns for "url" and optionally "category"</li>
              <li>Categories can be any of the listed categories above</li>
              <li>URLs should be complete Substack addresses</li>
            </ul>

            <CardActions>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={!file}
              >
                Submit Database
              </Button>
            </CardActions>
          </form>

          {bulkSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Your database has been successfully submitted! We'll review your
              submission and activate your 2-month free subscription soon.
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubstackSubmit;
