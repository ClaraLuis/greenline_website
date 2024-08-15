import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { FaLayerGroup } from 'react-icons/fa';
import Select, { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import { DateRangePicker } from 'rsuite';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import TransactionsTable from './TransactionsTable.js';
import AccountsTable from './AccountsTable.js';
import OrdersTable from '../Orders/OrdersTable.js';
import ExpensesTable from './ExpensesTable.js';
import Form from '../../Form.js';
import { NotificationManager } from 'react-notifications';
import Pagination from '../../Pagination.js';
import SelectComponent from '../../SelectComponent.js';
import * as XLSX from 'xlsx';

const { ValueContainer, Placeholder } = components;

const FinanceTransactions = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, isAuth, dateformatter, orderTypeContext, transactionStatusTypeContext, transactionTypeContext } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL, sendAnyFinancialTransaction, useMutationGQL, fetchTransactions, fetchFinancialAccounts, sendMyFinancialTransaction } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState({ open: false, type: '' });
    const [submit, setsubmit] = useState(false);

    const [transactionpayload, settransactionpayload] = useState({
        functype: 'add',
        type: '',
        description: undefined,
        fromAccountId: '',
        toAccountId: '',
        amount: '',
        receipt: undefined,
    });

    const [expensepayload, setexpensepayload] = useState({
        functype: 'add',
        type: '',
        fromAccountId: '',
        amount: '',
        receipt: '',
        comment: '',
    });

    const [filterTransactionsObj, setfilterTransactionsObj] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
        toAccountId: undefined,
        fromAccountId: undefined,
        status: undefined,
        type: undefined,
    });
    const fetchAllTransactionsQuery = useQueryGQL('', fetchTransactions(), filterTransactionsObj);
    const [buttonLoading, setbuttonLoading] = useState(false);
    const [filterAllFinancialAccountsObj, setfilterAllFinancialAccountsObj] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchAllFinancialAccountsQuery = useQueryGQL('', fetchFinancialAccounts(), filterAllFinancialAccountsObj);

    // const fetchusers = [];
    useEffect(() => {
        setpageactive_context('/financetransactions');
    }, []);
    const [sendAnyFinancialTransactionMutation] = useMutationGQL(sendAnyFinancialTransaction(), {
        type: transactionpayload?.type,
        description: transactionpayload?.description,
        fromAccountId: transactionpayload?.fromAccountId,
        toAccountId: transactionpayload?.toAccountId,
        amount: transactionpayload?.amount,
        receipt: transactionpayload?.receipt,
    });

    const [sendMyFinancialTransactionMutation] = useMutationGQL(sendMyFinancialTransaction(), {
        type: transactionpayload?.type,
        description: transactionpayload?.description,
        toAccountId: transactionpayload?.toAccountId,
        amount: transactionpayload?.amount,
        receipt: transactionpayload?.receipt,
    });

    const { refetch: refetchAllFinancialAccountsQuery } = useQueryGQL('', fetchFinancialAccounts(), filterAllFinancialAccountsObj);

    const Refetch = () => {
        refetchAllFinancialAccountsQuery();
    };

    const exportToExcel = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Transactions
                    </p>
                </div>
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                    <div class="row m-0 w-100 d-flex align-items-center justify-content-end ">
                        {isAuth([1, 51, 28]) && (
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + '  mb-1 mx-1'}
                                onClick={() => {
                                    setopenModal({ open: true, type: 'transaction' });
                                }}
                            >
                                Add Transaction
                            </button>
                        )}
                        <button
                            style={{ height: '35px' }}
                            class={generalstyles.roundbutton + '  mb-1 mx-1'}
                            onClick={() => {
                                const transactions = fetchAllTransactionsQuery?.data?.paginateFinancialTransaction?.data;

                                const exportData = transactions.map((transaction) => ({
                                    ...transaction,
                                    fromAccount: transaction.fromAccount?.name,
                                    toAccount: transaction.toAccount?.name,
                                }));

                                exportToExcel(exportData, 'transactions');
                            }}
                        >
                            Export
                        </button>
                    </div>

                    {/* <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + '  mb-1 mx-1'}
                                onClick={() => {
                                    setopenModal({ open: true, type: 'expense' });
                                }}
                            >
                                Add Expense
                            </button> */}
                </div>
                <div class={generalstyles.filter_container + ' mb-3 col-lg-12 p-2'}>
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
                                            Type
                                        </label>
                                        <Select
                                            options={[{ label: 'All', value: undefined }, ...transactionTypeContext]}
                                            styles={defaultstyles}
                                            value={[{ label: 'All', value: undefined }, ...transactionTypeContext].filter((option) => option.value == filterTransactionsObj?.type)}
                                            onChange={(option) => {
                                                setfilterTransactionsObj({ ...filterTransactionsObj, type: option.value });
                                            }}
                                        />
                                    </div>
                                    <div class={'col-lg-2'} style={{ marginBottom: '15px' }}>
                                        <label for="name" class={formstyles.form__label}>
                                            Status
                                        </label>
                                        <Select
                                            options={[{ label: 'All', value: undefined }, ...transactionStatusTypeContext]}
                                            styles={defaultstyles}
                                            value={[{ label: 'All', value: undefined }, ...transactionStatusTypeContext].filter((option) => option.value == filterTransactionsObj?.status)}
                                            onChange={(option) => {
                                                setfilterTransactionsObj({ ...filterTransactionsObj, status: option.value });
                                            }}
                                        />
                                    </div>
                                    <div className={'col-lg-2'} style={{ marginBottom: '15px' }}>
                                        <SelectComponent
                                            title={'From Account'}
                                            filter={filterAllFinancialAccountsObj}
                                            setfilter={setfilterAllFinancialAccountsObj}
                                            options={fetchAllFinancialAccountsQuery}
                                            attr={'paginateFinancialAccounts'}
                                            label={'name'}
                                            value={'id'}
                                            payload={filterTransactionsObj}
                                            payloadAttr={'fromAccountId'}
                                            onClick={(option) => {
                                                setfilterTransactionsObj({
                                                    ...filterTransactionsObj,
                                                    fromAccountId: option?.id,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className={'col-lg-2'} style={{ marginBottom: '15px' }}>
                                        <SelectComponent
                                            title={'To Account'}
                                            filter={filterAllFinancialAccountsObj}
                                            setfilter={setfilterAllFinancialAccountsObj}
                                            options={fetchAllFinancialAccountsQuery}
                                            attr={'paginateFinancialAccounts'}
                                            label={'name'}
                                            value={'id'}
                                            payload={filterTransactionsObj}
                                            payloadAttr={'toAccountId'}
                                            onClick={(option) => {
                                                setfilterTransactionsObj({
                                                    ...filterTransactionsObj,
                                                    toAccountId: option?.id,
                                                });
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
                                                        const start = event[0];
                                                        const startdate = new Date(start);
                                                        const year1 = startdate.getFullYear();
                                                        const month1 = startdate.getMonth() + 1; // Months are zero-indexed
                                                        const day1 = startdate.getDate();

                                                        const end = event[1];
                                                        const enddate = new Date(end);
                                                        const year2 = enddate.getFullYear();
                                                        const month2 = enddate.getMonth() + 1; // Months are zero-indexed
                                                        const day2 = enddate.getDate();
                                                        setfilterTransactionsObj({ ...filterTransactionsObj, fromDate: event[0], toDate: event[1] });
                                                    }
                                                }}
                                                onClean={() => {
                                                    setfilterTransactionsObj({ ...filterTransactionsObj, fromDate: null, toDate: null });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </AccordionItemPanel>
                        </AccordionItem>
                    </Accordion>
                </div>

                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Transactions</span>
                        </p>
                    </div>
                    {isAuth([1, 27, 51]) && (
                        <>
                            <div class="col-lg-12 p-0">
                                <Pagination
                                    beforeCursor={fetchAllTransactionsQuery?.data?.paginateFinancialTransaction?.cursor?.beforeCursor}
                                    afterCursor={fetchAllTransactionsQuery?.data?.paginateFinancialTransaction?.cursor?.afterCursor}
                                    filter={filterAllFinancialAccountsObj}
                                    setfilter={setfilterAllFinancialAccountsObj}
                                />
                            </div>
                            <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                                <TransactionsTable
                                    width={'50%'}
                                    query={fetchAllTransactionsQuery}
                                    paginationAttr="paginateFinancialTransaction"
                                    srctype="all"
                                    refetchFunc={() => {
                                        Refetch();
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>

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
                                            Type
                                        </label>
                                        <Select
                                            options={[{ label: 'All', value: 'all' }, ...expenseTypeContext]}
                                            styles={defaultstyles}
                                            value={
                                                [{ label: 'All', value: 'all' }, ...expenseTypeContext]
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
                </div>

                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Expenses</span>
                        </p>
                    </div>
                    <div   className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <ExpensesTable />
                    </div>
                </div> */}
                <Modal
                    show={openModal?.open}
                    onHide={() => {
                        setopenModal({ open: false, type: '' });
                    }}
                    centered
                    size={'md'}
                >
                    <Modal.Header>
                        <div className="row w-100 m-0 p-0">
                            <div class="col-lg-6 pt-3 ">
                                <div className="row w-100 m-0 p-0 text-capitalize">{openModal?.type}</div>
                            </div>
                            <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                                <div
                                    class={'close-modal-container'}
                                    onClick={() => {
                                        setopenModal({ open: false, type: '' });
                                    }}
                                >
                                    <IoMdClose />
                                </div>
                            </div>{' '}
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div class="row m-0 w-100 py-2">
                            {openModal?.type == 'transaction' && !fetchAllFinancialAccountsQuery?.loading && (
                                <Form
                                    size={'md'}
                                    submit={submit}
                                    setsubmit={setsubmit}
                                    attr={
                                        isAuth([1, 51])
                                            ? [
                                                  {
                                                      name: 'Type',
                                                      attr: 'type',
                                                      type: 'select',
                                                      options: transactionTypeContext,
                                                      size: '12',
                                                  },
                                                  { name: 'Description', attr: 'description', type: 'textarea', size: '12' },

                                                  {
                                                      title: 'From Account',
                                                      filter: filterAllFinancialAccountsObj,
                                                      setfilter: setfilterAllFinancialAccountsObj,
                                                      options: fetchAllFinancialAccountsQuery,
                                                      optionsAttr: 'paginateFinancialAccounts',
                                                      label: 'name',
                                                      value: 'id',
                                                      size: '12',
                                                      attr: 'fromAccountId',
                                                      type: 'fetchSelect',
                                                  },

                                                  {
                                                      title: 'To Account',
                                                      filter: filterAllFinancialAccountsObj,
                                                      setfilter: setfilterAllFinancialAccountsObj,
                                                      options: fetchAllFinancialAccountsQuery,
                                                      optionsAttr: 'paginateFinancialAccounts',
                                                      label: 'name',
                                                      value: 'id',
                                                      size: '12',
                                                      attr: 'toAccountId',
                                                      type: 'fetchSelect',
                                                  },
                                                  { name: 'Amount', attr: 'amount', type: 'number', size: '12' },
                                                  { name: 'Receipt', attr: 'receipt', previewerAttr: 'previewerReceipt', type: 'image', size: '12' },
                                              ]
                                            : [
                                                  {
                                                      name: 'Type',
                                                      attr: 'type',
                                                      type: 'select',
                                                      options: transactionTypeContext,
                                                      size: '12',
                                                  },
                                                  { name: 'Description', attr: 'description', type: 'textarea', size: '12' },

                                                  {
                                                      title: 'To Account',
                                                      filter: filterAllFinancialAccountsObj,
                                                      setfilter: setfilterAllFinancialAccountsObj,
                                                      options: fetchAllFinancialAccountsQuery,
                                                      optionsAttr: 'paginateFinancialAccounts',
                                                      label: 'name',
                                                      value: 'id',
                                                      size: '12',
                                                      attr: 'toAccountId',
                                                      type: 'fetchSelect',
                                                  },
                                                  { name: 'Amount', attr: 'amount', type: 'number', size: '12' },
                                                  { name: 'Receipt', attr: 'receipt', previewerAttr: 'previewerReceipt', type: 'image', size: '12' },
                                              ]
                                    }
                                    payload={transactionpayload}
                                    setpayload={settransactionpayload}
                                    button1disabled={buttonLoading}
                                    button1class={generalstyles.roundbutton + '  mr-2 my-2 '}
                                    button1placeholder={'Add transaction'}
                                    button1onClick={async () => {
                                        setbuttonLoading(true);
                                        if (
                                            transactionpayload?.type?.length != 0 &&
                                            transactionpayload?.amount?.length != 0 &&
                                            transactionpayload?.fromAccountId?.length != 0 &&
                                            transactionpayload?.toAccountId?.length != 0
                                        ) {
                                            try {
                                                if (isAuth([1, 51])) {
                                                    await sendAnyFinancialTransactionMutation();
                                                } else {
                                                    await sendMyFinancialTransactionMutation();
                                                }
                                                setopenModal({ open: false, type: '' });
                                                Refetch();
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
                                                console.error('Error adding Merchant:', error);
                                            }
                                        } else {
                                            NotificationManager.warning('complete all missing fields', 'Warning!');
                                        }
                                        setbuttonLoading(false);
                                    }}
                                />
                            )}

                            {openModal?.type == 'expense' && (
                                <Form
                                    size={'md'}
                                    submit={submit}
                                    setsubmit={setsubmit}
                                    attr={[
                                        {
                                            name: 'Type',
                                            attr: 'type',
                                            type: 'select',
                                            options: expenseTypeContext,
                                            size: '12',
                                        },

                                        {
                                            title: 'From Account',
                                            filter: filterAllFinancialAccountsObj,
                                            setfilter: setfilterAllFinancialAccountsObj,
                                            options: fetchAllFinancialAccountsQuery,
                                            optionsAttr: 'paginateFinancialAccounts',
                                            label: 'name',
                                            value: 'id',
                                            size: '12',
                                            attr: 'fromAccountId',
                                            type: 'fetchSelect',
                                        },
                                        { name: 'Amount', attr: 'amount', type: 'number', size: '12' },
                                        { name: 'Receipt', attr: 'receipt', type: 'image', size: '12' },
                                        { name: 'Comment', attr: 'comment', type: 'textarea', size: '12' },
                                    ]}
                                    payload={expensepayload}
                                    setpayload={setexpensepayload}
                                    // button1disabled={UserMutation.isLoading}
                                    button1class={generalstyles.roundbutton + '  mr-2 '}
                                    button1placeholder={'Add expense'}
                                    button1onClick={() => {
                                        setopenModal({ open: false, type: '' });
                                    }}
                                />
                            )}
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};
export default FinanceTransactions;
