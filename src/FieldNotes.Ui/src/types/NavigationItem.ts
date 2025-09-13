import type { ReactElement } from "react";

export interface NavigationItem {
    path: string;
    text: string;
    icon: ReactElement;
    children?: NavigationItem[];
}
