import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CategoryProvider } from './context/CategoryContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { router } from './routes/index';

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

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <AuthProvider>
                <CategoryProvider>
                    <RouterProvider router={router} />
                </CategoryProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
