import {
    Container,
    Box,
    Typography
} from '@mui/material'

function NotesPage() {
    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Typography variant='h1' component="h1" gutterBottom>
                    Notes
                </Typography>
            </Box>
        </Container>
    )
}

export default NotesPage
