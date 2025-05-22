import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { AiOutlineClose } from 'react-icons/ai';
import Decimal from 'decimal.js';
import { DateRangePicker } from 'rsuite';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import { Modal } from 'react-bootstrap';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { NotificationManager } from 'react-notifications';
import Select from 'react-select';
import Cookies from 'universal-cookie';
import API from '../../../API/API.js';
import Form from '../../Form.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import TransactionsTable from '../Finance/TransactionsTable.js';
import Pagination from '../../Pagination.js';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import SelectComponent from '../../SelectComponent.js';
import TransactionsTableView from '../Finance/TransactionsTableView.js';

const MerchantPayment = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const [total, setTotal] = useState(0);

    const { setpageactive_context, isAuth, setpagetitle_context } = useContext(Contexthandlerscontext);
    const { useQueryGQL, fetchMerchantPaymentTransactions, merchantPaymentsSummary } = API();
    const cookies = new Cookies();

    const { lang, langdetect } = useContext(LanguageContext);
    const [selectedArray, setselectedArray] = useState([]);

    const [filterobj, setfilterobj] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
        merchantIds: undefined,
        processing: undefined,
    });

    const fetchMerchantPaymentTransactionsQuery = useQueryGQL('', fetchMerchantPaymentTransactions(), filterobj);
    const [filterMerchanrPaymentSummaryObj, setfilterMerchanrPaymentSummaryObj] = useState({
        // merchantIds: [1],
        startDate: undefined,
        endDate: undefined,
    });
    const merchantPaymentsSummaryQuery = useQueryGQL('', merchantPaymentsSummary(), filterMerchanrPaymentSummaryObj);

    useEffect(() => {
        setpageactive_context('/merchantpayment');
        setpagetitle_context('Merchant');

        setfilterobj({
            isAsc: false,
            limit: 20,
            afterCursor: undefined,
            beforeCursor: undefined,
            merchantIds: undefined,
            processing: undefined,
        });
    }, []);

    useEffect(() => {
        let totalTemp = new Decimal(0); // Initialize totalTemp as a Decimal

        if (selectedArray?.length === 0) {
            fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.forEach((item) => {
                totalTemp = totalTemp.plus(new Decimal(item?.amount || 0)); // Use Decimal for summing amounts
            });
        } else {
            fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data.forEach((item) => {
                if (selectedArray.includes(item.id)) {
                    totalTemp = totalTemp.plus(new Decimal(item?.amount || 0)); // Use Decimal for summing amounts
                }
            });
        }

        setTotal(totalTemp.toNumber()); // Convert Decimal to number before setting state
    }, [fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data, selectedArray]);
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class="col-lg-12 p-0 px-3 ">
                    <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                        <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                            Merchant Payments
                        </p>
                    </div>
                    <div class="col-lg-12 px-3">
                        <div class="row m-0 w-100">
                            <div style={{ borderRadius: '0.25rem', background: 'white' }} class={generalstyles.card + ' col-lg-12'}>
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
                                                <div class="col-lg-3" style={{ marginBottom: '15px' }}>
                                                    <div class="row m-0 w-100  ">
                                                        <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                            <label class={formstyles.form__label}>Order by</label>
                                                            <Select
                                                                options={[
                                                                    { label: 'Oldest', value: true },
                                                                    { label: 'Latest', value: false },
                                                                ]}
                                                                styles={defaultstyles}
                                                                value={[
                                                                    { label: 'Oldest', value: true },
                                                                    { label: 'Latest', value: false },
                                                                ].find((option) => option.value === (filterobj?.isAsc ?? true))}
                                                                onChange={(option) => {
                                                                    setfilterobj({ ...filterobj, isAsc: option?.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class=" col-lg-3 mb-md-2">
                                                    <span>Date Range</span>
                                                    <div class="mt-1" style={{ width: '100%' }}>
                                                        <DateRangePicker
                                                            onChange={(event) => {
                                                                if (event != null) {
                                                                    setfilterMerchanrPaymentSummaryObj({
                                                                        ...filterMerchanrPaymentSummaryObj,
                                                                        startDate: event[0],
                                                                        endDate: event[1],
                                                                    });
                                                                    setfilterobj({ ...filterobj, fromDate: event[0], toDate: event[1] });
                                                                }
                                                            }}
                                                            onClean={() => {
                                                                setfilterMerchanrPaymentSummaryObj({
                                                                    ...filterMerchanrPaymentSummaryObj,
                                                                    startDate: null,
                                                                    endDate: null,
                                                                });
                                                                setfilterobj({ ...filterobj, fromDate: null, toDate: null });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionItemPanel>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                    {!filterMerchanrPaymentSummaryObj?.merchantIds && cookies.get('userInfo')?.type != 'merchant' && (
                        <div class="col-lg-12 p-0 px-1">
                            <div class="row m-0 w-100">
                                {merchantPaymentsSummaryQuery?.data?.merchantPaymentsSummary?.data?.map((item, index) => {
                                    return (
                                        <div class="col-lg-4">
                                            <div class={generalstyles.card + ' row m-0 p-3 w-100'}>
                                                <div style={{ fontSize: '17px' }} class="col-lg-12 mb-1">
                                                    {item?.status}
                                                </div>
                                                <div class="col-lg-12">
                                                    <span style={{ fontWeight: 800, fontSize: '23px' }}>
                                                        {item?.sum} {item?.currency}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {(filterMerchanrPaymentSummaryObj?.merchantIds || cookies.get('userInfo')?.type == 'merchant') && (
                        <div className="col-lg-12 p-0 px-1">
                            <div className="row m-0 w-100">
                                {Object.keys(merchantPaymentsSummaryQuery?.data?.merchantPaymentsSummary?.data || {}).map((merchantId) => {
                                    const payments = merchantPaymentsSummaryQuery?.data?.merchantPaymentsSummary?.data[merchantId];

                                    return payments.map((item, index) => (
                                        <div className="col-lg-3" key={index}>
                                            <div className={`${generalstyles.card} row m-0 p-3 w-100`}>
                                                <div style={{ fontSize: '17px' }} className="col-lg-12 mb-1">
                                                    {item?.status}
                                                </div>
                                                <div className="col-lg-12">
                                                    <span style={{ fontWeight: 800, fontSize: '23px' }}>
                                                        {item?.sum} {item?.currency}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ));
                                })}
                            </div>
                        </div>
                    )}

                    <div class="col-lg-12 p-0">
                        <Pagination
                            beforeCursor={fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.cursor?.beforeCursor}
                            afterCursor={fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.cursor?.afterCursor}
                            filter={filterobj}
                            setfilter={setfilterobj}
                        />
                    </div>
                    <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar py-0 px-3 '}>
                        <TransactionsTableView
                            width={'50%'}
                            query={fetchMerchantPaymentTransactionsQuery}
                            paginationAttr="paginateMerchantPaymentTransactions"
                            srctype="all"
                            refetchFunc={() => {
                                Refetch();
                            }}
                            hasOrder={true}
                            // allowSelect={true}
                            // selectedArray={selectedArray}
                            // setselectedArray={setselectedArray}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MerchantPayment;
