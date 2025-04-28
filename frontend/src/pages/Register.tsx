import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  Paper,
  Divider,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = yup.object({
  name: yup
    .string()
    .min(1, 'Name is required')
    .required('Name is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = React.useState<string>('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await register(values.name, values.email, values.password);
        navigate('/');
      } catch (err: any) {
        setError(err.message || 'Registration failed. Please try again.');
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(120deg, #1e3c72 0%, #2a5298 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glassmorphic Card */}
      <Fade in timeout={600}>
        <Paper
          elevation={24}
          sx={{
            p: 5,
            borderRadius: 6,
            minWidth: { xs: '90vw', sm: 400 },
            maxWidth: 420,
            backdropFilter: 'blur(16px)',
            background: 'rgba(255,255,255,0.15)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            border: '1px solid rgba(255,255,255,0.18)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo/Icon */}
          <Box sx={{ mb: 2 }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#1e3c72"/>
              <path d="M24 36c6.627 0 12-5.373 12-12S30.627 12 24 12 12 17.373 12 24s5.373 12 12 12zm0-4a8 8 0 100-16 8 8 0 000 16z" fill="#fff"/>
            </svg>
          </Box>
          <Typography component="h1" variant="h4" fontWeight={700} color="#fff" gutterBottom>
            Create Account
          </Typography>
          <Typography variant="subtitle1" color="rgba(255,255,255,0.8)" mb={2}>
            Join Carbon Tracker to start your journey
          </Typography>
          {error && (
            <Fade in={!!error}>
              <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                {error}
              </Alert>
            </Fade>
          )}
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ mt: 3, width: '100%' }}
            autoComplete="off"
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
              sx={{
                background: 'rgba(255,255,255,0.7)',
                borderRadius: 2,
                mb: 2,
                input: { color: '#1e3c72', fontWeight: 500, zIndex: 1, background: 'rgba(255,255,255,0.0)' },
                '& .MuiInputLabel-root': {
                  color: '#1e3c72',
                  background: 'rgba(255,255,255,0.7)',
                  px: 0.5,
                  zIndex: 2,
                },
                '& .MuiInputLabel-shrink': {
                  background: 'rgba(255,255,255,0.9)',
                  px: 0.5,
                  zIndex: 2,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused': {
                  background: 'rgba(255,255,255,0.85)',
                },
              }}
              InputLabelProps={{
                style: {
                  background: 'rgba(255,255,255,0.7)',
                  padding: '0 4px',
                  color: '#1e3c72',
                  zIndex: 2,
                },
                shrink: true,
              }}
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
              sx={{
                background: 'rgba(255,255,255,0.7)',
                borderRadius: 2,
                mb: 2,
                input: { color: '#1e3c72', fontWeight: 500, zIndex: 1, background: 'rgba(255,255,255,0.0)' },
                '& .MuiInputLabel-root': {
                  color: '#1e3c72',
                  background: 'rgba(255,255,255,0.7)',
                  px: 0.5,
                  zIndex: 2,
                },
                '& .MuiInputLabel-shrink': {
                  background: 'rgba(255,255,255,0.9)',
                  px: 0.5,
                  zIndex: 2,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused': {
                  background: 'rgba(255,255,255,0.85)',
                },
              }}
              InputLabelProps={{
                style: {
                  background: 'rgba(255,255,255,0.7)',
                  padding: '0 4px',
                  color: '#1e3c72',
                  zIndex: 2,
                },
                shrink: true,
              }}
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
              sx={{
                background: 'rgba(255,255,255,0.7)',
                borderRadius: 2,
                mb: 2,
                input: { color: '#1e3c72', fontWeight: 500, zIndex: 1, background: 'rgba(255,255,255,0.0)' },
                '& .MuiInputLabel-root': {
                  color: '#1e3c72',
                  background: 'rgba(255,255,255,0.7)',
                  px: 0.5,
                  zIndex: 2,
                },
                '& .MuiInputLabel-shrink': {
                  background: 'rgba(255,255,255,0.9)',
                  px: 0.5,
                  zIndex: 2,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused': {
                  background: 'rgba(255,255,255,0.85)',
                },
              }}
              InputLabelProps={{
                style: {
                  background: 'rgba(255,255,255,0.7)',
                  padding: '0 4px',
                  color: '#1e3c72',
                  zIndex: 2,
                },
                shrink: true,
              }}
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword((show) => !show)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
              sx={{
                background: 'rgba(255,255,255,0.7)',
                borderRadius: 2,
                mb: 3,
                input: { color: '#1e3c72', fontWeight: 500, zIndex: 1, background: 'rgba(255,255,255,0.0)' },
                '& .MuiInputLabel-root': {
                  color: '#1e3c72',
                  background: 'rgba(255,255,255,0.7)',
                  px: 0.5,
                  zIndex: 2,
                },
                '& .MuiInputLabel-shrink': {
                  background: 'rgba(255,255,255,0.9)',
                  px: 0.5,
                  zIndex: 2,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused': {
                  background: 'rgba(255,255,255,0.85)',
                },
              }}
              InputLabelProps={{
                style: {
                  background: 'rgba(255,255,255,0.7)',
                  padding: '0 4px',
                  color: '#1e3c72',
                  zIndex: 2,
                },
                shrink: true,
              }}
              variant="outlined"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 1,
                mb: 2,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: '1.1rem',
                background: 'linear-gradient(90deg,#1e3c72 0%,#2a5298 100%)',
                boxShadow: '0 4px 20px 0 rgba(30,60,114,0.25)',
                transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
                '&:hover': {
                  background: 'linear-gradient(90deg,#2a5298 0%,#1e3c72 100%)',
                  boxShadow: '0 6px 32px 0 rgba(30,60,114,0.35)',
                  transform: 'scale(1.03)',
                },
              }}
            >
              Register
            </Button>
            <Divider sx={{ my: 2, color: 'rgba(255,255,255,0.3)' }}>or</Divider>
            <Typography variant="body2" color="rgba(255,255,255,0.9)" align="center" sx={{ mt: 2 }}>
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                underline="hover"
                sx={{ color: '#fff', fontWeight: 700 }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Fade>
      {/* Subtle background shapes/gradients can be added here for extra flair */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Example animated SVG background blob */}
        <svg width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0 }}>
          <ellipse cx="720" cy="-100" rx="900" ry="400" fill="#fff" fillOpacity="0.07">
            <animate attributeName="cy" values="-100;100;-100" dur="14s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="200" cy="700" rx="400" ry="200" fill="#fff" fillOpacity="0.10">
            <animate attributeName="cx" values="200;1240;200" dur="18s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="1240" cy="800" rx="300" ry="120" fill="#fff" fillOpacity="0.09">
            <animate attributeName="cx" values="1240;200;1240" dur="20s" repeatCount="indefinite" />
          </ellipse>
        </svg>
      </Box>
    </Box>
  );
};

export default Register;