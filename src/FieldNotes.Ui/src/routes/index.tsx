import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import NotesPage from '../pages/note/NotesPage';
import NoteDetailPage from '../pages/note/NoteDetailPage';
import NoteCreatePage from '../pages/note/NoteCreatePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import NotFoundPage from '../pages/error/NotFoundPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import LastVisitedRedirect from '../components/redirect/LastVisitedRedirect';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <LastVisitedRedirect />,
            },
            {
                path: 'notes',
                element: <NotesPage />
            },
            {
                path: 'notes/create',
                element: <NoteCreatePage />
            },
            {
                path: 'notes/:id',
                element: <NoteDetailPage />
            },
            {
                path: '*',
                element: <NotFoundPage />
            }
        ]
    },
    {
        path: '*',
        element: <NotFoundPage />
    }
]);
