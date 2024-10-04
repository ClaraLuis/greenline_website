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
import TransactionsTable from './TransactionsTable.js';
import AccountsTable from './AccountsTable.js';
import OrdersTable from '../Orders/OrdersTable.js';
import ExpensesTable from './ExpensesTable.js';
import SheetsTable from '../Courier/SheetsTable.js';
import Pagination from '../../Pagination.js';
import MultiSelect from '../../MultiSelect.js';
import SelectComponent from '../../SelectComponent.js';

const { ValueContainer, Placeholder } = components;

const FinanceSheets = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, courierSheetStatusesContext, isAuth } = useContext(Contexthandlerscontext);
    const { fetchCouriers, useQueryGQL, fetchCourierSheets } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [selectedinventory, setselectedinventory] = useState('');
    const [chosenracks, setchosenracks] = useState([]);
    const [itemsarray, setitemsarray] = useState([
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
    ]);

    const [payload, setpayload] = useState({
        functype: 'add',
        id: 'add',
        name: '',
        type: '',
        phone: '',
        email: '',
        birthdate: '',
    });
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });
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
    // const fetchusers = [];
    useEffect(() => {
        setpageactive_context('/financesheets');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        {/* Dashboard */}
                    </p>
                </div>

                <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                    <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                        <span style={{ color: 'var(--info)' }}>Manifests</span>
                    </p>
                </div>
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
                {isAuth([1, 34, 53, 51]) && (
                    <>
                        <div class="col-lg-12 p-0 mb-2">
                            <Pagination
                                beforeCursor={fetchSheetsQuery?.data?.paginateCourierSheets?.cursor?.beforeCursor}
                                afterCursor={fetchSheetsQuery?.data?.paginateCourierSheets?.cursor?.afterCursor}
                                filter={filter}
                                setfilter={setfilter}
                            />
                        </div>
                        <div class={' row m-0 w-100'}>
                            <SheetsTable
                                fetchSheetsQuery={fetchSheetsQuery}
                                refetchCourierSheets={refetchCourierSheets}
                                clickable={true}
                                onClick={(item) => {
                                    history.push('/couriersheet?id=' + item?.id + '&type=finance');
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
export default FinanceSheets;
