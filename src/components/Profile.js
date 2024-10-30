import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  Switch,
  Typography,
  Alert,
} from "@mui/material";
import {
  Settings,
  Bookmark,
  Notifications,
  Edit,
  Logout,
  Delete,
} from "@mui/icons-material";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    subscription: "free",
    interests: [],
    savedNewsletters: [],
    notifications: {
      email: true,
      push: false,
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await window.supabase.auth.getUser();

        if (!user) {
          navigate("/login");
          return;
        }

        const { data, error } = await window.supabase
          .from("users")
          .select(
            `
            *,
            saved_newsletters (
              id,
              title,
              author,
              excerpt
            )
          `
          )
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setUserData({
          ...data,
          email: user.email,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleUpdateProfile = async (updatedData) => {
    try {
      const { error } = await window.supabase
        .from("users")
        .update(updatedData)
        .eq("id", userData.id);

      if (error) throw error;

      setUserData((prev) => ({ ...prev, ...updatedData }));
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const { error } = await window.supabase.auth.signOut();
        if (error) throw error;
        navigate("/");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" py={4} px={2} bgcolor="background.default">
      <Box maxWidth="lg" mx="auto">
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6">Error</Typography>
            {error}
          </Alert>
        )}

        <Box display="grid" gap={4}>
          {/* Profile Header */}
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                  {userData.name?.charAt(0).toUpperCase()}
                </Avatar>
              }
              action={
                <IconButton onClick={() => setIsEditing(!isEditing)}>
                  <Edit />
                </IconButton>
              }
              title={<Typography variant="h5">{userData.name}</Typography>}
              subheader={userData.email}
            />
          </Card>

          {/* Subscription Status */}
          <Card>
            <CardHeader avatar={<Settings />} title="Subscription" />
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <div>
                  <Typography variant="subtitle1">
                    Current Plan: {userData.subscription}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    {userData.subscription === "free"
                      ? "Upgrade to Premium for more features!"
                      : "You're on our premium plan"}
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/subscription")}
                >
                  {userData.subscription === "free" ? "Upgrade" : "Manage"}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card>
            <CardHeader
              avatar={<Bookmark />}
              title="Interests"
              action={
                <Button color="primary" onClick={() => navigate("/interests")}>
                  Edit
                </Button>
              }
            />
            <CardContent>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {userData.interests.map((interest, index) => (
                  <Box
                    key={index}
                    px={2}
                    py={0.5}
                    bgcolor="primary.light"
                    color="primary.contrastText"
                    borderRadius="16px"
                  >
                    {interest}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader avatar={<Notifications />} title="Notifications" />
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <div>
                  <Typography variant="subtitle1">
                    Email Notifications
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Get updates about new recommendations
                  </Typography>
                </div>
                <Switch
                  checked={userData.notifications.email}
                  onChange={() =>
                    handleUpdateProfile({
                      notifications: {
                        ...userData.notifications,
                        email: !userData.notifications.email,
                      },
                    })
                  }
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <div>
                  <Typography variant="subtitle1">
                    Push Notifications
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Get browser notifications
                  </Typography>
                </div>
                <Switch
                  checked={userData.notifications.push}
                  onChange={() =>
                    handleUpdateProfile({
                      notifications: {
                        ...userData.notifications,
                        push: !userData.notifications.push,
                      },
                    })
                  }
                />
              </Box>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardContent>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Logout />}
                onClick={() => window.supabase.auth.signOut()}
                sx={{ mb: 2 }}
              >
                Sign Out
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
