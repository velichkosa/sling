import React from 'react';
import {LegacySidebarContext, LegacySidebarContextProps} from "@/shared/ui/SidePanel/components/LegacySidebarContext";


export const useLegacySidebar = (): LegacySidebarContextProps | undefined => {
    const context = React.useContext(LegacySidebarContext);

    return context;
};
