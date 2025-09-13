import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

function HomePage() {
    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    My MUI App
                </Typography>

                <TextField
                    fullWidth
                    label="Enter your name"
                    variant="outlined"
                    margin="normal"
                />

                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                        Submit
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        color="error"
                    >
                        Delete
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default HomePage;
