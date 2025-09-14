import {
    Box,
    Drawer,
    Toolbar,
} from '@mui/material';
import type { NavigationProps } from '../../types/NavigationProps';
import NavigationItems from './NavigationItems';

function Navigation({ drawerWidth, drawerOpen, onDrawerToggle }: NavigationProps) {
    const drawerContent = (
        <Box sx={{ overflow: 'auto' }}>
            <Toolbar />
            <NavigationItems onDrawerToggle={onDrawerToggle} />
        </Box>
    )

    return (
        <>
            {/* Desktop Navigation - Persistent Drawer */}
            <Drawer
                open={drawerOpen}
                onClose={onDrawerToggle}
                variant='persistent'
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    display: { xs: 'none', md: 'block' },
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
                }}>
                {drawerContent}
            </Drawer>

            {/* Mobile Navigation - Temporary Drawer (Overlay) */}
            <Drawer
                open={drawerOpen}
                onClose={onDrawerToggle}
                variant='temporary'
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
                }}>
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Navigation;
