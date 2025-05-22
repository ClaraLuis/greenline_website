import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useContext, useState } from 'react';
import { components } from 'react-select';

import MultiSelect from '../MultiSelect';
import API from '../../API/API';
import { Contexthandlerscontext } from '../../Contexthandlerscontext';
import SelectComponent from '../SelectComponent';

const FinanceSelectComponent = (props) => {
    const { useQueryGQL, fetchFinancialAccounts } = API();
    const { isAuth } = useContext(Contexthandlerscontext);

    const [filterAllFinancialAccountsObj, setfilterAllFinancialAccountsObj] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchAllFinancialAccountsQuery = useQueryGQL('', fetchFinancialAccounts(), filterAllFinancialAccountsObj);
    if (props?.type == 'multi') {
        return (
            <>
                <MultiSelect
                    title={props?.title}
                    filter={filterAllFinancialAccountsObj}
                    setfilter={setfilterAllFinancialAccountsObj}
                    options={fetchAllFinancialAccountsQuery}
                    attr={'paginateFinancialAccounts'}
                    label={props?.label}
                    value={props?.value}
                    selected={props?.selected}
                    onClick={props?.onClick}
                />
            </>
        );
    } else if (props?.type == 'single') {
        return (
            <>
                <SelectComponent
                    title={props?.title}
                    filter={filterAllFinancialAccountsObj}
                    setfilter={setfilterAllFinancialAccountsObj}
                    options={fetchAllFinancialAccountsQuery}
                    attr={'paginateFinancialAccounts'}
                    payload={props?.payload}
                    payloadAttr={props?.payloadAttr}
                    label={props?.label}
                    value={props?.value}
                    onClick={props?.onClick}
                    removeAll={props?.removeAll}
                    disabled={props?.disabled}
                />
            </>
        );
    }
};

export default FinanceSelectComponent;
