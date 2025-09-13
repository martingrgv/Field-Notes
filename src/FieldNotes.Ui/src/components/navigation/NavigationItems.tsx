import { useEffect } from 'react'
import type { NavigationItem } from "../../types/NavigationItem";
import {
    Folder as FolderIcon
} from '@mui/icons-material'

export const NavigationItems: NavigationItem[] = [
    {
        path: "/notes",
        text: "Notes",
        icon: <FolderIcon />,
    }
];
