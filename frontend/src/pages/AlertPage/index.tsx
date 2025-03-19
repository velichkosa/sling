import React, {useEffect} from 'react';

import {title} from "@/shared/ui/title";
import Table from "@/shared/ui/Table";
import {useFetchVWShiftSummary} from "@/processes/hooks/useFetchVWShiftSummary";
import Columns from "@/pages/AlertPage/ui/columns";


const AlertPage: React.FC = () => {

    useEffect(() => {
        document.title = title.alert;
    }, []);

    return (
        <Table useDataHook={useFetchVWShiftSummary} Columns={Columns}/>
    );
};

export default AlertPage;
