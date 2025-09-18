import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Button
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import NoteCreateForm from '../../components/note/NoteCreateForm';

function NoteCreatePage() {
    const navigate = useNavigate();
    const savedFormData = sessionStorage.getItem('noteCreateForm');

    const handleBack = () => {
        if (savedFormData) {
            sessionStorage.removeItem('noteCreateForm');
        }
        navigate(-1);
    };

    const handleCreateSuccess = (noteId: string) => {
        // Navigate to the newly created note
        navigate(`/notes/${noteId}`, { replace: true });
    };

    const handleCancel = () => {
        navigate('/notes?pageNumber=1&pageSize=10');
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    sx={{ mb: 3 }}
                    variant="outlined"
                >
                    Back
                </Button>

                <NoteCreateForm
                    savedFormData={savedFormData}
                    onCreateSuccess={handleCreateSuccess}
                    onCancel={handleCancel}
                />
            </Box>
        </Container>
    );
}

export default NoteCreatePage;
