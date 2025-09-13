import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    CssBaseline,
} from '@mui/material';
import {
    Menu as MenuIcon,
} from '@mui/icons-material'
import Navigation from '../navigation/Navigation'

function Header() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleTitleClick = () => {
        navigate('/');
    };


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        sx={{ mr: 2 }}
                        onClick={handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>

                    <Typography 
                        variant="h6" 
                        noWrap 
                        component="div" 
                        sx={{ 
                            flexGrow: 1, 
                            cursor: 'pointer',
                            '&:hover': {
                                opacity: 0.8
                            }
                        }}
                        onClick={handleTitleClick}>
                        Field Notes
                    </Typography>
                </Toolbar>
            </AppBar>
            <Navigation isOpen={drawerOpen} />
        </Box>
    );
}

export default Header;
