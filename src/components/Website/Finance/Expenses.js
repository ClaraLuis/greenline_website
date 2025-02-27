import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Modal } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import Select, { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';

import { DateRangePicker } from 'rsuite';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { NotificationManager } from 'react-notifications';
import API from '../../../API/API.js';
import Form from '../../Form.js';
import Pagination from '../../Pagination.js';
import SelectComponent from '../../SelectComponent.js';
import TransactionsTable from './TransactionsTable.js';
import MultiSelect from '../../MultiSelect.js';

const { ValueContainer, Placeholder } = components;

const Expenses = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, isAuth, setpagetitle_context, expenseTypeContext, transactionStatusTypeContext, transactionTypeContext, buttonLoadingContext, setbuttonLoadingContext } =
        useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL, createExpense, useMutationGQL, fetchExpenses, fetchFinancialAccounts, sendMyFinancialTransaction } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState({ open: false, type: '' });
    const [submit, setsubmit] = useState(false);

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
    const [filterExpensesObj, setfilterExpensesObj] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
        types: undefined,
        fromDate: undefined,
        toDate: undefined,
    });

    const fetchExpensesQuery = useQueryGQL('', fetchExpenses(), filterExpensesObj);
    // const { refetch: refetchExpensesQuery } = useQueryGQL('', fetchExpenses(), filterExpensesObj);
    const refetchExpensesQuery = () => fetchExpensesQuery.refetch();

    const fetchAllFinancialAccountsQuery = useQueryGQL('', fetchFinancialAccounts(), filterTransactionsObj);

    useEffect(() => {
        setpageactive_context('/expenses');
        setpagetitle_context('Finance');
    }, []);
    const [createExpenseMutation] = useMutationGQL(createExpense(), {
        type: expensepayload?.type,
        comment: expensepayload?.comment,
        fromAccountId: expensepayload?.fromAccountId,
        amount: expensepayload?.amount,
        receipt: expensepayload?.receipt,
    });

    const Refetch = () => {
        refetchExpensesQuery();
    };
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class="col-lg-12 p-0 px-2">
                    <div class={generalstyles.card + ' row m-0 w-100'}>
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                            <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                                Expenses
                            </p>
                        </div>
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                            {isAuth([1, 51, 23]) && (
                                <button
                                    style={{ height: '35px' }}
                                    class={generalstyles.roundbutton + '  mb-1 mx-1'}
                                    onClick={() => {
                                        setopenModal({ open: true, type: 'expense' });
                                    }}
                                >
                                    Add Expense
                                </button>
                            )}

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
                {isAuth([1, 51, 22]) && (
                    <div class="col-lg-12 p-0 px-2">
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
                                                    title={'Type'}
                                                    options={expenseTypeContext}
                                                    label={'label'}
                                                    value={'value'}
                                                    selected={filterExpensesObj?.types}
                                                    onClick={(option) => {
                                                        var tempArray = [...(filterExpensesObj?.types ?? [])];
                                                        if (option == 'All') {
                                                            tempArray = undefined;
                                                        } else {
                                                            if (!tempArray?.includes(option.value)) {
                                                                tempArray.push(option.value);
                                                            } else {
                                                                tempArray.splice(tempArray?.indexOf(option?.value), 1);
                                                            }
                                                        }
                                                        setfilterExpensesObj({ ...filterExpensesObj, types: tempArray?.length != 0 ? tempArray : undefined });
                                                    }}
                                                />
                                            </div>
                                            <div class=" col-lg-3 mb-md-2">
                                                <span>Date Range</span>
                                                <div class="mt-1" style={{ width: '100%' }}>
                                                    <DateRangePicker
                                                        // disabledDate={allowedMaxDays(30)}
                                                        // value={[filterExpensesObj?.fromDate, filterExpensesObj?.toDate]}
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
                                                                setfilterExpensesObj({
                                                                    ...filterExpensesObj,
                                                                    fromDate: event[0],
                                                                    toDate: event[1],
                                                                    // from_date: year1 + '-' + month1 + '-' + day1,
                                                                    // to_date: year2 + '-' + month2 + '-' + day2,
                                                                });
                                                            }
                                                        }}
                                                        onClean={() => {
                                                            setfilterExpensesObj({
                                                                ...filterExpensesObj,
                                                                fromDate: null,
                                                                toDate: null,
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
                    </div>
                )}
                <div class={' row m-0 w-100 mb-2 p-0 px-0'}>
                    {isAuth([1, 51, 22]) && (
                        <>
                            <div class="col-lg-12 p-0 mb-3">
                                <Pagination
                                    beforeCursor={fetchExpensesQuery?.data?.paginateExpenses?.cursor?.beforeCursor}
                                    afterCursor={fetchExpensesQuery?.data?.paginateExpenses?.cursor?.afterCursor}
                                    filter={filterExpensesObj}
                                    setfilter={setfilterExpensesObj}
                                />
                            </div>
                            <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
                                <TransactionsTable
                                    width={'50%'}
                                    query={fetchExpensesQuery}
                                    paginationAttr="paginateExpenses"
                                    srctype="expenses"
                                    refetchFunc={() => {
                                        Refetch();
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* <div class={generalstyles.card + ' mb-3 col-lg-12 p-2'}>
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
                    <div   className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}>
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
                                        filter: filterTransactionsObj,
                                        setfilter: setfilterTransactionsObj,
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
                                button1disabled={buttonLoadingContext}
                                button1class={generalstyles.roundbutton + '  mr-2 '}
                                button1placeholder={'Add expense'}
                                button1onClick={async () => {
                                    if (buttonLoadingContext) return;
                                    setbuttonLoadingContext(true);
                                    if (expensepayload?.type?.length != 0 && expensepayload?.amount?.length != 0 && expensepayload?.fromAccountId?.length != 0) {
                                        try {
                                            await createExpenseMutation();

                                            setopenModal({ open: false, type: '' });
                                            setexpensepayload({
                                                functype: 'add',
                                                type: '',
                                                fromAccountId: '',
                                                amount: '',
                                                receipt: '',
                                                comment: '',
                                            });
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
                                            setbuttonLoadingContext(false);

                                            NotificationManager.warning(errorMessage, 'Warning!');
                                            console.error('Error adding Merchant:', error);
                                        }
                                    } else {
                                        setbuttonLoadingContext(false);

                                        NotificationManager.warning('complete all missing fields', 'Warning!');
                                    }
                                    setbuttonLoadingContext(false);
                                }}
                            />
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};
export default Expenses;
