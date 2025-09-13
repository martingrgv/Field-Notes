import {
    Box
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../header/Header';

function Layout() {
    return (
        <Box>
            <Header />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    // width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}

export default Layout;
