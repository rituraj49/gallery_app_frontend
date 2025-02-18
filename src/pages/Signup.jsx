import React, { useState } from 'react'
import { TextField, Button, Container, Typography, InputAdornment, Snackbar, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { config } from '../config/apiConfig';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
    const { dispatch, state } = useContext(AuthContext);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
        return regex.test(email);
    };

    const validateInputs = () => {
        const errors = {};
        if(!userData.name || userData.name.length === 0) {
            errors.name = 'Name is required';
        } else if (!userData.email) {
            errors.email = 'Email is required';
        } else if (!validateEmail(userData.email)) {
            errors.email = 'Invalid email format';
        }
        if (!userData.password) {
            errors.password = 'Password is required';
        } else if (userData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }
        return errors;
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const errors = validateInputs();
            if(Object.keys(errors).length > 0) {
                setValidationErrors(errors);
                return;
            }
            const res = await axios.post(`${config.baseUrl}/api/v1/auth/register`, userData);
            console.log('res:', res);
            
            dispatch({ type: 'SIGNUP', payload: res.data });

            if(res.status === 201) {
                navigate('/');
            }
        } catch (error) {
            console.error('error while logging in user', error);
            setErrorMessage(error.response?.data?.message || 'Something went wrong');
        }
    }

    const handleCloseSnackbar = () => {
        setErrorMessage(''); // Clear the error message
    };
  return (
    <Container maxWidth="xs">
            <Typography variant="h4" align="center">Signup</Typography>
            <form onSubmit={handleSignup}>
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={userData.name}
                    onChange={(e) => {
                        setUserData({ ...userData, name: e.target.value });
                        setValidationErrors({ ...validationErrors, name: '' });
                    }}
                    placeholder='Enter your name'
                    required
                    error={!!validationErrors.name}
                    helperText={validationErrors.name}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={userData.email}
                    onChange={(e) => {
                        setUserData({ ...userData, email: e.target.value });
                        setValidationErrors({ ...validationErrors, email: '' });
                    }}
                    placeholder='Enter a valid email'
                    required
                    error={!!validationErrors.email}
                    helperText={validationErrors.email}
                />
                <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={userData.password}
                    placeholder='Enter password'
                    onChange={(e) => {
                        setUserData({ ...userData, password: e.target.value });
                        setValidationErrors({ ...validationErrors, password: '' });
                    }}
                    required
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                                {showPassword ? <VisibilityOff onClick={() => setShowPassword(false)} /> : <Visibility onClick={() => setShowPassword(true)} />}
                            </InputAdornment>
                        )
                    }}
                    error={!!validationErrors.password}
                    helperText={validationErrors.password}
                />
                <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    fullWidth
                >
                    Signup
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    component={Link}
                    to="/login"
                >
                    Already registered?
                </Button>
            </form>
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                // message={errorMessage}
            >
                 <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Container>
  )
}

export default Signup