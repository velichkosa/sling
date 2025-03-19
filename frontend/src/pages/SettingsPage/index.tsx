import React, {useEffect} from 'react';

import {title} from "@/shared/ui/title";
import Table from "@/shared/ui/Table";


import {useSPTData} from "@/processes/hooks/useFetchSPT";
import Columns from "@/pages/SettingsPage/ui/columns";


const AlertPage: React.FC = () => {

    useEffect(() => {
        document.title = title.settings;
    }, []);

    return (
        <Table useDataHook={useSPTData} Columns={Columns}/>
    );
};

export default AlertPage;
