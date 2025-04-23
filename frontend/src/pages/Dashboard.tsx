import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  Timeline as TimelineIcon, 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  LocalShipping as TransportIcon,
  Home as HomeIcon,
  Restaurant as FoodIcon,
  Delete as WasteIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface CarbonData {
  total: {
    value: number;
    unit: string;
  };
  byType: {
    [key: string]: number;
  };
}

interface Activity {
  _id: string;
  type: string;
  category: string;
  description: string;
  amount: {
    value: number;
    unit: string;
  };
  carbonFootprint: {
    value: number;
    unit: string;
  };
  date: string;
}

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [carbonData, setCarbonData] = useState<CarbonData | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch carbon footprint data
        const carbonResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/carbon/total`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setCarbonData(carbonResponse.data);
        
        // Fetch recent activities
        const activitiesResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/activities`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { limit: 5 }
          }
        );
        setRecentActivities(activitiesResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transport':
        return <TransportIcon />;
      case 'energy':
        return <HomeIcon />;
      case 'food':
        return <FoodIcon />;
      case 'waste':
        return <WasteIcon />;
      default:
        return <TimelineIcon />;
    }
  };

  const getChartData = () => {
    if (!carbonData) return null;
    
    const labels = Object.keys(carbonData.byType);
    const data = Object.values(carbonData.byType);
    
    return {
      labels,
      datasets: [
        {
          label: 'Carbon Footprint by Category',
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Carbon Footprint Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Total Carbon Footprint
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={120}
                  thickness={4}
                  sx={{ color: 'grey.200' }}
                />
                <CircularProgress
                  variant="determinate"
                  value={70}
                  size={120}
                  thickness={4}
                  sx={{ position: 'absolute', color: 'primary.main' }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" component="div" color="text.secondary">
                    {carbonData?.total.value.toFixed(1)} {carbonData?.total.unit}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Carbon Footprint by Category
            </Typography>
            <Box sx={{ height: '200px' }}>
              {getChartData() && <Line data={getChartData()!} options={{ maintainAspectRatio: false }} />}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Recent Activities */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activities
        </Typography>
        <List>
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <React.Fragment key={activity._id}>
                <ListItem>
                  <Box sx={{ mr: 2 }}>
                    {getActivityIcon(activity.type)}
                  </Box>
                  <ListItemText
                    primary={activity.description}
                    secondary={`${activity.amount.value} ${activity.amount.unit} - ${activity.carbonFootprint.value.toFixed(2)} ${activity.carbonFootprint.unit} - ${format(new Date(activity.date), 'MMM d, yyyy')}`}
                  />
                </ListItem>
                {index < recentActivities.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No activities recorded yet" />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default Dashboard; 