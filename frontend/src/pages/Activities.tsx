import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  CircularProgress,
  Chip,
  SelectChangeEvent,
  Pagination
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

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

interface ActivityFormData {
  type: string;
  category: string;
  description: string;
  amount: {
    value: number;
    unit: string;
  };
}

const ACTIVITY_TYPES = [
  { value: 'transport', label: 'Transport' },
  { value: 'energy', label: 'Energy' },
  { value: 'food', label: 'Food' },
  { value: 'waste', label: 'Waste' },
  { value: 'other', label: 'Other' }
];

const ACTIVITY_CATEGORIES = {
  transport: [
    { value: 'car', label: 'Car' },
    { value: 'bus', label: 'Bus' },
    { value: 'train', label: 'Train' },
    { value: 'plane', label: 'Plane' },
    { value: 'bicycle', label: 'Bicycle' }
  ],
  energy: [
    { value: 'electricity', label: 'Electricity' },
    { value: 'natural_gas', label: 'Natural Gas' },
    { value: 'heating_oil', label: 'Heating Oil' }
  ],
  food: [
    { value: 'meat', label: 'Meat' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' }
  ],
  waste: [
    { value: 'general', label: 'General Waste' },
    { value: 'recycling', label: 'Recycling' }
  ],
  other: [
    { value: 'other', label: 'Other' }
  ]
};

const AMOUNT_UNITS = {
  transport: [
    { value: 'km', label: 'Kilometers' },
    { value: 'miles', label: 'Miles' }
  ],
  energy: [
    { value: 'kwh', label: 'Kilowatt Hours' },
    { value: 'm3', label: 'Cubic Meters' },
    { value: 'l', label: 'Liters' }
  ],
  food: [
    { value: 'kg', label: 'Kilograms' },
    { value: 'g', label: 'Grams' }
  ],
  waste: [
    { value: 'kg', label: 'Kilograms' },
    { value: 'g', label: 'Grams' }
  ],
  other: [
    { value: 'unit', label: 'Units' }
  ]
};

const Activities: React.FC = () => {
  const { token } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<ActivityFormData>({
    type: '',
    category: '',
    description: '',
    amount: {
      value: 0,
      unit: ''
    }
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [filterType, setFilterType] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchActivities();
  }, [token, page, filterType]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        page,
        limit: itemsPerPage
      };
      
      if (filterType) {
        params.type = filterType;
      }
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/activities`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params
        }
      );
      
      setActivities(response.data.activities);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities. Please try again later.');
      setLoading(false);
    }
  };

  const handleOpenDialog = (activity?: Activity) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData({
        type: activity.type,
        category: activity.category,
        description: activity.description,
        amount: activity.amount
      });
    } else {
      setEditingActivity(null);
      setFormData({
        type: '',
        category: '',
        description: '',
        amount: {
          value: 0,
          unit: ''
        }
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingActivity(null);
    setFormErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'amount.value') {
      setFormData({
        ...formData,
        amount: {
          ...formData.amount,
          value: parseFloat(value) || 0
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
      setFormData({
        ...formData,
        type: value,
        category: '',
        amount: {
          ...formData.amount,
          unit: ''
        }
      });
    } else if (name === 'category') {
      setFormData({
        ...formData,
        category: value
      });
    } else if (name === 'amount.unit') {
      setFormData({
        ...formData,
        amount: {
          ...formData.amount,
          unit: value
        }
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.type) {
      errors.type = 'Activity type is required';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    if (!formData.description) {
      errors.description = 'Description is required';
    }
    
    if (formData.amount.value <= 0) {
      errors['amount.value'] = 'Amount must be greater than 0';
    }
    
    if (!formData.amount.unit) {
      errors['amount.unit'] = 'Unit is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      if (editingActivity) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/activities/${editingActivity._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/activities`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
      
      handleCloseDialog();
      fetchActivities();
    } catch (err) {
      console.error('Error saving activity:', err);
      setError('Failed to save activity. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/activities/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      fetchActivities();
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError('Failed to delete activity. Please try again.');
    }
  };

  const handleFilterChange = (e: SelectChangeEvent<string>) => {
    setFilterType(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Activities
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Activity
        </Button>
      </Box>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Filter:
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="filter-type-label">Activity Type</InputLabel>
            <Select
              labelId="filter-type-label"
              value={filterType}
              label="Activity Type"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All Types</MenuItem>
              {ACTIVITY_TYPES.map(type => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
      
      {/* Activities List */}
      <Paper>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : activities.length > 0 ? (
          <>
            <List>
              {activities.map((activity, index) => (
                <React.Fragment key={activity._id}>
                  <ListItem>
                    <ListItemText
                      primary={activity.description}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} - {activity.category}
                          </Typography>
                          <br />
                          {activity.amount.value} {activity.amount.unit} • {activity.carbonFootprint.value.toFixed(2)} {activity.carbonFootprint.unit} • {format(new Date(activity.date), 'MMM d, yyyy')}
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog(activity)} sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(activity._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < activities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
            </Box>
          </>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">
              No activities found. Add your first activity to start tracking your carbon footprint.
            </Typography>
          </Box>
        )}
      </Paper>
      
      {/* Add/Edit Activity Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingActivity ? 'Edit Activity' : 'Add New Activity'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!formErrors.type}>
                  <InputLabel id="type-label">Activity Type</InputLabel>
                  <Select
                    labelId="type-label"
                    name="type"
                    value={formData.type}
                    label="Activity Type"
                    onChange={handleSelectChange}
                  >
                    {ACTIVITY_TYPES.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.type && <FormHelperText>{formErrors.type}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth error={!!formErrors.category}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleSelectChange}
                    disabled={!formData.type}
                  >
                    {formData.type && ACTIVITY_CATEGORIES[formData.type as keyof typeof ACTIVITY_CATEGORIES].map(category => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.category && <FormHelperText>{formErrors.category}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount.value"
                  type="number"
                  value={formData.amount.value}
                  onChange={handleInputChange}
                  error={!!formErrors['amount.value']}
                  helperText={formErrors['amount.value']}
                />
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth error={!!formErrors['amount.unit']}>
                  <InputLabel id="unit-label">Unit</InputLabel>
                  <Select
                    labelId="unit-label"
                    name="amount.unit"
                    value={formData.amount.unit}
                    label="Unit"
                    onChange={handleSelectChange}
                    disabled={!formData.type}
                  >
                    {formData.type && AMOUNT_UNITS[formData.type as keyof typeof AMOUNT_UNITS].map(unit => (
                      <MenuItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors['amount.unit'] && <FormHelperText>{formErrors['amount.unit']}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Activities; 