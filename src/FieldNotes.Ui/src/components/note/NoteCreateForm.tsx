import { useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Alert,
    Typography,
    Paper
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import type { CreateNoteRequest } from '../../types/ApiRequest';
import { useCategoryContext } from '../../context/CategoryContext';
import CategorySelector from '../form/CategorySelector';
import MarkdownEditor from '../markdown/MarkdownEditor';
import apiService from '../../services/api';

interface NoteCreateFormProps {
    savedFormData: string | null;
    onCreateSuccess: (noteId: string) => void;
    onCancel: () => void;
}

function NoteCreateForm({ savedFormData, onCreateSuccess, onCancel }: NoteCreateFormProps) {
    const [formData, setFormData] = useState<CreateNoteRequest>(() => {
        return savedFormData ? JSON.parse(savedFormData) : {
            title: '',
            description: '',
            category: ''
        }
    });
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const { refreshCategories } = useCategoryContext();

    useEffect(() => {
        sessionStorage.setItem('noteCreateForm', JSON.stringify(formData));
    }, [formData])

    const handleFormChange = (field: keyof CreateNoteRequest) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            setSaveError('Title is required');
            return;
        }

        setSaving(true);
        setSaveError(null);

        try {
            const createRequest: CreateNoteRequest = {
                title: formData.title.trim(),
                description: formData.description?.trim() || undefined,
                category: formData.category.trim()
            };

            const response = await apiService.post('/notes', createRequest);

            // Refresh categories in case this is a new category
            refreshCategories();

            onCreateSuccess(response.data.id || 'new-note');
            sessionStorage.removeItem('noteCreateForm');
        } catch (error) {
            console.error('Error creating note:', error);
            setSaveError('Failed to create note');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setSaveError(null);
        setFormData({
            title: '',
            description: '',
            category: ''
        });
        onCancel();
    };

    return (
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 3 }}>
                    Create New Note
                </Typography>

                {/* Title Field */}
                <TextField
                    label="Title"
                    value={formData.title}
                    onChange={handleFormChange('title')}
                    variant="outlined"
                    fullWidth
                    required
                    error={!formData.title.trim() && saveError !== null}
                    helperText={!formData.title.trim() && saveError !== null ? 'Title is required' : ''}
                    sx={{ mb: 3 }}
                />

                {/* Category Field */}
                <Box sx={{ mb: 3 }}>
                    <CategorySelector
                        value={formData.category}
                        onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                        error={!formData.category.trim() && saveError !== null}
                        disabled={saving}
                    />
                </Box>

                {/* Description Field */}
                <Box sx={{ mb: 3 }}>
                    <MarkdownEditor
                        value={formData.description || ''}
                        onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                        placeholder="Enter note description in Markdown format..."
                        disabled={saving}
                    />
                </Box>

                {/* Error Display */}
                {saveError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {saveError}
                    </Alert>
                )}

                {/* Action Buttons */}
                <Box display="flex" gap={2} justifyContent="flex-end">
                    <Button
                        startIcon={<Cancel />}
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                    <Button
                        startIcon={<Save />}
                        variant="contained"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Creating...' : 'Create Note'}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}

export default NoteCreateForm;
