import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { Modal } from 'react-bootstrap';
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
import { IoMdClose } from 'react-icons/io';

const { ValueContainer, Placeholder } = components;

const FinanceTransactions = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, expensesTypeContext, dateformatter, orderTypeContext, transactionStatusesContext, transactionTypesContext } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState({ open: false, type: '' });
    const [submit, setsubmit] = useState(false);
    const [chosenracks, setchosenracks] = useState([]);
    const [itemsarray, setitemsarray] = useState([
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
    ]);

    const [transactionpayload, settransactionpayload] = useState({
        functype: 'add',
        type: '',
        description: '',
        fromAccountId: '',
        toAccountId: '',
        amount: '',
        receipt: '',
    });

    const [expensepayload, setexpensepayload] = useState({
        functype: 'add',
        type: '',
        fromAccountId: '',
        amount: '',
        receipt: '',
        comment: '',
    });
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });

    const fetchusers = useQueryGQL('', fetchUsers());
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
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 pr-3 pr-md-1 pr-sm-0 d-flex align-items-center justify-content-end pb-1 '}>
                    <button
                        style={{ height: '35px' }}
                        class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1 mx-1'}
                        onClick={() => {
                            setopenModal({ open: true, type: 'transaction' });
                        }}
                    >
                        Add Transaction
                    </button>
                    <button
                        style={{ height: '35px' }}
                        class={generalstyles.roundbutton + ' bg-info bg-infohover mb-1 mx-1'}
                        onClick={() => {
                            setopenModal({ open: true, type: 'expense' });
                        }}
                    >
                        Add Expense
                    </button>
                </div>
                <div class={generalstyles.filter_container + ' mb-3 col-lg-12 p-2'}>
                    <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                        <AccordionItem class={`${generalstyles.innercard}` + ' '}>
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
                                                                <BsChevronDown />
                                                            </i>
                                                        );
                                                    } else {
                                                        return (
                                                            <i class="h-100 d-flex align-items-center justify-content-center">
                                                                <BsChevronUp />
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
                                            options={[{ label: 'All', value: 'all' }, ...transactionTypesContext]}
                                            styles={defaultstyles}
                                            value={
                                                [{ label: 'All', value: 'all' }, ...transactionTypesContext]
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
                                    <div class={'col-lg-2'} style={{ marginBottom: '15px' }}>
                                        <label for="name" class={formstyles.form__label}>
                                            Status
                                        </label>
                                        <Select
                                            options={[{ label: 'All', value: 'all' }, ...transactionStatusesContext]}
                                            styles={defaultstyles}
                                            value={
                                                [{ label: 'All', value: 'all' }, ...transactionStatusesContext]
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
                            <span style={{ color: 'var(--info)' }}>Transactions</span>
                        </p>
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <TransactionsTable />
                    </div>
                </div>

                <div class={generalstyles.filter_container + ' mb-3 col-lg-12 p-2'}>
                    <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                        <AccordionItem class={`${generalstyles.innercard}` + ' '}>
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
                                                                <BsChevronDown />
                                                            </i>
                                                        );
                                                    } else {
                                                        return (
                                                            <i class="h-100 d-flex align-items-center justify-content-center">
                                                                <BsChevronUp />
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
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <ExpensesTable />
                    </div>
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
                        {openModal?.type == 'transaction' && (
                            <Form
                                size={'md'}
                                submit={submit}
                                setsubmit={setsubmit}
                                attr={[
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
                                        options: [
                                            { label: 'account 1', value: 'account1' },
                                            { label: 'account 2', value: 'account2' },
                                        ],
                                        size: '12',
                                    },
                                    {
                                        name: 'To Account',
                                        attr: 'toAccountId',
                                        type: 'select',
                                        options: [
                                            { label: 'account 1', value: 'account1' },
                                            { label: 'account 2', value: 'account2' },
                                        ],
                                        size: '12',
                                    },
                                    { name: 'Amount', attr: 'amount', type: 'number', size: '12' },
                                    { name: 'Receipt', attr: 'receipt', type: 'image', size: '12' },
                                ]}
                                payload={transactionpayload}
                                setpayload={settransactionpayload}
                                // button1disabled={UserMutation.isLoading}
                                button1class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
                                button1placeholder={'Add transaction'}
                                button1onClick={() => {
                                    setopenModal({ open: false, type: '' });
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
                                button1class={generalstyles.roundbutton + ' bg-info bg-infohover mr-2 '}
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
    );
};
export default FinanceTransactions;
