import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/index';
import Layout from './components/layout/Layout';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation
} from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Container,
    CssBaseline,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Home as HomeIcon,
    Info as InfoIcon,
    ContactMail as ContactIcon,
    Settings as SettingsIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const drawerWidth = 240;

// Create dark theme with custom background
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#18191b',
            paper: '#1e1f21',
        },
        primary: {
            main: '#90caf9',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b3b3b3',
        },
    },
});

// Sample pages
function HomePage() {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h3" gutterBottom>
                Welcome Home
            </Typography>
            <Typography variant="body1" paragraph>
                This is the home page of your application. The layout uses Material-UI with
                React Router for navigation. The background color is set to #18191b as requested.
            </Typography>
            <Typography variant="body1">
                Navigate using the sidebar menu or the navigation links in the header.
            </Typography>
        </Container>
    );
}

function AboutPage() {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h3" gutterBottom>
                About Us
            </Typography>
            <Typography variant="body1" paragraph>
                This is the about page. You can add more content here as needed.
            </Typography>
        </Container>
    );
}

function ContactPage() {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h3" gutterBottom>
                Contact
            </Typography>
            <Typography variant="body1" paragraph>
                Get in touch with us through this contact page.
            </Typography>
        </Container>
    );
}

function SettingsPage() {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h3" gutterBottom>
                Settings
            </Typography>
            <Typography variant="body1" paragraph>
                Configure your application settings here.
            </Typography>
        </Container>
    );
}

// Navigation items
const navigationItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'About', icon: <InfoIcon />, path: '/about' },
    { text: 'Contact', icon: <ContactIcon />, path: '/contact' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

function NavigationDrawer({ open, onClose, permanent = false }) {
    const location = useLocation();

    const drawer = (
        <Box sx={{ overflow: 'auto' }}>
            <Toolbar />
            <List>
                {navigationItems.map((item) => (
                    <ListItem
                        key={item.text}
                        component={Link}
                        to={item.path}
                        onClick={onClose}
                        sx={{
                            color: 'inherit',
                            textDecoration: 'none',
                            backgroundColor: location.pathname === item.path ? 'rgba(144, 202, 249, 0.08)' : 'transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(144, 202, 249, 0.04)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            sx={{
                                color: location.pathname === item.path ? 'primary.main' : 'inherit'
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    if (permanent) {
        return (
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                {drawer}
            </Drawer>
        );
    }

    return (
        <Drawer
            variant="temporary"
            open={open}
            onClose={onClose}
            ModalProps={{
                keepMounted: true,
            }}
            sx={{
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: drawerWidth,
                },
            }}
        >
            {drawer}
        </Drawer>
    );
}

// function Layout() {
//   const [mobileOpen, setMobileOpen] = React.useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />

//       {/* App Bar */}
//       <AppBar
//         position="fixed"
//         sx={{
//           zIndex: theme.zIndex.drawer + 1,
//         }}
//       >
//         <Toolbar>
//           {isMobile && (
//             <IconButton
//               color="inherit"
//               aria-label="open drawer"
//               edge="start"
//               onClick={handleDrawerToggle}
//               sx={{ mr: 2 }}
//             >
//               <MenuIcon />
//             </IconButton>
//           )}
//           <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
//             My Application
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       {/* Navigation Drawer */}
//       {isMobile ? (
//         <NavigationDrawer open={mobileOpen} onClose={handleDrawerToggle} />
//       ) : (
//         <NavigationDrawer permanent />
//       )}

//       {/* Main Content */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           width: { md: `calc(100% - ${drawerWidth}px)` },
//           minHeight: '100vh',
//         }}
//       >
//         <Toolbar />
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/contact" element={<ContactPage />} />
//           <Route path="/settings" element={<SettingsPage />} />
//         </Routes>
//       </Box>
//     </Box>
//   );
// }

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
