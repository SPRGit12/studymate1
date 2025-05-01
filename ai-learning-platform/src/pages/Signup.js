import React, { useState } from 'react';
import { 
  Button, 
  TextField, 
  Container, 
  Typography, 
  Box, 
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    educationLevel: '',
    learningGoals: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await authService.signUp(formData.email, formData.password, {
        name: formData.name,
        educationLevel: formData.educationLevel,
        learningGoals: formData.learningGoals
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Education Level</InputLabel>
              <Select
                name="educationLevel"
                value={formData.educationLevel}
                label="Education Level"
                onChange={handleChange}
              >
                <MenuItem value="high-school">High School</MenuItem>
                <MenuItem value="undergraduate">Undergraduate</MenuItem>
                <MenuItem value="graduate">Graduate</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="learningGoals"
              label="Learning Goals"
              multiline
              rows={3}
              value={formData.learningGoals}
              onChange={handleChange}
              fullWidth
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
            >
              Create Account
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default SignupPage;