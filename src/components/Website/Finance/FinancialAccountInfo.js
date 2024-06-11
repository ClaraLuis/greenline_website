import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup, FaMoneyBill } from 'react-icons/fa';
import Select, { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import TransactionsTable from './TransactionsTable.js';
import AccountsTable from './AccountsTable.js';
import ExpensesTable from './ExpensesTable.js';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { IoMdTime } from 'react-icons/io';
import Form from '../../Form.js';
import { NotificationManager } from 'react-notifications';
import Pagination from '../../Pagination.js';

const { ValueContainer, Placeholder } = components;

const FinancialAccountInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, financialAccountTypesContext, transactionTypesContext, isAuth } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL, fetchFinancialAccounts, fetchTransactions, sendAnyFinancialTransaction, useMutationGQL, sendMyFinancialTransaction } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [openModal, setopenModal] = useState({ open: false, type: '' });

    const [accountItem, setaccountItem] = useState({ id: '1', name: 'Account 1', type: 'hub', user: 'User 1', merchant: 'Merchant 1', balance: '1000' });
    const [transactionpayload, settransactionpayload] = useState({
        functype: 'add',
        type: '',
        description: undefined,
        fromAccountId: '',
        toAccountId: '',
        amount: '',
        receipt: undefined,
    });
    const [submit, setsubmit] = useState(false);

    const [filterobj, setfilterobj] = useState({
        isAsc: true,
        limit: 100,
        afterCursor: undefined,
        beforeCursor: undefined,
        name: queryParameters.get('accountName'),
    });
    const [filterSentTransactionsObj, setfilterSentTransactionsObj] = useState({
        isAsc: true,
        limit: 100,
        afterCursor: undefined,
        beforeCursor: undefined,
        fromAccountId: parseInt(queryParameters.get('accountId')),
    });

    const [filterRecievedTransactionsObj, setfilterRecievedTransactionsObj] = useState({
        isAsc: true,
        limit: 100,
        afterCursor: undefined,
        beforeCursor: undefined,
        toAccountId: parseInt(queryParameters.get('accountId')),
    });

    const fetchOneFinancialAccountsQuery = useQueryGQL('', fetchFinancialAccounts(), filterobj);
    const fetchSenttTransactionsQuery = useQueryGQL('', fetchTransactions(), filterSentTransactionsObj);
    const fetchRecievedTransactionsQuery = useQueryGQL('', fetchTransactions(), filterRecievedTransactionsObj);

    const [filterAllFinancialAccountsObj, setfilterAllFinancialAccountsObj] = useState({
        isAsc: true,
        limit: 100,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchAllFinancialAccountsQuery = useQueryGQL('', fetchFinancialAccounts(), filterAllFinancialAccountsObj);

    const { refetch: refetchOneFinancialAccountsQuery } = useQueryGQL('', fetchFinancialAccounts(), filterobj);
    const { refetch: refetchSenttTransactionsQuery } = useQueryGQL('', fetchTransactions(), filterSentTransactionsObj);
    const { refetch: refetchRecievedTransactionsQuery } = useQueryGQL('', fetchTransactions(), filterRecievedTransactionsObj);
    const { refetch: refetchAllFinancialAccountsQuery } = useQueryGQL('', fetchFinancialAccounts(), filterAllFinancialAccountsObj);

    const Refetch = () => {
        refetchOneFinancialAccountsQuery();
        refetchSenttTransactionsQuery();
        refetchRecievedTransactionsQuery();
        refetchAllFinancialAccountsQuery();
    };
    useEffect(() => {
        setpageactive_context('/financialaccounts');
        fetchOneFinancialAccountsQuery?.data?.paginateFinancialAccounts?.data?.map((item, index) => {
            if (item.id == queryParameters.get('accountId')) {
                setaccountItem({ ...item });
            }
        });
    }, [fetchOneFinancialAccountsQuery?.data?.paginateFinancialAccounts?.data]);

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

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Financial Account
                    </p>
                </div>

                <div className="col-lg-5 p-1">
                    <div class={generalstyles.card + ' p-3 row m-0 w-100 allcentered'}>
                        <div className="col-lg-6 p-0">
                            <span style={{ fontWeight: 700, fontSize: '16px' }}># {accountItem?.id}</span>
                        </div>
                        <div className="col-lg-6 p-0 d-flex justify-content-end align-items-center">
                            <div className={' wordbreak text-success bg-light-success rounded-pill allcentered  '}>
                                {financialAccountTypesContext?.map((i, ii) => {
                                    if (i.value == accountItem?.type) {
                                        return <span>{i.label}</span>;
                                    }
                                })}
                            </div>
                        </div>
                        <div className="col-lg-12 p-0 my-2">
                            <hr className="m-0" />
                        </div>
                        <div className="col-lg-12 p-0 mb-2">
                            <span class="d-flex align-items-center" style={{ fontWeight: 600 }}>
                                <MdOutlineAccountCircle class="mr-1" />
                                {accountItem?.name}
                            </span>
                        </div>
                        <div className="col-lg-12 p-0 mb-2">
                            <span class="d-flex align-items-center" style={{ fontWeight: 600 }}>
                                <FaMoneyBill class="mr-1" />
                                {accountItem?.balance}
                            </span>
                        </div>
                        <div className="col-lg-12 p-0 mb-2 d-flex justify-content-end">
                            <span class="d-flex align-items-center" style={{ fontWeight: 500, color: 'grey', fontSize: '12px' }}>
                                <IoMdTime class="mr-1" />
                                {accountItem?.createdAt}
                            </span>
                        </div>
                    </div>
                </div>
                <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                    <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-md-0">
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                            <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                                Transactions
                            </p>
                        </div>
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                            <button
                                style={{ height: '35px' }}
                                class={generalstyles.roundbutton + '  mb-1 mx-1'}
                                onClick={() => {
                                    setopenModal({ open: true, type: 'transaction' });
                                }}
                            >
                                Add Transaction
                            </button>
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
                    </div>
                </div>
                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0 text-uppercase" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>sent transactions</span>
                        </p>
                    </div>
                    <div class="col-lg-12 p-0">
                        <Pagination
                            beforeCursor={fetchSenttTransactionsQuery?.data?.paginateFinancialTransaction?.cursor?.beforeCursor}
                            afterCursor={fetchSenttTransactionsQuery?.data?.paginateFinancialTransaction?.cursor?.afterCursor}
                            filter={filterSentTransactionsObj}
                            setfilter={setfilterSentTransactionsObj}
                        />
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <TransactionsTable
                            query={fetchSenttTransactionsQuery}
                            paginationAttr="paginateFinancialTransaction"
                            srctype="sent"
                            refetchFunc={() => {
                                Refetch();
                            }}
                        />
                    </div>
                </div>
                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0 text-uppercase" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>recieved transactions</span>
                        </p>
                    </div>
                    <div class="col-lg-12 p-0">
                        <Pagination
                            beforeCursor={fetchRecievedTransactionsQuery?.data?.paginateFinancialTransaction?.cursor?.beforeCursor}
                            afterCursor={fetchRecievedTransactionsQuery?.data?.paginateFinancialTransaction?.cursor?.afterCursor}
                            filter={filterRecievedTransactionsObj}
                            setfilter={setfilterRecievedTransactionsObj}
                        />
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <TransactionsTable
                            query={fetchRecievedTransactionsQuery}
                            paginationAttr="paginateFinancialTransaction"
                            srctype="recieved"
                            refetchFunc={() => {
                                Refetch();
                            }}
                        />
                    </div>
                </div>
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
                                                      options: transactionTypesContext,
                                                      size: '12',
                                                  },
                                                  { name: 'Description', attr: 'description', type: 'textarea', size: '12' },
                                                  {
                                                      name: 'From Account',
                                                      attr: 'fromAccountId',
                                                      type: 'select',
                                                      options: [{ name: 'Choose', id: '' }, ...fetchAllFinancialAccountsQuery?.data?.paginateFinancialAccounts?.data],
                                                      optionLabel: 'name',
                                                      optionValue: 'id',
                                                      size: '12',
                                                  },
                                                  {
                                                      name: 'To Account',
                                                      attr: 'toAccountId',
                                                      type: 'select',
                                                      options: [{ name: 'Choose', id: '' }, ...fetchAllFinancialAccountsQuery?.data?.paginateFinancialAccounts?.data],
                                                      optionLabel: 'name',
                                                      optionValue: 'id',
                                                      size: '12',
                                                  },
                                                  { name: 'Amount', attr: 'amount', type: 'number', size: '12' },
                                                  { name: 'Receipt', attr: 'receipt', previewerAttr: 'previewerReceipt', type: 'image', size: '12' },
                                              ]
                                            : [
                                                  {
                                                      name: 'Type',
                                                      attr: 'type',
                                                      type: 'select',
                                                      options: transactionTypesContext,
                                                      size: '12',
                                                  },
                                                  { name: 'Description', attr: 'description', type: 'textarea', size: '12' },

                                                  {
                                                      name: 'To Account',
                                                      attr: 'toAccountId',
                                                      type: 'select',
                                                      options: [{ name: 'Choose', id: '' }, ...fetchAllFinancialAccountsQuery?.data?.paginateFinancialAccounts?.data],
                                                      optionLabel: 'name',
                                                      optionValue: 'id',
                                                      size: '12',
                                                  },
                                                  { name: 'Amount', attr: 'amount', type: 'number', size: '12' },
                                                  { name: 'Receipt', attr: 'receipt', previewerAttr: 'previewerReceipt', type: 'image', size: '12' },
                                              ]
                                    }
                                    payload={transactionpayload}
                                    setpayload={settransactionpayload}
                                    // button1disabled={UserMutation.isLoading}
                                    button1class={generalstyles.roundbutton + '  mr-2 my-2 '}
                                    button1placeholder={'Add transaction'}
                                    button1onClick={async () => {
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
                                                NotificationManager.warning(error, 'Warning!');
                                            }
                                        } else {
                                            NotificationManager.warning('complete all missing fields', 'Warning!');
                                        }
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
                                            options: expensesTypeContext,
                                            size: '12',
                                        },
                                        {
                                            name: 'From Account',
                                            attr: 'fromAccountId',
                                            type: 'select',
                                            options: [
                                                { label: 'account 1', value: 'account1' },
                                                { label: 'account 2', value: 'account2' },
                                            ],
                                            size: '12',
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
export default FinancialAccountInfo;
