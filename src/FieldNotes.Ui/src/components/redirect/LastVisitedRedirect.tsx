import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LAST_VISITED_KEY = 'field-notes-last-visited';

function LastVisitedRedirect() {
    const { isAuthenticated, user } = useAuth();

    // If user is not authenticated or doesn't exist, go to default page
    if (!isAuthenticated || !user) {
        return <Navigate to='/notes?pageNumber=1&pageSize=10' replace />;
    }

    const lastVisited = localStorage.getItem(LAST_VISITED_KEY);

    if (lastVisited && lastVisited !== '/') {
        return <Navigate to={lastVisited} replace />;
    }

    return <Navigate to='/notes?pageNumber=1&pageSize=10' replace />;
}

export default LastVisitedRedirect;
