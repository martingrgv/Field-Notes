import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import { useCategoryContext } from '../../context/CategoryContext';
import CategorySelector from '../../components/form/CategorySelector';
import MarkdownEditor from '../../components/markdown/MarkdownEditor';
import MarkdownRenderer from '../../components/markdown/MarkdownRenderer';
import {
    Container,
    Box,
    Typography,
    Paper,
    CircularProgress,
    Button,
    Chip,
    Divider,
    TextField,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from '@mui/material';
import { ArrowBack, Edit, Delete, Person, Schedule, Save, Cancel } from '@mui/icons-material';
import type { Note } from '../../types/Note';
import type { UpdateNoteRequest } from '../../types/ApiRequest';

function NoteDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { refreshCategories } = useCategoryContext();
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        category: ''
    });
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchNote = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);
            try {
                const response = await apiService.get(`/notes/${id}`);
                setNote(response.data);
            } catch (err) {
                console.error('Error fetching note:', err);
                setError('Failed to load note');
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    useEffect(() => {
        if (note) {
            setEditForm({
                title: note.title || '',
                description: note.description || '',
                category: note.category || ''
            });
        }
    }, [note]);

    const handleBack = () => {
        navigate(-1);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
        setSaveError(null);
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
    };

    const handleDeleteConfirm = async () => {
        if (!note) return;

        setDeleting(true);
        try {
            await apiService.delete(`/notes/${note.id}`);
            console.log(note.id);
            setDeleteDialogOpen(false);
            // Refresh categories in case this was the last note in a category
            refreshCategories();
            handleBack();
        } catch (error) {
            console.error('Error deleting note:', error);
            setDeleteDialogOpen(false);
            // You could add a delete error state here if needed
        } finally {
            setDeleting(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSaveError(null);
        if (note) {
            setEditForm({
                title: note.title || '',
                description: note.description || '',
                category: note.category || ''
            });
        }
    };

    const handleSave = async () => {
        if (!note || !editForm.title.trim()) {
            setSaveError('Title is required');
            return;
        }

        setSaving(true);
        setSaveError(null);

        try {
            const updateRequest: UpdateNoteRequest = {
                id: note.id,
                title: editForm.title.trim(),
                description: editForm.description.trim() || undefined,
                category: editForm.category.trim() || undefined
            };

            const response = await apiService.put('/notes', updateRequest);
            setNote(response.data);
            setIsEditing(false);
            // Refresh categories in case the category was changed
            refreshCategories();
        } catch (error) {
            console.error('Error updating note:', error);
            setSaveError('Failed to update note');
        } finally {
            setSaving(false);
        }
    };

    const handleFormChange = (field: keyof typeof editForm) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setEditForm(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error || !note) {
        return (
            <Container maxWidth="md">
                <Box sx={{ py: 4 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        sx={{ mb: 3 }}
                    >
                        Back
                    </Button>
                    <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="error" gutterBottom>
                            {error || 'Note not found'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            The note you're looking for doesn't exist or has been deleted.
                        </Typography>
                    </Paper>
                </Box>
            </Container>
        );
    }


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

                <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{ p: 4, pb: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            {isEditing ? (
                                <TextField
                                    value={editForm.title}
                                    onChange={handleFormChange('title')}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    error={!editForm.title.trim()}
                                    helperText={!editForm.title.trim() ? 'Title is required' : ''}
                                    sx={{ mr: 2 }}
                                />
                            ) : (
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    sx={{ fontWeight: 600, color: 'text.primary', flexGrow: 1, mr: 2 }}
                                >
                                    {note.title}
                                </Typography>
                            )}
                            <Box display="flex" gap={1}>
                                {isEditing ? (
                                    <>
                                        <Button
                                            startIcon={<Save />}
                                            size="small"
                                            variant="contained"
                                            onClick={handleSave}
                                            disabled={saving}
                                        >
                                            {saving ? 'Saving...' : 'Save'}
                                        </Button>
                                        <Button
                                            startIcon={<Cancel />}
                                            size="small"
                                            variant="outlined"
                                            onClick={handleCancel}
                                            disabled={saving}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            startIcon={<Edit />}
                                            size="small"
                                            variant="outlined"
                                            onClick={handleEdit}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            startIcon={<Delete />}
                                            size="small"
                                            color="error"
                                            variant="outlined"
                                            onClick={handleDeleteClick}
                                            disabled={deleting}
                                        >
                                            {deleting ? 'Deleting...' : 'Delete'}
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Box>

                        {isEditing ? (
                            <Box sx={{ mb: 2, maxWidth: 400 }}>
                                <CategorySelector
                                    value={editForm.category}
                                    onChange={(value) => setEditForm(prev => ({ ...prev, category: value }))}
                                    disabled={saving}
                                />
                            </Box>
                        ) : (
                            note.category && (
                                <Box mb={2}>
                                    <Chip
                                        label={note.category}
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                            )
                        )}
                    </Box>

                    <Divider />

                    <Box sx={{ p: 4 }}>
                        {isEditing ? (
                            <MarkdownEditor
                                value={editForm.description}
                                onChange={(value) => setEditForm(prev => ({ ...prev, description: value }))}
                                placeholder="Enter note description in Markdown format..."
                                disabled={saving}
                            />
                        ) : (
                            <MarkdownRenderer
                                content={note.description || ''}
                                sx={{ minHeight: '2rem' }}
                            />
                        )}
                        {saveError && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {saveError}
                            </Alert>
                        )}
                    </Box>

                    <Divider />

                    <Box sx={{ p: 4, pt: 3, backgroundColor: 'action.hover' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                            Note Details
                        </Typography>

                        <Box display="flex" flexDirection="column" gap={2}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Schedule fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    Last updated:
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                    {formatDate(note.lastUpdated)}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                                <Person fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    Last updated by:
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                    {note.lastUpdatedBy || 'Unknown'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={handleDeleteCancel}
                    aria-labelledby="delete-dialog-title"
                    aria-describedby="delete-dialog-description"
                >
                    <DialogTitle id="delete-dialog-title">
                        Delete Note
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dialog-description">
                            Are you sure you want to delete "{note.title}"? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleDeleteCancel}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            color="error"
                            variant="contained"
                            disabled={deleting}
                            autoFocus
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
}

export default NoteDetailPage;
