import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
    console.log('Dashboard mounted - Token:', token);
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

  // Animated gradient background CSS
  const dashboardBg = {
    minHeight: '100vh',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: -1,
    background: 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)', // softer blue-white gradient
    backgroundSize: '400% 400%',
    animation: 'gradientBG 18s ease infinite',
    overflow: 'hidden',
  };

  const vignetteOverlay = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: -1,
    background: 'radial-gradient(ellipse at center, rgba(220,220,255,0.15) 0%, rgba(30,60,114,0.03) 70%, rgba(30,60,114,0.12) 100%)',
  };

  const glassCard = {
    backdropFilter: 'blur(16px) saturate(180%)',
    background: 'rgba(255,255,255,0.55)',
    borderRadius: '28px',
    border: '1.5px solid rgba(200,200,255,0.21)',
    boxShadow: '0 8px 32px 0 rgba(31,38,135,0.13)',
    padding: '2.5rem',
    marginBottom: '2rem',
  };

  const sectionCard = {
    ...glassCard,
    background: 'rgba(255,255,255,0.85)',
    boxShadow: '0 2px 16px 0 rgba(30,60,114,0.07)',
    border: '1.5px solid rgba(210,220,255,0.18)',
    padding: '2rem',
  };

  // Add keyframes for gradient animation
  const gradientKeyframes = `@keyframes gradientBG {
    0% {background-position: 0% 50%;}
    50% {background-position: 100% 50%;}
    100% {background-position: 0% 50%;}
  }`;

  if (typeof document !== 'undefined' && !document.getElementById('dashboard-gradient-keyframes')) {
    const style = document.createElement('style');
    style.id = 'dashboard-gradient-keyframes';
    style.innerHTML = gradientKeyframes;
    document.head.appendChild(style);
  }

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
    <Box sx={{ minHeight: '100vh', width: '100%', position: 'relative', overflowX: 'clip', overflowY: 'auto' }}>
      {/* Animated gradient background */}
      <Box sx={dashboardBg} />
      <Box sx={vignetteOverlay} />
      {/* Main glassmorphic card */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', pt: 8, pb: 6, width: '100%', overflowX: 'clip' }}>
        <Box sx={{ width: '100%', maxWidth: 900, px: { xs: 1, sm: 2 }, overflow: 'hidden' }}>
          <Paper elevation={0} sx={glassCard}>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 2, color: '#2a5298', letterSpacing: 1, textShadow: '0 2px 12px #e0eafc99' }}>
              Dashboard
            </Typography>
            <Divider sx={{ mb: 3, background: 'rgba(30,60,114,0.10)' }} />
            {/* Carbon Footprint Overview */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ ...sectionCard, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TrendingDownIcon sx={{ fontSize: 38, color: 'success.main', mr: 1, filter: 'drop-shadow(0 2px 8px #2ecc40aa)' }} />
                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ color: '#2ecc40' }}>
                      Total Carbon Footprint
                    </Typography>
                  </Box>
                  <Typography variant="h2" fontWeight={700} sx={{ color: '#2a5298', letterSpacing: 1, mb: 1, textShadow: '0 2px 8px #a1c4fd33' }}>
                    {carbonData?.total.value.toFixed(1)} {carbonData?.total.unit}
                  </Typography>
                </Card>
                <Card elevation={0} sx={sectionCard}>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#f39c12' }}>
                    <TimelineIcon sx={{ mr: 1, color: '#f39c12' }} /> Carbon Footprint by Category
                  </Typography>
                  <Box sx={{ height: 200 }}>
                    {getChartData() && <Line 
                      data={getChartData()!} 
                      options={{ 
                        maintainAspectRatio: false, 
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { beginAtZero: true, grid: { color: 'rgba(30,60,114,0.07)' } },
                          x: { grid: { color: 'rgba(30,60,114,0.07)' } }
                        }
                      }} 
                    />}
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={sectionCard}>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2a5298' }}>
                    <TrendingUpIcon sx={{ mr: 1, color: '#2a5298' }} /> Recent Activities
                  </Typography>
                  <List sx={{ maxHeight: 330, overflowY: 'auto', pr: 1 }}>
                    {Array.isArray(recentActivities) && recentActivities.length === 0 ? (
                      <ListItem>
                        <ListItemText primary={<Typography color="textSecondary">No recent activities.</Typography>} />
                      </ListItem>
                    ) : (
                      Array.isArray(recentActivities) ? recentActivities.map((activity) => (
                        <ListItem key={activity._id} sx={{ mb: 1, borderRadius: 2, background: 'rgba(245,248,255,0.65)', boxShadow: '0 2px 8px 0 rgba(30,60,114,0.06)' }}>
                          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                            {getActivityIcon(activity.type)}
                          </Box>
                          <ListItemText
                            primary={<Typography fontWeight={600} sx={{ color: '#2a5298' }}>{activity.description}</Typography>}
                            secondary={
                              <Typography component="span" variant="caption" color="#888">
                                {format(new Date(activity.date), 'dd MMM yyyy')} • {activity.type} • {activity.amount.value} {activity.amount.unit}
                              </Typography>
                            }
                          />
                        </ListItem>
                      )) : null
                    )}
                  </List>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;