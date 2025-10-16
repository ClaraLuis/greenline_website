import React, { useEffect } from 'react';
import generalstyles from './Website/Generalfiles/CSS_GENERAL/general.module.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';

const Pagination = (props) => {
    var array = [];
    for (let i = 20; i <= 200; i += 20) {
        array.push(i); // Add each multiple of 20 to the array
    }

    const isLoading = props?.loading || false;

    return (
        <div class="row m-0 w-100 p-md-2 pt-2 d-flex justify-content-end align-items-center">
            Items per page:
            <div class="mx-2">
                <FormControl sx={{ minWidth: 65, maxHeight: 30 }} size="small">
                    <Select
                        style={{ height: 30 }}
                        value={props?.filter?.limit || ''}
                        disabled={isLoading}
                        onChange={(event) => {
                            if (isLoading) return;
                            props?.setfilter({
                                ...props?.filter,
                                limit: event.target.value,
                                beforeCursor: null,
                                afterCursor: null,
                            });
                        }}
                        renderValue={(selected) => (props?.total ? `${selected >= props?.total ? props?.total : selected} of ${props?.total}` : `${selected}`)}
                    >
                        {array?.map((item, index) => (
                            <MenuItem key={index} value={item}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            {isLoading && (
                <div class="mx-2">
                    <CircularProgress color="var(--primary)" width="20px" height="20px" duration="1s" />
                </div>
            )}
            <div
                onClick={() => {
                    if (isLoading || props?.beforeCursor === null) return;
                    props?.setfilter({ ...props?.filter, beforeCursor: props?.beforeCursor, afterCursor: null });
                }}
                class={props?.beforeCursor === null || isLoading ? `${generalstyles.mui_1774owm_disabled} ${generalstyles.mui_1774owm}` : generalstyles.mui_1774owm}
                style={{ cursor: isLoading || props?.beforeCursor === null ? 'not-allowed' : 'pointer' }}
            >
                <IoIosArrowBack />
            </div>
            <div
                onClick={() => {
                    if (isLoading || props?.afterCursor === null) return;
                    props?.setfilter({ ...props?.filter, afterCursor: props?.afterCursor, beforeCursor: null });
                }}
                class={props?.afterCursor === null || isLoading ? `${generalstyles.mui_1774owm_disabled} ${generalstyles.mui_1774owm}` : generalstyles.mui_1774owm}
                style={{ cursor: isLoading || props?.afterCursor === null ? 'not-allowed' : 'pointer' }}
            >
                <IoIosArrowForward />
            </div>
        </div>
    );
};
export default Pagination;
