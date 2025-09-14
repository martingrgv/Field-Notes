import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'
import Navigation from '../navigation/Navigation'
import type { NavigationProps } from '../../types/NavigationProps';
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
    AccountCircle as AccountIcon,
} from '@mui/icons-material'

function Header({ drawerWidth, drawerOpen, onDrawerToggle: onDrawerToggle }: NavigationProps) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleTitleClick = () => {
        navigate('/notes?pageNumber=1&pageSize=10');
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
                        sx={{ mr: 1 }}
                        onClick={onDrawerToggle}>
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
                                opacity: 0.75
                            }
                        }}
                        onClick={handleTitleClick}>
                        Field Notes
                    </Typography>

                    <Box sx={{ display: 'flex' }}>
                        <Typography mr={1}>
                            {user?.username}
                        </Typography>
                        <AccountIcon />
                    </Box>
                </Toolbar>
            </AppBar>
            <Navigation drawerWidth={drawerWidth} drawerOpen={drawerOpen} onDrawerToggle={onDrawerToggle} />
        </Box>
    );
}

export default Header;
