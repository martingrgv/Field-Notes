import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import {
    Container,
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    CircularProgress,
    Paper,
    Divider
} from '@mui/material'
import MarkdownRenderer from '../../components/markdown/MarkdownRenderer';
import type { PaginatedResult } from '../../types/PaginatedResult';

function NotesPage() {
    const [paginatedResult, setPaginatedResult] = useState<PaginatedResult>();
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const pageNumber = searchParams.get('pageNumber')
    const pageSize = searchParams.get('pageSize')
    const category = searchParams.get('category');
    const baseNotesApiUrl = `/notes?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    const handleNoteClick = (noteId: string) => {
        navigate(`/notes/${noteId}`);
    };

    const truncateMarkdown = (content: string, maxLength: number = 150): string => {
        if (!content) return '';

        // Remove markdown syntax for better preview
        const plainText = content
            .replace(/#{1,6}\s+/g, '') // Remove headers
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.*?)\*/g, '$1') // Remove italic
            .replace(/`(.*?)`/g, '$1') // Remove inline code
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links, keep text
            .replace(/>\s+/g, '') // Remove blockquotes
            .replace(/^[-\*\+]\s+/gm, '') // Remove list markers
            .replace(/^\d+\.\s+/gm, '') // Remove numbered list markers
            .replace(/\n+/g, ' ') // Replace newlines with spaces
            .trim();

        return plainText.length > maxLength
            ? plainText.substring(0, maxLength) + '...'
            : plainText;
    };

    useEffect(() => {
        const fetchNotes = async () => {
            setLoading(true);
            setPaginatedResult(undefined);
            try {
                let apiUrl = baseNotesApiUrl
                if (category) {
                    apiUrl = `${baseNotesApiUrl}&category=${category}`
                }

                const response = await apiService.get(apiUrl);

                setPaginatedResult(response.data)
            } catch (errors) {
                console.error('Error fetching notes:', errors)
            } finally {
                setLoading(false);
            }
        }

        fetchNotes();
    }, [pageNumber, pageSize, category]);

    const renderContent = () => {
        if (loading) {
            return (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            );
        }

        if (paginatedResult?.items.length === 0) {
            return (
                <Typography variant="body1" color="text.secondary" mt={2}>
                    No notes found in this category.
                </Typography>
            );
        }

        return (
            <Paper elevation={2} sx={{ mt: 3, borderRadius: 2, overflow: 'hidden' }}>
                <List sx={{ py: 0 }}>
                    {paginatedResult?.items.map((note, index) => (
                        <Box key={index}>
                            <ListItem disablePadding>
                                <ListItemButton
                                    onClick={() => handleNoteClick(note.id)}
                                    sx={{
                                        py: 2,
                                        px: 3,
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        }
                                    }}
                                >
                                    <ListItemText
                                        primary={note.title}
                                        secondary={note.description ?
                                            truncateMarkdown(note.description) :
                                            'No description'
                                        }
                                        primaryTypographyProps={{
                                            variant: 'h6',
                                            fontWeight: 500,
                                            color: 'text.primary'
                                        }}
                                        secondaryTypographyProps={{
                                            variant: 'body2',
                                            color: 'text.secondary',
                                            sx: { mt: 0.5 }
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                            {index < paginatedResult.items.length - 1 && (
                                <Divider sx={{ mx: 3 }} />
                            )}
                        </Box>
                    ))}
                </List>
            </Paper>
        );
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 4, px: 2 }}>
                <Typography
                    variant='h3'
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 1
                    }}
                >
                    {category == undefined ? 'General' : category}
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    {paginatedResult?.totalCount ?
                        `${paginatedResult.totalCount} note${paginatedResult.totalCount !== 1 ? 's' : ''}` :
                        ''
                    }
                </Typography>
                {renderContent()}
            </Box>
        </Container>
    )
}

export default NotesPage
