import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useContext, useState, useEffect, useMemo } from 'react';
import { components } from 'react-select';

import MultiSelect from '../MultiSelect';
import API from '../../API/API';
import { Contexthandlerscontext } from '../../Contexthandlerscontext';
import SelectComponent from '../SelectComponent';

const MerchantSelectComponent = (props) => {
    const { useQueryGQL, fetchMerchants } = API();
    const { isAuth } = useContext(Contexthandlerscontext);

    // Memoize the initial filter to prevent unnecessary re-renders
    const initialFilter = useMemo(() => ({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    }), []);

    const [filterMerchants, setfilterMerchants] = useState(initialFilter);
    
    // Always use cache-first policy - let Apollo handle caching properly
    const fetchMerchantsQuery = useQueryGQL('cache-first', fetchMerchants(), filterMerchants);

    if (props?.type == 'multi') {
        return (
            <>
                <MultiSelect
                    title={'Merchants'}
                    filter={filterMerchants}
                    setfilter={setfilterMerchants}
                    options={fetchMerchantsQuery}
                    attr={'paginateMerchants'}
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
                    title={'Merchant'}
                    filter={filterMerchants}
                    setfilter={setfilterMerchants}
                    options={fetchMerchantsQuery}
                    attr={'paginateMerchants'}
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

export default MerchantSelectComponent;
