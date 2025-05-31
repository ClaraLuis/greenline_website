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
import Form from '../../Form.js';

import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import MultiSelect from '../../MultiSelect.js';
import TransactionsTableView from './TransactionsTableView.js';
import * as XLSX from 'xlsx';
import Cookies from 'universal-cookie';
import Pagination from '../../Pagination.js';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import Select from 'react-select';
import Decimal from 'decimal.js';
import { NotificationManager } from 'react-notifications';
import MerchantSelectComponent from '../../selectComponents/MerchantSelectComponent.js';

const { ValueContainer, Placeholder } = components;

const Finance = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const cookies = new Cookies();

    const { setpageactive_context, setpagetitle_context, dateformatter, isAuth, buttonLoadingContext, setbuttonLoadingContext, updateQueryParamContext, useLoadQueryParamsToPayload } =
        useContext(Contexthandlerscontext);
    const { useQueryGQL, merchantPaymentsSummary, fetchMerchants, fetchMerchantPaymentTransactions, calculateFinancialTransactionsTotal, completeMerchantPayments, useMutationGQL } = API();
    const { lang, langdetect } = useContext(LanguageContext);
    const [total, setTotal] = useState(0);

    const [filterMerchanrPaymentSummaryObj, setfilterMerchanrPaymentSummaryObj] = useState({
        // merchantIds: [1],
        startDate: undefined,
        endDate: undefined,
    });
    const [submit, setsubmit] = useState(false);

    const [selectedArray, setselectedArray] = useState([]);
    const [openModal, setopenModal] = useState(false);

    const [payload, setpayload] = useState({
        functype: 'add',
        name: '',
        type: '',
        merchantId: undefined,
        balance: 0,
        userId: undefined,
    });
    useLoadQueryParamsToPayload(setfilterMerchanrPaymentSummaryObj);
    const merchantPaymentsSummaryQuery = useQueryGQL('', merchantPaymentsSummary(), filterMerchanrPaymentSummaryObj);

    const [filterobj, setfilterobj] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
        merchantIds: undefined,
        processing: undefined,
        fromDate: undefined,
        toDate: undefined,
    });

    const fetchMerchantPaymentTransactionsQuery = useQueryGQL('', fetchMerchantPaymentTransactions(), filterobj);
    const { isAsc, limit, processing, ...filteredFilterObj } = filterobj;
    const calculateFinancialTransactionsTotalQuery = useQueryGQL('', calculateFinancialTransactionsTotal(), { ...filteredFilterObj, category: 'merchantOrderPayment' });

    useEffect(() => {
        setpageactive_context('/merchantfinance');
        setpagetitle_context(isAuth([1]) ? 'Finance' : 'Merchant');
    }, []);
    useEffect(() => {
        let totalTemp = new Decimal(0); // Initialize totalTemp as a Decimal

        if (selectedArray?.length === 0) {
            fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.forEach((item) => {
                totalTemp = totalTemp.plus(new Decimal(item?.amount ?? 0)); // Using Decimal for accurate addition
            });
        } else {
            fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data.forEach((item) => {
                if (selectedArray.includes(item.id)) {
                    totalTemp = totalTemp.plus(new Decimal(item?.amount ?? 0)); // Using Decimal for accurate addition
                }
            });
        }

        setTotal(totalTemp.toNumber()); // Convert Decimal to number for setting state
    }, [fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data, selectedArray]);

    const exportToExcel = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };
    const { refetch: refetchMerchantPaymentTransactionsQuery } = useQueryGQL('', fetchMerchantPaymentTransactions(), filterobj);

    const [completeMerchantPaymentsMutation] = useMutationGQL(completeMerchantPayments(), {
        transactionIds: selectedArray,
        description: payload?.description,
        allTransactions: payload?.allTransactions,
    });
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-start justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={isAuth([1, 60]) ? 'col-lg-9 p-0' : 'col-lg-12'}>
                    <div class="row m-0 w-100">
                        <div class="col-lg-12">
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
                                                                ].find((option) => option.value === (filterMerchanrPaymentSummaryObj?.isAsc ?? true))}
                                                                onChange={(option) => {
                                                                    setfilterMerchanrPaymentSummaryObj({ ...filterMerchanrPaymentSummaryObj, isAsc: option?.value });
                                                                    updateQueryParamContext('isAsc', option?.value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {isAuth([1]) && (
                                                    <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                        <MerchantSelectComponent
                                                            type="multi"
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
                                                                    updateQueryParamContext('merchantIds', tempArray.length ? tempArray : undefined);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                )}

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
                                                                    setfilterobj({
                                                                        ...filterobj,
                                                                        fromDate: event[0],
                                                                        toDate: event[1],
                                                                    });
                                                                }
                                                            }}
                                                            onClean={() => {
                                                                setfilterMerchanrPaymentSummaryObj({
                                                                    ...filterMerchanrPaymentSummaryObj,
                                                                    startDate: null,
                                                                    endDate: null,
                                                                });
                                                                setfilterobj({
                                                                    ...filterobj,
                                                                    fromDate: null,
                                                                    toDate: null,
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                    <label for="name" class={formstyles.form__label}>
                                                        Status
                                                    </label>
                                                    <Select
                                                        options={[
                                                            { label: 'All', value: undefined },
                                                            { label: 'Processing', value: true },
                                                            { label: 'Completed', value: false },
                                                        ]}
                                                        styles={defaultstyles}
                                                        value={[
                                                            { label: 'All', value: undefined },
                                                            { label: 'Processing', value: true },
                                                            { label: 'Completed', value: false },
                                                        ].find((option) => option.value === filterobj?.processing)}
                                                        onChange={(option) => {
                                                            setfilterobj({ ...filterobj, processing: option.value });
                                                            updateQueryParamContext('processing', option.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </AccordionItemPanel>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>{' '}
                        <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                            {!filterMerchanrPaymentSummaryObj?.merchantIds && cookies.get('userInfo')?.type != 'merchant' && (
                                <div class="col-lg-12 p-0">
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
                            {/* {isAuth([1, 51, 52, 111]) && ( */}
                            <div class="col-lg-12 co-md-12 p-0 d-flex justify-content-end mb-3">
                                <button
                                    style={{ height: '35px' }}
                                    class={generalstyles.roundbutton + '  mb-1 mx-1 text-capitalize'}
                                    onClick={() => {
                                        const merchantTransactions = fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data;

                                        // const exportData = merchantTransactions.map((transaction) => ({
                                        const exportData = merchantTransactions.map(({ id, createdAt, __typename, fromAccount, toAccount, auditedBy, sheetOrder, type, reciept, status, ...rest }) => ({
                                            ...rest,

                                            orderId: sheetOrder?.order?.id,
                                            // type: type
                                            //     .split(/(?=[A-Z])/)
                                            //     .join(' ')
                                            //     .replace(/^\w/, (c) => c.toUpperCase()),
                                            status: status
                                                .split(/(?=[A-Z])/)
                                                .join(' ')
                                                .replace(/^\w/, (c) => c.toUpperCase()),
                                            createdAt: createdAt,
                                        }));

                                        exportToExcel(exportData, 'merchantTransactions');
                                    }}
                                >
                                    Export
                                </button>
                            </div>
                            {/* )} */}
                            <div class="col-lg-12 p-0 mb-3">
                                <Pagination
                                    beforeCursor={fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.cursor?.beforeCursor}
                                    afterCursor={fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.cursor?.afterCursor}
                                    filter={filterobj}
                                    setfilter={setfilterobj}
                                />
                            </div>
                            <div className={' col-lg-12 table_responsive  scrollmenuclasssubscrollbar px-3 py-0 '}>
                                <div class="row m-0 w-100">
                                    <TransactionsTableView
                                        width={'50%'}
                                        query={fetchMerchantPaymentTransactionsQuery}
                                        paginationAttr="paginateMerchantPaymentTransactions"
                                        srctype="all"
                                        refetchFunc={() => {
                                            Refetch();
                                        }}
                                        allowSelect={true}
                                        selectedArray={selectedArray}
                                        setselectedArray={setselectedArray}
                                        hasOrder={true}
                                    />
                                    {/* <TransactionsTable hasOrder={true} width={'50%'} query={fetchMerchantPaymentTransactionsQuery} paginationAttr="paginateMerchantPaymentTransactions" srctype="all" /> */}
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
                </div>
                {isAuth([1, 60]) && (
                    <div class="col-lg-3 ">
                        <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                            <div class="col-lg-12 p-0 mb-3">
                                <span style={{ fontWeight: 600 }}>Total: </span>
                                {calculateFinancialTransactionsTotalQuery?.data?.calculateFinancialTransactionsTotal?.total}{' '}
                                {calculateFinancialTransactionsTotalQuery?.data?.calculateFinancialTransactionsTotal?.currency}
                            </div>
                            <div class="col-lg-12">
                                <button
                                    class={generalstyles.roundbutton + ' allcentered w-100'}
                                    onClick={async () => {
                                        if (isAuth([1, 60])) {
                                            if (selectedArray?.length != 0) {
                                                setpayload({ ...payload, allTransactions: false });

                                                setopenModal(true);
                                            } else {
                                                NotificationManager.warning('Choose transactions first', 'Warning!');
                                            }
                                        } else {
                                            NotificationManager.warning('Not Authorized', 'Warning!');
                                        }
                                    }}
                                >
                                    Complete
                                </button>
                            </div>
                            <div class="col-lg-12 mt-3">
                                <button
                                    class={generalstyles.roundbutton + ' allcentered w-100'}
                                    onClick={async () => {
                                        if (filterobj?.merchantIds?.length != 0 && filterobj?.merchantIds != undefined) {
                                            setpayload({ ...payload, allTransactions: true });
                                            setopenModal(true);
                                        } else {
                                            NotificationManager.warning('Choose Merchants first', 'Warning!');
                                        }
                                    }}
                                >
                                    Complete All Payments
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Modal
                show={openModal}
                onHide={() => {
                    setopenModal(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0">
                        <div class="col-lg-6 pt-3 ">
                            <div className="row w-100 m-0 p-0 text-capitalize">{'Account'}</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setopenModal(false);
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 py-2">
                        <Form
                            size={'md'}
                            submit={submit}
                            setsubmit={setsubmit}
                            attr={[{ name: 'Description', attr: 'description', type: 'textarea', size: '12' }]}
                            payload={payload}
                            setpayload={setpayload}
                            button1disabled={buttonLoadingContext}
                            button1class={generalstyles.roundbutton + ' mr-2 '}
                            button1placeholder={'Complete'}
                            button1onClick={async () => {
                                if (buttonLoadingContext) return;
                                setbuttonLoadingContext(true);
                                try {
                                    const { data } = await completeMerchantPaymentsMutation();
                                    refetchMerchantPaymentTransactionsQuery();
                                    setselectedArray([]);
                                    setopenModal(false);
                                    NotificationManager.success('', 'Success');
                                } catch (error) {
                                    let errorMessage = 'An unexpected error occurred';
                                    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                                        errorMessage = error.graphQLErrors[0].message || errorMessage;
                                    } else if (error.networkError) {
                                        errorMessage = error.networkError.message || errorMessage;
                                    } else if (error.message) {
                                        errorMessage = error.message;
                                    }

                                    NotificationManager.warning(errorMessage, 'Warning!');
                                }
                                setbuttonLoadingContext(false);
                            }}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default Finance;
