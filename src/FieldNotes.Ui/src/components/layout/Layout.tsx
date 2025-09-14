import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/Header';
import { useLastVisited } from '../../hooks/useLastVisited';
import {
    Box,
    Toolbar,
} from '@mui/material';

function Layout() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const drawerWidth = 250;
    useLastVisited();

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <Box>
            <Header drawerWidth={drawerWidth} drawerOpen={drawerOpen} onDrawerToggle={handleDrawerToggle} />
            <Toolbar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginLeft: {
                        xs: 0,
                        md: drawerOpen ? `${drawerWidth}px` : 0
                    },
                    width: {
                        xs: '100%',
                        md: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%'
                    },
                    minHeight: '100vh',
                    transition: 'margin-left 0.3s ease, width 0.3s ease',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}

export default Layout;
