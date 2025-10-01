import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Paper,
    Container,
    CircularProgress,
    Fade,
    Slide,
    useTheme,
    useMediaQuery,
    InputAdornment,
    IconButton,
    Divider
} from '@mui/material';
import {
    Person as PersonIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    Login as LoginIcon,
    StickyNote2 as NotesIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
    onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const { login, isLoading } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await login(username, password);
            onSuccess?.();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Login failed');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `radial-gradient(ellipse at top, rgba(144, 202, 249, 0.08) 0%, ${theme.palette.background.default} 50%), linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(156, 39, 176, 0.05) 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: isMobile ? 2 : 4,
                px: isMobile ? 2 : 4,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at 20% 80%, rgba(144, 202, 249, 0.1) 0%, transparent 50%),
                                 radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)`,
                    pointerEvents: 'none'
                }
            }}
        >
            <Container component="main" maxWidth="sm">
                <Fade in timeout={800}>
                    <Box sx={{ width: '100%' }}>
                        {/* App Branding */}
                        <Slide in timeout={1000} direction="down">
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Box sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    mb: 2,
                                    p: 1.5,
                                    borderRadius: 3,
                                    background: `linear-gradient(45deg, rgba(144, 202, 249, 0.15), rgba(156, 39, 176, 0.15))`,
                                    backdropFilter: 'blur(20px)',
                                    boxShadow: `0 4px 20px rgba(144, 202, 249, 0.1)`
                                }}>
                                    <NotesIcon sx={{
                                        fontSize: '3rem',
                                        color: 'primary.main',
                                        mr: 1
                                    }} />
                                    <Typography
                                        variant={isMobile ? 'h4' : 'h3'}
                                        component="h1"
                                        sx={{
                                            fontWeight: 700,
                                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}
                                    >
                                        Field Notes
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                >
                                    Your digital notebook for capturing ideas
                                </Typography>
                            </Box>
                        </Slide>

                        {/* Login Card */}
                        <Slide in timeout={1200} direction="up">
                            <Paper
                                elevation={0}
                                sx={{
                                    p: isMobile ? 3 : 4,
                                    borderRadius: 3,
                                    background: `linear-gradient(135deg, rgba(30, 31, 33, 0.95) 0%, rgba(30, 31, 33, 0.85) 100%)`,
                                    backdropFilter: 'blur(20px)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5)`
                                }}
                            >
                                {/* Decorative Elements */}
                                {!isMobile && (
                                    <>
                                        <Box sx={{
                                            position: 'absolute',
                                            top: -50,
                                            right: -50,
                                            width: 100,
                                            height: 100,
                                            borderRadius: '50%',
                                            background: `radial-gradient(circle, rgba(144, 202, 249, 0.2) 0%, rgba(144, 202, 249, 0.05) 50%, transparent 100%)`,
                                            opacity: 0.8
                                        }} />
                                        <Box sx={{
                                            position: 'absolute',
                                            bottom: -30,
                                            left: -30,
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            background: `radial-gradient(circle, rgba(156, 39, 176, 0.2) 0%, rgba(156, 39, 176, 0.05) 50%, transparent 100%)`,
                                            opacity: 0.6
                                        }} />
                                        {/* Additional dark theme particles */}
                                        <Box sx={{
                                            position: 'absolute',
                                            top: '20%',
                                            left: -20,
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            background: `radial-gradient(circle, rgba(144, 202, 249, 0.15) 0%, transparent 70%)`,
                                            opacity: 0.4
                                        }} />
                                    </>
                                )}

                                <Typography
                                    component="h2"
                                    variant={isMobile ? 'h5' : 'h4'}
                                    align="center"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 600,
                                        mb: 3,
                                        color: 'text.primary'
                                    }}
                                >
                                    Welcome Back
                                </Typography>

                                {error && (
                                    <Fade in>
                                        <Alert
                                            severity="error"
                                            sx={{
                                                mb: 3,
                                                borderRadius: 2,
                                                '& .MuiAlert-icon': {
                                                    fontSize: '1.5rem'
                                                }
                                            }}
                                        >
                                            {error}
                                        </Alert>
                                    </Fade>
                                )}

                                <Box component="form" onSubmit={handleSubmit}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        autoComplete="username"
                                        autoFocus
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={isLoading}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            mb: 2,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                                '& fieldset': {
                                                    border: 'none'
                                                },
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: `0 4px 12px rgba(144, 202, 249, 0.3)`,
                                                    backgroundColor: 'rgba(0, 0, 0, 0.3)'
                                                },
                                                '&.Mui-focused': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                                    boxShadow: `0 0 0 2px rgba(144, 202, 249, 0.5)`
                                                }
                                            }
                                        }}
                                    />

                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                        disabled={isLoading}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            mb: 3,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                                '& fieldset': {
                                                    border: 'none'
                                                },
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: `0 4px 12px rgba(144, 202, 249, 0.3)`,
                                                    backgroundColor: 'rgba(0, 0, 0, 0.3)'
                                                },
                                                '&.Mui-focused': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                                    boxShadow: `0 0 0 2px rgba(144, 202, 249, 0.5)`
                                                }
                                            }
                                        }}
                                    />

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={isLoading}
                                        startIcon={isLoading ? null : <LoginIcon />}
                                        sx={{
                                            mt: 2,
                                            mb: 2,
                                            py: 1.5,
                                            borderRadius: 2,
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            background: `linear-gradient(135deg, rgba(144, 202, 249, 0.9), rgba(156, 39, 176, 0.8))`,
                                            color: '#ffffff',
                                            border: 'none',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 8px 25px rgba(144, 202, 249, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)`,
                                                background: `linear-gradient(135deg, rgba(144, 202, 249, 1), rgba(156, 39, 176, 0.9))`
                                            },
                                            '&:disabled': {
                                                transform: 'none',
                                                boxShadow: 'none',
                                                background: 'rgba(144, 202, 249, 0.3)',
                                                color: 'rgba(255, 255, 255, 0.5)',
                                                border: 'none'
                                            }
                                        }}
                                    >
                                        {isLoading ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CircularProgress size={20} color="inherit" />
                                                <span>Signing In...</span>
                                            </Box>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </Button>
                                </Box>

                                <Divider sx={{ my: 3 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Secure Login
                                    </Typography>
                                </Divider>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    align="center"
                                    sx={{ display: 'block', mb: 2 }}
                                >
                                    Enter your credentials to access your notes
                                </Typography>

                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Don't have an account?{' '}
                                        <Link
                                            to="/register"
                                            style={{
                                                color: theme.palette.primary.main,
                                                textDecoration: 'none',
                                                fontWeight: 600
                                            }}
                                        >
                                            Create one here
                                        </Link>
                                    </Typography>
                                </Box>
                            </Paper>
                        </Slide>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default LoginForm;
