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
import * as XLSX from 'xlsx';
import SelectComponent from '../../SelectComponent.js';
import MultiSelect from '../../MultiSelect.js';

const { ValueContainer, Placeholder } = components;

const CourierSheets = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, courierSheetStatusesContext, isAuth } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchCourierSheets, fetchCouriers } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [filter, setfilter] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
        statuses: ['inProgress', 'waitingForAdminApproval', 'waitingForFinanceApproval'],
    });
    const fetchSheetsQuery = useQueryGQL('', fetchCourierSheets(), filter);
    const { refetch: refetchCourierSheets } = useQueryGQL('', fetchCourierSheets(), filter);

    const [filterCouriers, setfilterCouriers] = useState({
        isAsc: true,
        limit: 10,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchCouriersQuery = useQueryGQL('cache-first', fetchCouriers(), filterCouriers);
    useEffect(() => {
        setpageactive_context('/couriersheets');
        setpagetitle_context('Courier');
    }, []);

    const exportToExcel = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class="col-lg-12 px-3">
                    <div class={generalstyles.card + ' row m-0 w-100'}>
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                            <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                                Manifest
                            </p>
                        </div>

                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + '  mb-1'}
                                onClick={() => {
                                    if (isAuth([1, 36, 53])) {
                                        history.push('/addsheet');
                                    } else {
                                        NotificationManager.warning('Not Authorized', 'Warning!');
                                    }
                                }}
                            >
                                Add Manifest
                            </button>
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + '  mb-1 mx-1'}
                                onClick={() => {
                                    const couriersheets = fetchSheetsQuery?.data?.paginateCourierSheets?.data;

                                    const exportData = couriersheets.map((sheet) => ({
                                        ...sheet,
                                        courier: sheet.userInfo?.name,
                                        userInfo: undefined,
                                    }));

                                    exportToExcel(exportData, 'couriersheets');
                                }}
                            >
                                Export
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 px-3">
                    <div class={generalstyles.card + ' mb-3 col-lg-12 p-2'}>
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
                                        <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                            <SelectComponent
                                                title={'Courier'}
                                                filter={filterCouriers}
                                                setfilter={setfilterCouriers}
                                                options={fetchCouriersQuery}
                                                attr={'paginateCouriers'}
                                                label={'name'}
                                                value={'id'}
                                                payload={filter}
                                                payloadAttr={'courierId'}
                                                onClick={(option) => {
                                                    setfilter({ ...filter, courierId: option?.id });
                                                }}
                                            />
                                        </div>
                                        <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                            <MultiSelect
                                                title={'Status'}
                                                options={courierSheetStatusesContext}
                                                label={'label'}
                                                value={'value'}
                                                selected={filter?.statuses}
                                                onClick={(option) => {
                                                    var tempArray = [...(filter?.statuses ?? [])];
                                                    if (option == 'All') {
                                                        tempArray = undefined;
                                                    } else {
                                                        if (!tempArray?.includes(option.value)) {
                                                            tempArray.push(option.value);
                                                        } else {
                                                            tempArray.splice(tempArray?.indexOf(option?.value), 1);
                                                        }
                                                    }

                                                    setfilter({ ...filter, statuses: tempArray?.length != 0 ? tempArray : undefined });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </AccordionItemPanel>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
                <div class="col-lg-12 px-3">
                    {isAuth([1, 34, 53]) && (
                        <>
                            <div class="col-lg-12 p-0 mb-3">
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
                                    refetchCourierSheets={refetchCourierSheets}
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
        </div>
    );
};
export default CourierSheets;
