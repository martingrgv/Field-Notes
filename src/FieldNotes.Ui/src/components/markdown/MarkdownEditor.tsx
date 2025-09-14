import { useState } from 'react';
import {
    Box,
    TextField,
    Tabs,
    Tab,
    Typography,
    Paper
} from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import MarkdownRenderer from './MarkdownRenderer';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
}

function MarkdownEditor({
    value,
    onChange,
    label = 'Description',
    placeholder = 'Enter description in Markdown format...',
    rows = 6,
    disabled = false,
    error = false,
    helperText = ''
}: MarkdownEditorProps) {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Box>
            <Paper variant="outlined" sx={{ borderRadius: 1 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        minHeight: 40,
                        '& .MuiTabs-indicator': {
                            height: 2,
                        },
                        borderBottom: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Tab
                        icon={<Edit fontSize="small" />}
                        iconPosition="start"
                        label="Write"
                        sx={{ minHeight: 40, fontSize: '0.875rem' }}
                    />
                    <Tab
                        icon={<Visibility fontSize="small" />}
                        iconPosition="start"
                        label="Preview"
                        sx={{ minHeight: 40, fontSize: '0.875rem' }}
                    />
                </Tabs>

                <Box sx={{ p: 0 }}>
                    {activeTab === 0 ? (
                        <TextField
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            label={label}
                            placeholder={placeholder}
                            multiline
                            rows={rows}
                            fullWidth
                            disabled={disabled}
                            error={error}
                            helperText={helperText}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: 'none',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    transform: 'translate(14px, 16px) scale(1)',
                                    '&.Mui-focused, &.MuiFormLabel-filled': {
                                        transform: 'translate(14px, -9px) scale(0.75)',
                                    },
                                },
                            }}
                        />
                    ) : (
                        <Box sx={{ p: 2, minHeight: rows * 24 }}>
                            {value.trim() ? (
                                <MarkdownRenderer content={value} />
                            ) : (
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    fontStyle="italic"
                                    sx={{ py: 2 }}
                                >
                                    Nothing to preview. Write some markdown in the "Write" tab.
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </Paper>

            {activeTab === 0 && (
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                >
                    Supports Markdown formatting: **bold**, *italic*, `code`, [links](url), lists, tables, and more.
                </Typography>
            )}
        </Box>
    );
}

export default MarkdownEditor;