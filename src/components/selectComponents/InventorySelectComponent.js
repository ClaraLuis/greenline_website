import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useContext, useState } from 'react';
import { components } from 'react-select';

import MultiSelect from '../MultiSelect';
import API from '../../API/API';
import { Contexthandlerscontext } from '../../Contexthandlerscontext';
import SelectComponent from '../SelectComponent';

const InventorySelectComponent = (props) => {
    const { useQueryGQL, fetchInventories } = API();
    const { isAuth } = useContext(Contexthandlerscontext);

    const [filterInventories, setfilterInventories] = useState({
        limit: 20,
        afterCursor: null,
        beforeCursor: null,
    });

    const fetchinventories = useQueryGQL('cache-first', fetchInventories(), filterInventories);

    if (props?.type == 'multi') {
        return (
            <>
                <MultiSelect
                    title={'Inventories'}
                    filter={filterInventories}
                    setfilter={setfilterInventories}
                    options={fetchinventories}
                    attr={'paginateInventories'}
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
                    title={'Inventory'}
                    filter={filterInventories}
                    setfilter={setfilterInventories}
                    options={fetchinventories}
                    attr={'paginateInventories'}
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

export default InventorySelectComponent;
