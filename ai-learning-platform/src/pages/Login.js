import React, { useState } from 'react';
import { 
  Button, 
  TextField, 
  Container, 
  Typography, 
  Box, 
  Paper 
} from '@mui/material';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authService.signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Google Sign-In failed');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
              Login
            </Button>
            
                <Button
                variant="contained" 
                color="primary" 
                fullWidth
                onClick={() => navigate('/signup')} // Navigate instead of calling the component
                >
                  Signup
                </Button>


            <Button 
              variant="outlined" 
              color="secondary" 
              fullWidth
              onClick={handleGoogleSignIn}
            >
              Sign in with Google
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginPage;