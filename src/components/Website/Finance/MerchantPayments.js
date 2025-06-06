import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { DateRangePicker } from 'rsuite';

import { AiOutlineClose } from 'react-icons/ai';

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
import TransactionsTable from './TransactionsTable.js';
import Pagination from '../../Pagination.js';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';
import SelectComponent from '../../SelectComponent.js';
import * as XLSX from 'xlsx';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';
import Decimal from 'decimal.js';
import MerchantSelectComponent from '../../selectComponents/MerchantSelectComponent.js';
import TransactionsTableView from './TransactionsTableView.js';

const MerchantPayments = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, isAuth, setpagetitle_context, buttonLoadingContext, setbuttonLoadingContext, useLoadQueryParamsToPayload, updateQueryParamContext } =
        useContext(Contexthandlerscontext);
    const {
        useQueryGQL,
        fetchMerchants,
        useMutationGQL,
        calculateFinancialTransactionsTotal,
        updateFinancialAccount,
        fetchMerchantPaymentTransactions,
        completeMerchantPayments,
        merchantPaymentsSummary,
        fetchFinancialAccounts,
    } = API();
    const cookies = new Cookies();

    const { lang, langdetect } = useContext(LanguageContext);
    const [openModal, setopenModal] = useState(false);
    const [chosenMerchantsArray, setchosenMerchantsArray] = useState([]);
    const [total, setTotal] = useState(0);
    const [submit, setsubmit] = useState(false);
    const [selectedArray, setselectedArray] = useState([]);

    const [payload, setpayload] = useState({
        functype: 'add',
        name: '',
        type: '',
        merchantId: undefined,
        balance: 0,
        userId: undefined,
    });
    const [filterobj, setfilterobj] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
        merchantIds: undefined,
        processing: undefined,
    });
    useLoadQueryParamsToPayload(setfilterobj);
    const [filterMerchanrPaymentSummaryObj, setfilterMerchanrPaymentSummaryObj] = useState({
        // merchantIds: [1],
        startDate: undefined,
        endDate: undefined,
    });
    const merchantPaymentsSummaryQuery = useQueryGQL('', merchantPaymentsSummary(), filterMerchanrPaymentSummaryObj);

    const fetchMerchantPaymentTransactionsQuery = useQueryGQL('', fetchMerchantPaymentTransactions(), filterobj);
    const { isAsc, limit, processing, ...filteredFilterObj } = filterobj;
    const calculateFinancialTransactionsTotalQuery = useQueryGQL('', calculateFinancialTransactionsTotal(), { ...filteredFilterObj, category: 'merchantOrderPayment' });

    useEffect(() => {
        setpageactive_context('/merchantpayments');
        setpagetitle_context('Finance');
    }, []);

    const { refetch: refetchMerchantPaymentTransactionsQuery } = useQueryGQL('', fetchMerchantPaymentTransactions(), filterobj);

    const [completeMerchantPaymentsMutation] = useMutationGQL(completeMerchantPayments(), {
        transactionIds: selectedArray,
        description: payload?.description,
        allTransactions: payload?.allTransactions,
    });
    const [updateFinancialAccountMutation] = useMutationGQL(updateFinancialAccount(), {
        name: payload?.name,
        id: payload?.id,
    });

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
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class="col-lg-12 px-3">
                    <div class={generalstyles.card + ' row m-0 w-100'}>
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                            <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                                Merchant Payments
                            </p>
                        </div>
                        <div class="col-lg-6 co-mf-6 p-0 d-flex justify-content-end">
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + '  mb-1 mx-1 text-capitalize'}
                                onClick={() => {
                                    const merchantTransactions = fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data;

                                    // const exportData = merchantTransactions.map((transaction) => ({
                                    const exportData = merchantTransactions.map(({ id, createdAt, __typename, fromAccount, toAccount, auditedBy, sheetOrder, type, ...rest }) => ({
                                        ...rest,
                                        fromAccount: fromAccount?.name,
                                        toAccount: toAccount?.name,
                                        auditedBy: auditedBy?.name,
                                        orderId: sheetOrder?.order?.id,
                                        type: type
                                            .split(/(?=[A-Z])/)
                                            .join(' ')
                                            .replace(/^\w/, (c) => c.toUpperCase()),
                                    }));

                                    exportToExcel(exportData, 'merchantTransactions');
                                }}
                            >
                                Export
                            </button>
                        </div>
                    </div>
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
                                                                updateQueryParamContext('isAsc', option?.value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class={'col-lg-2'} style={{ marginBottom: '15px' }}>
                                                <MerchantSelectComponent
                                                    type="multi"
                                                    attr={'paginateMerchants'}
                                                    label={'name'}
                                                    value={'id'}
                                                    selected={filterobj?.merchantIds}
                                                    onClick={(option) => {
                                                        const tempArray = [...(filterobj?.merchantIds ?? [])];

                                                        if (option === 'All') {
                                                            setfilterobj({ ...filterobj, merchantIds: undefined });
                                                            updateQueryParamContext('merchantIds', undefined);
                                                        } else {
                                                            const index = tempArray.indexOf(option?.id);
                                                            if (index === -1) {
                                                                tempArray.push(option?.id);
                                                            } else {
                                                                tempArray.splice(index, 1);
                                                            }

                                                            setfilterobj({ ...filterobj, merchantIds: tempArray.length ? tempArray : undefined });
                                                            updateQueryParamContext('merchantIds', tempArray);
                                                        }
                                                    }}
                                                />
                                                {/* <MerchantSelectComponent
                                                    type="single"
                                                    label={'name'}
                                                    value={'id'}
                                                    onClick={(option) => {
                                                        var temp = filterobj?.merchantIds ?? [];

                                                        if (option != undefined) {
                                                            var exist = false;
                                                            filterobj?.merchantIds?.map((i, ii) => {
                                                                if (i == option?.id) {
                                                                    exist = true;
                                                                }
                                                            });
                                                            if (!exist) {
                                                                chosenMerchantsArray.push(option);
                                                                temp.push(option?.id);
                                                            }
                                                        } else {
                                                            temp = undefined;
                                                            setchosenMerchantsArray([]);
                                                        }

                                                        setfilterobj({ ...filterobj, merchantIds: temp });
                                                        updateQueryParamContext('merchantIds', temp);
                                                    }}
                                                /> */}
                                            </div>
                                            <div class={'col-lg-2'} style={{ marginBottom: '15px' }}>
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
                                                    defaultValue={[
                                                        { label: 'All', value: undefined },
                                                        { label: 'Processing', value: true },
                                                        { label: 'Completed', value: false },
                                                    ].filter((option) => option?.id == filterobj?.processing)}
                                                    onChange={(option) => {
                                                        setfilterobj({ ...filterobj, processing: option.value });
                                                        updateQueryParamContext('processing', option.value);
                                                    }}
                                                />
                                            </div>
                                            <div class=" col-lg-3 mb-md-2">
                                                <span>Date Range</span>
                                                <div class="mt-1" style={{ width: '100%' }}>
                                                    <DateRangePicker
                                                        // disabledDate={allowedMaxDays(30)}
                                                        // value={[filterorders?.fromDate, filterorders?.toDate]}
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
                                            <div class="col-lg-12">
                                                <div class="row m-0 w-100">
                                                    {chosenMerchantsArray?.map((item, index) => {
                                                        return (
                                                            <div
                                                                style={{
                                                                    background: '#ECECEC',
                                                                    padding: '5px 10px',
                                                                    cursor: 'pointer',
                                                                    borderRadius: '8px',
                                                                    justifyContent: 'space-between',
                                                                    width: 'fit-content',
                                                                    fontSize: '11px',
                                                                    minWidth: 'fit-content',
                                                                }}
                                                                className="d-flex align-items-center mr-2 mb-1"
                                                                onClick={() => {
                                                                    var temp = [...filterobj?.merchantIds];
                                                                    chosenMerchantsArray.splice(index, 1);
                                                                    temp.splice(index, 1);
                                                                    setfilterobj({ ...filterobj, merchantIds: temp });
                                                                }}
                                                            >
                                                                {item?.name}
                                                                <AiOutlineClose size={12} color="#6C757D" className="ml-2" />
                                                            </div>
                                                        );
                                                    })}
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
                <div class="col-lg-12 p-0 ">
                    <div class="row m-0 w-100">
                        <div class="col-lg-9 p-0">
                            {isAuth([1, 51, 19, 60]) && (
                                <div class={' row m-0 w-100 mb-2 p-0 px-0'}>
                                    <div class="col-lg-12 px-3">
                                        <div class={generalstyles.card + ' row m-0 w-100'}>
                                            <div className="col-lg-6 p-0 d-flex justify-content-end ">
                                                <div
                                                    onClick={() => {
                                                        var temp = [];
                                                        if (selectedArray?.length != fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.length) {
                                                            fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.map((i, ii) => {
                                                                temp.push(i.id);
                                                            });
                                                        }
                                                        setselectedArray(temp);
                                                    }}
                                                    class="row m-0 w-100 d-flex align-items-center"
                                                    style={{
                                                        cursor: 'pointer',
                                                        // color:
                                                        //     selectedArray?.length == fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.length ? 'var(--success)' : '',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '30px',
                                                            height: '30px',
                                                        }}
                                                        className="iconhover allcentered mr-1"
                                                    >
                                                        {selectedArray?.length != fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.length && (
                                                            <FiCircle
                                                                style={{ transition: 'all 0.4s' }}
                                                                color={
                                                                    selectedArray?.length == fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.length
                                                                        ? 'var(--success)'
                                                                        : ''
                                                                }
                                                                size={18}
                                                            />
                                                        )}
                                                        {selectedArray?.length == fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.length && (
                                                            <FiCheckCircle
                                                                style={{ transition: 'all 0.4s' }}
                                                                color={
                                                                    selectedArray?.length == fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.length
                                                                        ? 'var(--success)'
                                                                        : ''
                                                                }
                                                                size={18}
                                                            />
                                                        )}
                                                    </div>
                                                    {selectedArray?.length != fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.data?.length
                                                        ? 'Select All'
                                                        : 'Deselect All'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-lg-12 p-0 mb-3">
                                        <Pagination
                                            beforeCursor={fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.cursor?.beforeCursor}
                                            afterCursor={fetchMerchantPaymentTransactionsQuery?.data?.paginateMerchantPaymentTransactions?.cursor?.afterCursor}
                                            filter={filterobj}
                                            setfilter={setfilterobj}
                                        />
                                    </div>
                                    <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar px-3 py-0 '}>
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
                                    </div>
                                </div>
                            )}
                        </div>
                        <div class="col-lg-3 pr-1 ">
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
                    </div>
                </div>
                {/* <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Transactions</span>
                        </p>
                    </div>
                    <div   className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                        <TransactionsTable />
                    </div>
                </div> */}
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
export default MerchantPayments;
