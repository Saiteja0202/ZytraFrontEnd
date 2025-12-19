import { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../API/AuthUtils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  loginUser,
  generateOtp,
  verifyForgotUsernameOtp,
  verifyForgotPasswordOtp,
  updateForgotPassword,
} from '../API/UserAPIs';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const UserLogin = () => {
  const [formData, setFormData] = useState({ userName: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [showNewPasswordDialog, setShowNewPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [verifiedUserId, setVerifiedUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    logout(); 
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => formData.userName.trim() && formData.password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser(formData);
      const { token, userId, role } = response.data;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('role', role);

      window.alert('Login successful. Redirecting to user dashboard…');
      navigate('/user-dashboard');
    } catch (error) {
      const message = error.response?.data || 'Login failed. Please try again.';
      window.alert(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = (type) => {
    setDialogType(type);
    setEmail('');
    setOtp('');
    setOtpSent(false);
  };

  const handleSendOtp = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      window.alert('Please enter a valid email address.');
      return;
    }

    setOtpLoading(true);

    try {
      await generateOtp({ email });
      setOtpSent(true);
      window.alert('OTP sent successfully.');
    } catch {
      window.alert('Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      window.alert('Please enter a valid OTP.');
      return;
    }

    try {
      if (dialogType === 'username') {
        const res = await verifyForgotUsernameOtp({ otp });
        window.alert(`Your username is: ${res.data}`);
        setDialogType(null);
      } else {
        const res = await verifyForgotPasswordOtp({ otp });
        const userIdMatch = res.data.match(/UserId\s*:\s*(\d+)/);
        if (userIdMatch && userIdMatch[1]) {
          const userId = parseInt(userIdMatch[1], 10);
          setVerifiedUserId(userId);
          window.alert('OTP verified. Please enter your new password.');
          setDialogType(null);
          setShowNewPasswordDialog(true);
        } else {
          throw new Error('UserId not found in response');
        }
      }
    } catch {
      window.alert('Invalid OTP. Please try again.');
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      window.alert('Password must be at least 6 characters.');
      return;
    }

    try {
      await updateForgotPassword({ userId: verifiedUserId, newPassword });
      window.alert('Your password has been updated.');
      setShowNewPasswordDialog(false);
    } catch {
      window.alert('Failed to update password.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 500,
            p: isMobile ? 3 : 5,
            boxShadow: 3,
            borderRadius: 3,
            backgroundColor: '#fff',
          }}
        >
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            align="center"
            gutterBottom
            sx={{ color: '#183c86', fontWeight: 'bold' }}
          >
            User Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              disabled={!validateForm() || loading}
              sx={{ mt: 2 }}
              size={isMobile ? 'medium' : 'large'}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>

          <Typography align="center" sx={{ mt: 2 }}>
            <Link component="button" onClick={() => handleForgot('username')} underline="hover">
              Forgot Username
            </Link>{' '}
            |{' '}
            <Link component="button" onClick={() => handleForgot('password')} underline="hover">
              Forgot Password
            </Link>
          </Typography>

          <Typography align="center" sx={{ mt: 2 }}>
            Don’t have an account?{' '}
            <Link href="/user-registration" underline="hover">
              Register here
            </Link>
          </Typography>
          <Typography align="center" sx={{ mt: 1 }}>
  Are you an admin?{' '}
  <Link href="/admin-login" underline="hover">
    Login as Admin
  </Link>
</Typography>
          <Typography align="center" sx={{ mt: 2 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} href="/">
              Back to Home
            </Button>
          </Typography>
        </Box>
      </Box>

      <Dialog open={!!dialogType} onClose={() => setDialogType(null)}>
        <DialogTitle>
          {otpSent ? 'Verify OTP' : `Recover ${dialogType === 'username' ? 'Username' : 'Password'}`}
        </DialogTitle>
        <DialogContent>
          {!otpSent ? (
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              type="email"
            />
          ) : (
            <TextField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              margin="normal"
              type="number"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogType(null)}>Cancel</Button>
          <Button
            onClick={otpSent ? handleVerifyOtp : handleSendOtp}
            variant="contained"
            disabled={otpLoading}
          >
            {otpLoading ? <CircularProgress size={24} color="inherit" /> : otpSent ? 'Verify OTP' : 'Send OTP'}
          </Button>
        </DialogActions>
      </Dialog>

            <Dialog open={showNewPasswordDialog} onClose={() => setShowNewPasswordDialog(false)}>
        <DialogTitle>Set New Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdatePassword} variant="contained">
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserLogin;
