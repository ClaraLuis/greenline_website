import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { components } from 'react-select';
import { DateRangePicker } from 'rsuite';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import MultiSelect from '../../MultiSelect.js';
import TransactionsTable from './TransactionsTable.js';

const { ValueContainer, Placeholder } = components;

const Finance = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, isAuth } = useContext(Contexthandlerscontext);
    const { useQueryGQL, merchantPaymentsSummary, fetchMerchants, fetchMerchantPaymentTransactions } = API();
    const { lang, langdetect } = useContext(LanguageContext);

    const [filterMerchanrPaymentSummaryObj, setfilterMerchanrPaymentSummaryObj] = useState({
        // merchantIds: [1],
        startDate: '2024-01-28T18:56:15.242Z',
    });

    const merchantPaymentsSummaryQuery = useQueryGQL('', merchantPaymentsSummary(), filterMerchanrPaymentSummaryObj);
    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchMerchantsQuery = useQueryGQL('cache-first', fetchMerchants(), filterMerchants);
    const [filterobj, setfilterobj] = useState({
        isAsc: true,
        limit: 3,
        afterCursor: undefined,
        beforeCursor: undefined,
        merchantIds: undefined,
        processing: undefined,
    });

    const fetchMerchantPaymentTransactionsQuery = useQueryGQL('', fetchMerchantPaymentTransactions(), filterobj);

    useEffect(() => {
        setpageactive_context('/merchantfinance');
        setpagetitle_context('Merchant');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
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
                                    <MultiSelect
                                        title={'Merchants'}
                                        filter={filterMerchants}
                                        setfilter={setfilterMerchants}
                                        options={fetchMerchantsQuery}
                                        attr={'paginateMerchants'}
                                        label={'name'}
                                        value={'id'}
                                        selected={filterMerchanrPaymentSummaryObj?.merchantIds}
                                        onClick={(option) => {
                                            const tempArray = [...(filterMerchanrPaymentSummaryObj?.merchantIds ?? [])];

                                            if (option === 'All') {
                                                setfilterMerchanrPaymentSummaryObj({ ...filterMerchanrPaymentSummaryObj, merchantIds: undefined });
                                            } else {
                                                const index = tempArray.indexOf(option?.id);
                                                if (index === -1) {
                                                    tempArray.push(option?.id);
                                                } else {
                                                    tempArray.splice(index, 1);
                                                }

                                                setfilterMerchanrPaymentSummaryObj({ ...filterMerchanrPaymentSummaryObj, merchantIds: tempArray.length ? tempArray : undefined });
                                            }
                                        }}
                                    />
                                </div>
                                <div class="col-lg-3 mb-md-2">
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
                                                }
                                            }}
                                            onClean={() => {
                                                setfilterMerchanrPaymentSummaryObj({
                                                    ...filterMerchanrPaymentSummaryObj,
                                                    startDate: null,
                                                    endDate: null,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </AccordionItemPanel>
                    </AccordionItem>
                </Accordion>
            </div>
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Finance
                    </p>
                </div>
                {!filterMerchanrPaymentSummaryObj?.merchantIds && (
                    <div class="col-lg-12 p-0">
                        <div class="row m-0 w-100">
                            {merchantPaymentsSummaryQuery?.data?.merchantPaymentsSummary?.data?.map((item, index) => {
                                return (
                                    <div class="col-lg-3">
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
                {filterMerchanrPaymentSummaryObj?.merchantIds && (
                    <div className="col-lg-12 p-0">
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
                <div className={' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                    <div class="row m-0 w-100">
                        <div class="col-lg-12 px-1">
                            <div class={generalstyles.card + ' row m-0 w-100'}>
                                <div class={' col-lg-6 col-md-6 col-sm-12 d-flex align-items-center justify-content-start '}>
                                    <p class=" p-0 m-0 text-uppercase" style={{ fontSize: '15px' }}>
                                        <span style={{ color: 'var(--info)' }}>Transactions</span>
                                    </p>
                                </div>
                                <div class="col-lg-6  d-flex justify-content-end">
                                    <span
                                        onClick={() => {
                                            history.push('/merchantpayments');
                                        }}
                                        style={{ height: '35px' }}
                                        class={generalstyles.roundbutton + '  allcentered'}
                                    >
                                        View all
                                    </span>
                                </div>
                            </div>{' '}
                        </div>

                        <TransactionsTable width={'50%'} query={fetchMerchantPaymentTransactionsQuery} paginationAttr="paginateMerchantPaymentTransactions" srctype="all" />
                    </div>
                </div>
                {/* <div class={generalstyles.card + ' row m-0 w-100'}>
                    <div class="col-lg-12 p-0 ">
                        <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                            <input
                                // disabled={props?.disabled}
                                // type={props?.type}
                                class={formstyles.form__field}
                                // value={}
                                placeholder={'Search by name or SKU'}

                                // onChange={}
                            />
                        </div>
                    </div>
                </div> */}
                {/* 
                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Past Transactions</span>
                        </p>
                    </div>
                    <div   className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                        <TransactionsTable />
                    </div>
                </div>

                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Awaiting Transactions</span>
                        </p>
                    </div>
                    <div   className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                        <TransactionsTable />
                    </div>
                </div>

                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Invoices</span>
                        </p>
                    </div>
                    <div   className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                        <TransactionsTable />
                    </div>
                </div> */}
            </div>
        </div>
    );
};
export default Finance;
