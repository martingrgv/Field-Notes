import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    useTheme,
    useMediaQuery,
    Fade,
    Zoom
} from '@mui/material';
import { Home, ArrowBack, Search, SentimentVeryDissatisfied } from '@mui/icons-material';

function NotFoundPage() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleViewNotes = () => {
        navigate('/notes?pageNumber=1&pageSize=10');
    };

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: isMobile ? 2 : 4,
                    px: isMobile ? 1 : 0
                }}
            >
                <Fade in timeout={800}>
                    <Paper
                        elevation={isMobile ? 0 : 2}
                        sx={{
                            p: isMobile ? 3 : 6,
                            textAlign: 'center',
                            borderRadius: isMobile ? 3 : 2,
                            maxWidth: 500,
                            width: '100%',
                            background: isMobile
                                ? 'linear-gradient(135deg, rgba(144, 202, 249, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)'
                                : undefined,
                            border: isMobile ? `1px solid ${theme.palette.divider}` : undefined
                        }}
                    >
                        {/* Mobile Emoji Icon */}
                        {isMobile && (
                            <Zoom in timeout={1200}>
                                <Box sx={{ mb: 3 }}>
                                    <SentimentVeryDissatisfied
                                        sx={{
                                            fontSize: '3rem',
                                            color: 'primary.main',
                                            opacity: 0.8
                                        }}
                                    />
                                </Box>
                            </Zoom>
                        )}

                        {/* 404 Number */}
                        <Zoom in timeout={1000}>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: isMobile ? '3.5rem' : { xs: '4rem', sm: '6rem' },
                                    fontWeight: 700,
                                    color: 'primary.main',
                                    mb: isMobile ? 1 : 2,
                                    lineHeight: 1,
                                    background: isMobile
                                        ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                                        : undefined,
                                    backgroundClip: isMobile ? 'text' : undefined,
                                    WebkitBackgroundClip: isMobile ? 'text' : undefined,
                                    WebkitTextFillColor: isMobile ? 'transparent' : undefined,
                                }}
                            >
                                404
                            </Typography>
                        </Zoom>

                        {/* Main Error Message */}
                        <Typography
                            variant={isMobile ? 'h5' : 'h4'}
                            component="h1"
                            sx={{
                                fontWeight: 600,
                                mb: isMobile ? 1.5 : 2,
                                color: 'text.primary'
                            }}
                        >
                            {isMobile ? 'Oops! Page Not Found' : 'Page Not Found'}
                        </Typography>

                        {/* Description */}
                        <Typography
                            variant={isMobile ? 'body2' : 'body1'}
                            color="text.secondary"
                            sx={{
                                mb: isMobile ? 3 : 4,
                                lineHeight: 1.6,
                                px: isMobile ? 1 : 0
                            }}
                        >
                            {isMobile
                                ? "The page you're looking for doesn't exist. Let's get you back on track!"
                                : "Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL."
                            }
                        </Typography>

                        {/* Action Buttons */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: isMobile ? 'column' : 'row' },
                                gap: isMobile ? 1.5 : 2,
                                justifyContent: 'center',
                                alignItems: 'center',
                                mb: isMobile ? 2 : 0
                            }}
                        >
                            <Button
                                variant="contained"
                                startIcon={<Home />}
                                onClick={handleGoHome}
                                size={isMobile ? 'medium' : 'large'}
                                fullWidth={isMobile}
                                sx={{
                                    minWidth: isMobile ? undefined : 140,
                                    py: isMobile ? 1.5 : undefined,
                                    borderRadius: isMobile ? 2 : undefined,
                                    fontWeight: 600
                                }}
                            >
                                Take Me Home
                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={<Search />}
                                onClick={handleViewNotes}
                                size={isMobile ? 'medium' : 'large'}
                                fullWidth={isMobile}
                                sx={{
                                    minWidth: isMobile ? undefined : 140,
                                    py: isMobile ? 1.5 : undefined,
                                    borderRadius: isMobile ? 2 : undefined
                                }}
                            >
                                Browse Notes
                            </Button>

                            <Button
                                variant="text"
                                startIcon={<ArrowBack />}
                                onClick={handleGoBack}
                                size={isMobile ? 'medium' : 'large'}
                                fullWidth={isMobile}
                                sx={{
                                    minWidth: isMobile ? undefined : 140,
                                    py: isMobile ? 1.5 : undefined,
                                    borderRadius: isMobile ? 2 : undefined
                                }}
                            >
                                Go Back
                            </Button>
                        </Box>

                        {/* Additional Help */}
                        <Box sx={{
                            mt: isMobile ? 3 : 4,
                            pt: isMobile ? 2 : 3,
                            borderTop: 1,
                            borderColor: 'divider'
                        }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    display: 'block',
                                    mb: isMobile ? 1.5 : 1,
                                    fontSize: isMobile ? '0.875rem' : undefined
                                }}
                            >
                                {isMobile ? 'Quick actions:' : 'Need help? Here are some useful links:'}
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                justifyContent: 'center',
                                gap: isMobile ? 1 : 2,
                                flexWrap: 'wrap'
                            }}>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => navigate('/notes/create')}
                                    fullWidth={isMobile}
                                    sx={{
                                        textTransform: 'none',
                                        py: isMobile ? 1 : undefined,
                                        borderRadius: isMobile ? 1 : undefined
                                    }}
                                >
                                    + Create New Note
                                </Button>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={handleViewNotes}
                                    fullWidth={isMobile}
                                    sx={{
                                        textTransform: 'none',
                                        py: isMobile ? 1 : undefined,
                                        borderRadius: isMobile ? 1 : undefined
                                    }}
                                >
                                    📝 View All Notes
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Fade>
            </Box>
        </Container>
    );
}

export default NotFoundPage;