import {
    Box,
    Drawer,
    Toolbar,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import type { NavigationProps } from '../../types/NavigationProps';
import NavigationItems from './NavigationItems';

function Navigation({ drawerWidth, drawerOpen, onDrawerToggle }: NavigationProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const drawerContent = (
        <Box sx={{ overflow: 'auto' }}>
            <Toolbar />
            <NavigationItems onDrawerToggle={onDrawerToggle} />
        </Box>
    )

    return (
        <>
            <Drawer
                open={drawerOpen}
                onClose={onDrawerToggle}
                variant={isMobile ? 'temporary' : 'persistent'}
                ModalProps={{ keepMounted: true }}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    display: { xs: 'block', md: 'block' },
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
                }}>
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Navigation;
