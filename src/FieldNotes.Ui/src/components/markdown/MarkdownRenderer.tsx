import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface MarkdownRendererProps {
    content: string;
    sx?: object;
}

const StyledMarkdownBox = styled(Box)(({ theme }) => ({
    '& h1': {
        fontSize: '2rem',
        fontWeight: 600,
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(3),
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        paddingBottom: theme.spacing(1),
        '&:first-of-type': {
            marginTop: 0,
        },
    },
    '& h2': {
        fontSize: '1.5rem',
        fontWeight: 600,
        marginBottom: theme.spacing(1.5),
        marginTop: theme.spacing(2.5),
        color: theme.palette.text.primary,
        '&:first-of-type': {
            marginTop: 0,
        },
    },
    '& h3': {
        fontSize: '1.25rem',
        fontWeight: 600,
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(2),
        color: theme.palette.text.primary,
        '&:first-of-type': {
            marginTop: 0,
        },
    },
    '& h4, & h5, & h6': {
        fontSize: '1.1rem',
        fontWeight: 600,
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1.5),
        color: theme.palette.text.primary,
        '&:first-of-type': {
            marginTop: 0,
        },
    },
    '& p': {
        lineHeight: 1.8,
        marginBottom: theme.spacing(1.5),
        color: theme.palette.text.primary,
        '&:last-child': {
            marginBottom: 0,
        },
    },
    '& ul, & ol': {
        marginBottom: theme.spacing(1.5),
        paddingLeft: theme.spacing(3),
    },
    '& li': {
        marginBottom: theme.spacing(0.5),
        color: theme.palette.text.primary,
    },
    '& blockquote': {
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        margin: `${theme.spacing(1.5)} 0`,
        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
        backgroundColor: theme.palette.action.hover,
        fontStyle: 'italic',
        '& p': {
            margin: 0,
        },
    },
    '& code': {
        backgroundColor: theme.palette.action.hover,
        padding: `${theme.spacing(0.25)} ${theme.spacing(0.5)}`,
        borderRadius: theme.shape.borderRadius,
        fontSize: '0.875rem',
        fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    '& pre': {
        backgroundColor: theme.palette.action.hover,
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        overflow: 'auto',
        marginBottom: theme.spacing(1.5),
        '& code': {
            backgroundColor: 'transparent',
            padding: 0,
        },
    },
    '& a': {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    '& table': {
        borderCollapse: 'collapse',
        width: '100%',
        marginBottom: theme.spacing(1.5),
        border: `1px solid ${theme.palette.divider}`,
    },
    '& th, & td': {
        border: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(1),
        textAlign: 'left',
    },
    '& th': {
        backgroundColor: theme.palette.action.hover,
        fontWeight: 600,
    },
    '& hr': {
        border: 'none',
        borderTop: `1px solid ${theme.palette.divider}`,
        margin: `${theme.spacing(2)} 0`,
    },
    '& img': {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: theme.shape.borderRadius,
    },
    '& strong': {
        fontWeight: 600,
    },
    '& em': {
        fontStyle: 'italic',
    },
}));

function MarkdownRenderer({ content, sx }: MarkdownRendererProps) {
    if (!content || content.trim() === '') {
        return (
            <Box sx={{ ...sx, fontStyle: 'italic', color: 'text.secondary' }}>
                No description available
            </Box>
        );
    }

    return (
        <StyledMarkdownBox sx={sx}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </StyledMarkdownBox>
    );
}

export default MarkdownRenderer;