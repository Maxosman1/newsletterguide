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
} from '@/components/ui/card';

import {
  Laptop,
  TrendingUp,
  Radio,
  Theater,
  Film,
  Music,
  Globe,
  Users,
  History as HistoryIcon,
  Gamepad2,
  Brain,
  Dumbbell,
  Palette,
  GraduationCap,
  Coffee,
  Heart,
  Headphones
} from 'lucide-react';

const PodcastInterestSelection = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');

  const categories = [
    { name: 'Technology', icon: <Laptop /> },
    { name: 'Business', icon: <TrendingUp /> },
    { name: 'True Crime', icon: <Radio /> },
    { name: 'Comedy', icon: <Theater /> },
    { name: 'Entertainment', icon: <Film /> },
    { name: 'Music', icon: <Music /> },
    { name: 'News', icon: <Globe /> },
    { name: 'Society', icon: <Users /> },
    { name: 'History', icon: <HistoryIcon /> },
    { name: 'Gaming', icon: <Gamepad2 /> },
    { name: 'Science', icon: <Brain /> },
    { name: 'Sports', icon: <Dumbbell /> },
    { name: 'Arts', icon: <Palette /> },
    { name: 'Education', icon: <GraduationCap /> },
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
    <div className="w-full">
      <div className="bg-primary p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Typography variant="h6" className="text-white no-underline">
            PodcastDiscover
          </Typography>
          <Button variant="ghost" className="text-white">Login</Button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            What do you like to listen to?
          </h1>
          <p className="text-gray-600">
            Select 3 topics, preferred length, and listening frequency to get started
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card 
              key={category.name}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedInterests.includes(category.name) ? 'border-2 border-primary' : ''
              }`}
              onClick={() => handleInterestSelect(category.name)}
            >
              <CardContent className="flex flex-col items-center p-4">
                <div className="mb-2 text-gray-600">
                  {category.icon}
                </div>
                <Typography>{category.name}</Typography>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-6">
          <Typography variant="h6" className="mb-4">
            Customize Your Listening Experience
          </Typography>
          
          <div className="mb-6">
            <Typography className="mb-2">
              How long do you like your podcasts?
            </Typography>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setDuration('short')}
                className={duration === 'short' ? 'bg-primary text-white' : ''}
              >
                Short (&lt;30 min)
              </Button>
              <Button
                variant="outline"
                onClick={() => setDuration('medium')}
                className={duration === 'medium' ? 'bg-primary text-white' : ''}
              >
                Medium (30-60 min)
              </Button>
              <Button
                variant="outline"
                onClick={() => setDuration('long')}
                className={duration === 'long' ? 'bg-primary text-white' : ''}
              >
                Long (&gt;60 min)
              </Button>
            </div>
          </div>

          <div>
            <Typography className="mb-2">
              How often do you listen to podcasts?
            </Typography>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setFrequency('daily')}
                className={frequency === 'daily' ? 'bg-primary text-white' : ''}
              >
                Daily
              </Button>
              <Button
                variant="outline"
                onClick={() => setFrequency('weekly')}
                className={frequency === 'weekly' ? 'bg-primary text-white' : ''}
              >
                Weekly
              </Button>
              <Button
                variant="outline"
                onClick={() => setFrequency('occasional')}
                className={frequency === 'occasional' ? 'bg-primary text-white' : ''}
              >
                Occasionally
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <Button
            disabled={!isSelectionComplete}
            className="text-lg"
          >
            <Headphones className="mr-2" />
            {isSelectionComplete ? "Find My Podcasts" : "Complete all selections"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PodcastInterestSelection;
