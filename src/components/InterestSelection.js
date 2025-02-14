import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  Paper
} from '@mui/material';
import {
  Mic,
  Laptop,
  TrendingUp,
  Heart,
  Palette,
  Music,
  BookOpen,
  Coffee,
  Globe,
  Camera,
  Utensils,
  Brain,
  Dumbbell,
  Radio,
  Headphones,
  Film,
  Award,
  Podcast,
  Gamepad,
  Users,
  History,
  Comedy
} from 'lucide-react';

const PodcastInterestSelection = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');

  const categories = [
    { name: 'Technology', icon: <Laptop /> },
    { name: 'Business', icon: <TrendingUp /> },
    { name: 'True Crime', icon: <Radio /> },
    { name: 'Comedy', icon: <Comedy /> },
    { name: 'Entertainment', icon: <Film /> },
    { name: 'Music', icon: <Music /> },
    { name: 'News', icon: <Globe /> },
    { name: 'Society', icon: <Users /> },
    { name: 'History', icon: <History /> },
    { name: 'Gaming', icon: <Gamepad /> },
    { name: 'Science', icon: <Brain /> },
    { name: 'Sports', icon: <Dumbbell /> },
    { name: 'Arts', icon: <Palette /> },
    { name: 'Education', icon: <BookOpen /> },
    { name: 'Lifestyle', icon: <Coffee /> },
    { name: 'Health', icon: <Heart /> }
  ];

  const handleInterestSelect = (category) => {
    if (selectedInterests.includes(category)) {
      setSelectedInterests(selectedInterests.filter(i => i !== category));
    } else if (selectedInterests.length < 3) {
      setSelectedInterests([...selectedInterests, category]);
    }
  };

  const isSelectionComplete = selectedInterests.length > 0 && frequency && duration;

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="a" href="/" sx={{ color: 'white', textDecoration: 'none' }}>
            PodcastDiscover
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" href="/login">Login</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom>
            What do you like to listen to?
          </Typography>
          <Typography variant="body1">
            Select 3 topics, preferred length, and listening frequency to get started
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid item xs={6} md={4} lg={3} key={category.name}>
              <Card 
                variant="outlined"
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  transform: selectedInterests.includes(category.name) ? 'scale(1.02)' : 'scale(1)',
                  border: selectedInterests.includes(category.name) ? '2px solid #1976d2' : '1px solid rgba(0, 0, 0, 0.12)',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 2
                  }
                }}
                onClick={() => handleInterestSelect(category.name)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ mb: 1, color: '#666', '& > svg': { width: 40, height: 40 } }}>
                      {category.icon}
                    </Box>
                    <Typography>{category.name}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper variant="outlined" sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Customize Your Listening Experience
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              How long do you like your podcasts?
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setDuration('short')}
                sx={{ 
                  borderColor: duration === 'short' ? 'primary.main' : 'grey.300',
                  color: duration === 'short' ? 'primary.main' : 'grey.700'
                }}
              >
                Short (&lt;30 min)
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setDuration('medium')}
                sx={{ 
                  borderColor: duration === 'medium' ? 'primary.main' : 'grey.300',
                  color: duration === 'medium' ? 'primary.main' : 'grey.700'
                }}
              >
                Medium (30-60 min)
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setDuration('long')}
                sx={{ 
                  borderColor: duration === 'long' ? 'primary.main' : 'grey.300',
                  color: duration === 'long' ? 'primary.main' : 'grey.700'
                }}
              >
                Long (&gt;60 min)
              </Button>
            </Box>
          </Box>

          <Box>
            <Typography variant="body1" gutterBottom>
              How often do you listen to podcasts?
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setFrequency('daily')}
                sx={{ 
                  borderColor: frequency === 'daily' ? 'primary.main' : 'grey.300',
                  color: frequency === 'daily' ? 'primary.main' : 'grey.700'
                }}
              >
                Daily
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setFrequency('weekly')}
                sx={{ 
                  borderColor: frequency === 'weekly' ? 'primary.main' : 'grey.300',
                  color: frequency === 'weekly' ? 'primary.main' : 'grey.700'
                }}
              >
                Weekly
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setFrequency('occasional')}
                sx={{ 
                  borderColor: frequency === 'occasional' ? 'primary.main' : 'grey.300',
                  color: frequency === 'occasional' ? 'primary.main' : 'grey.700'
                }}
              >
                Occasionally
              </Button>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!isSelectionComplete}
            size="large"
            startIcon={<Headphones />}
          >
            {isSelectionComplete ? "Find My Podcasts" : "Complete all selections"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PodcastInterestSelection;
