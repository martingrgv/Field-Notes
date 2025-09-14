import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from "../../context/AuthContext";
import { useCategoryContext } from "../../context/CategoryContext";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material'
import {
    PersonOutline as PersonOutlineIcon,
    Logout as LogoutIcon,
    Folder as FolderIcon,
    Add as AddIcon,
} from '@mui/icons-material';

function NavigationItems({ onDrawerToggle }: { onDrawerToggle: () => void }) {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { logout } = useAuth();
    const { categories } = useCategoryContext();
    const defaultNotesNavigation = 'notes?pageNumber=1&pageSize=10';

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) {
            onDrawerToggle?.();
        }
    };

    const handleCategoryNavigation = (category: string) => {
        handleNavigation(`${defaultNotesNavigation}&category=${category}`);
    };

    const profileItems = (
        <List>
            <ListItem disablePadding>
                <ListItemButton onClick={() => handleNavigation('notes/create')}>
                    <ListItemIcon>
                        <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary='Create Note' />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton onClick={() => handleNavigation('profile')}>
                    <ListItemIcon>
                        <PersonOutlineIcon />
                    </ListItemIcon>
                    <ListItemText primary='Profile' />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton onClick={() => logout()}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary='Logout' />
                </ListItemButton>
            </ListItem>
        </List>
    );

    const categoryItems = (
        <List>
            {categories.map((category, index) => (
                <ListItem key={index} disablePadding>
                    <ListItemButton onClick={() => handleCategoryNavigation(category)}>
                        <ListItemIcon>
                            <FolderIcon />
                        </ListItemIcon>
                        <ListItemText primary={category} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );

    return (
        <>
            {profileItems}
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleNavigation(defaultNotesNavigation)}>
                        <ListItemIcon>
                            <FolderIcon />
                        </ListItemIcon>
                        <ListItemText primary='General' />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            {categoryItems}
        </>
    )
}


export default NavigationItems;
