import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup } from 'react-icons/fa';
import Select, { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import SheetsTable from './SheetsTable.js';
import Pagination from '../../Pagination.js';

const { ValueContainer, Placeholder } = components;

const CourierSheets = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, isAuth } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchCourierSheets } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [filter, setfilter] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
    });
    const fetchSheetsQuery = useQueryGQL('', fetchCourierSheets(), filter);
    const { refetch: refetchCourierSheets } = useQueryGQL('', fetchCourierSheets(), filter);

    useEffect(() => {
        setpageactive_context('/couriersheets');
        // refetchCourierSheets();
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Sheets
                    </p>
                </div>

                {/* <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                    <button
                        style={{ height: '35px' }}
                        class={generalstyles.roundbutton + '  mb-1'}
                        onClick={() => {
                            history.push('/addsheet');
                        }}
                    >
                        Add Sheet
                    </button>
                </div> */}
                {/* <div class={generalstyles.filter_container + ' mb-3 col-lg-12 p-2'}>
                    <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                        <AccordionItem class={`${generalstyles.innercard}` + '  p-2'}>
                            <AccordionItemHeading>
                                <AccordionItemButton>
                                    <div class="row m-0 w-100">
                                        <div class="col-lg-8 col-md-8 col-sm-8 p-0 d-flex align-items-center justify-content-start">
                                            <p class={generalstyles.cardTitle + '  m-0 p-0 '}>Filter:</p>
                                        </div>
                                        <div class="col-lg-4 col-md-4 col-sm-4 p-0 d-flex align-items-center justify-content-end">
                                            <AccordionItemState>
                                                {(state) => {
                                                    if (state.expanded == true) {
                                                        return (
                                                            <i class="h-100 d-flex align-items-center justify-content-center">
                                                                <BsChevronUp />
                                                            </i>
                                                        );
                                                    } else {
                                                        return (
                                                            <i class="h-100 d-flex align-items-center justify-content-center">
                                                                <BsChevronDown />
                                                            </i>
                                                        );
                                                    }
                                                }}
                                            </AccordionItemState>
                                        </div>
                                    </div>
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                                <hr className="mt-2 mb-3" />
                                <div class="row m-0 w-100">
                                    <div class={'col-lg-2'} style={{ marginBottom: '15px' }}>
                                        <label for="name" class={formstyles.form__label}>
                                            Couriers
                                        </label>
                                        <Select
                                            options={[
                                                { label: 'Courier 1', value: '1' },
                                                { label: 'Courier 2', value: '2' },
                                            ]}
                                            styles={defaultstyles}
                                            value={
                                                [
                                                    { label: 'Courier 1', value: '1' },
                                                    { label: 'Courier 2', value: '2' },
                                                ]
                                                // .filter((option) => option.value == props?.payload[item?.attr])
                                            }
                                            onChange={(option) => {
                                                // props?.setsubmit(false);
                                                // var temp = { ...props?.payload };
                                                // temp[item?.attr] = option.value;
                                                // props?.setpayload({ ...temp });
                                            }}
                                        />
                                    </div>
                                    <div class={'col-lg-2'} style={{ marginBottom: '15px' }}>
                                        <label for="name" class={formstyles.form__label}>
                                            Status
                                        </label>
                                        <Select
                                            options={[
                                                { label: 'Pending', value: '1' },
                                                { label: 'Done', value: '2' },
                                            ]}
                                            styles={defaultstyles}
                                            value={
                                                [
                                                    { label: 'Pending', value: '1' },
                                                    { label: 'Done', value: '2' },
                                                ]
                                                // .filter((option) => option.value == props?.payload[item?.attr])
                                            }
                                            onChange={(option) => {
                                                // props?.setsubmit(false);
                                                // var temp = { ...props?.payload };
                                                // temp[item?.attr] = option.value;
                                                // props?.setpayload({ ...temp });
                                            }}
                                        />
                                    </div>
                                </div>
                            </AccordionItemPanel>
                        </AccordionItem>
                    </Accordion>
                </div> */}
                {isAuth([1, 34, 53]) && (
                    <>
                        <div class="col-lg-12 p-0">
                            <Pagination
                                beforeCursor={fetchSheetsQuery?.data?.paginateCourierSheets?.cursor?.beforeCursor}
                                afterCursor={fetchSheetsQuery?.data?.paginateCourierSheets?.cursor?.afterCursor}
                                filter={filter}
                                setfilter={setfilter}
                            />
                        </div>
                        <div class={' row m-0 w-100'}>
                            <SheetsTable
                                clickable={true}
                                fetchSheetsQuery={fetchSheetsQuery}
                                onClick={(item) => {
                                    history.push('/couriersheet?id=' + item?.id + '&type=admin');
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
export default CourierSheets;
