import React, { useEffect } from 'react';
import generalstyles from './Website/Generalfiles/CSS_GENERAL/general.module.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MenuItem, FormControl, Select, InputLabel } from '@mui/material';

const Pagination = (props) => {
    var array = [];
    for (let i = 20; i <= 200; i += 20) {
        array.push(i); // Add each multiple of 20 to the array
    }

    return (
        <div class="row m-0 w-100 p-md-2 pt-2 d-flex justify-content-end align-items-center">
            Rows per page:
            <div class="mx-2">
                <FormControl sx={{ minWidth: 65, maxHeight: 30 }} size="small">
                    <Select
                        value={props?.filter?.limit}
                        onChange={(event) => {
                            props?.setfilter({ ...props?.filter, limit: event.target.value, beforeCursor: null, afterCursor: null });
                        }}
                    >
                        {array?.map((item, index) => {
                            return <MenuItem value={item}>{item}</MenuItem>;
                        })}
                    </Select>
                </FormControl>
            </div>
            <div
                onClick={() => {
                    props?.setfilter({ ...props?.filter, beforeCursor: props?.beforeCursor, afterCursor: null });
                }}
                class={props?.beforeCursor === null ? `${generalstyles.mui_1774owm_disabled} ${generalstyles.mui_1774owm}` : generalstyles.mui_1774owm}
            >
                <IoIosArrowBack />
            </div>
            <div
                onClick={() => {
                    props?.setfilter({ ...props?.filter, afterCursor: props?.afterCursor, beforeCursor: null });
                }}
                class={props?.afterCursor === null ? `${generalstyles.mui_1774owm_disabled} ${generalstyles.mui_1774owm}` : generalstyles.mui_1774owm}
            >
                <IoIosArrowForward />
            </div>
        </div>
    );
};
export default Pagination;
