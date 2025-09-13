import {
    Box,
    Drawer,
    Toolbar,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemButton
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { NavigationItems } from './NavigationItems'

function Navigation({ isOpen }: { isOpen: boolean }) {
    const drawerWidth = 200
    const navigate = useNavigate()

    const handleNavigation = (path: string) => {
        navigate(path)
    }

    const DrawerList = (
        <Box sx={{ overflow: 'auto' }} >
            <List>
                {NavigationItems.map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton onClick={() => handleNavigation(item.path)}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )

    return (
        <Drawer
            open={isOpen}
            variant='persistent'
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
            }}>
            <Toolbar />
            {DrawerList}
        </Drawer>
    )
}

export default Navigation
