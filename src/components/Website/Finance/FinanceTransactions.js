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

const { ValueContainer, Placeholder } = components;

const FinanceTransactions = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, expensesTypeContext, dateformatter, orderTypeContext, transactionStatusesContext, transactionTypesContext } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL, sendAnyFinancialTransaction, useMutationGQL, fetchTransactions, fetchFinancialAccounts } = API();

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

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Transactions
                    </p>
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
                                            options={[{ label: 'All', value: undefined }, ...transactionTypesContext]}
                                            styles={defaultstyles}
                                            value={[{ label: 'All', value: undefined }, ...transactionTypesContext].filter((option) => option.value == filterTransactionsObj?.type)}
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
                                            options={[{ label: 'All', value: undefined }, ...transactionStatusesContext]}
                                            styles={defaultstyles}
                                            value={[{ label: 'All', value: undefined }, ...transactionStatusesContext].filter((option) => option.value == filterTransactionsObj?.status)}
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
                                                    fromAccountId: option.id,
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
                                                    toAccountId: option.id,
                                                });
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
                            <span style={{ color: 'var(--info)' }}>Transactions</span>
                        </p>
                    </div>
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
                                // Refetch();
                            }}
                        />
                    </div>
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
                                            options={[{ label: 'All', value: 'all' }, ...expensesTypeContext]}
                                            styles={defaultstyles}
                                            value={
                                                [{ label: 'All', value: 'all' }, ...expensesTypeContext]
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
            </div>
        </div>
    );
};
export default FinanceTransactions;
