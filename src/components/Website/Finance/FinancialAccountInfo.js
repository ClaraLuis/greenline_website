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
import ExpensesTable from './ExpensesTable.js';

const { ValueContainer, Placeholder } = components;

const FinancialAccountInfo = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { fetchUsers, useQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    const [openModal, setopenModal] = useState(false);
    const [selectedinventory, setselectedinventory] = useState('');
    const [chosenracks, setchosenracks] = useState([]);
    const [itemsarray, setitemsarray] = useState([
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
        { sku: '123', name: 'item 1', size: 'size', color: 'cc', countinventory: '500', merchantname: 'Merchant 1' },
    ]);

    const [accountItem, setaccountItem] = useState({ id: '1', name: 'Account 1', type: 'hub', user: 'User 1', merchant: 'Merchant 1', balance: '1000' });
    const [filterobj, setfilterobj] = useState({
        page: 1,
        search: '',
    });

    const fetchusers = useQueryGQL('', fetchUsers());
    // const fetchusers = [];
    useEffect(() => {
        setpageactive_context('/financialaccounts');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Financial Account
                    </p>
                </div>

                <div class="col-lg-4 p-0">
                    <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                        <div class="col-lg-12">
                            Name: <span style={{ fontWeight: 600 }}>{accountItem?.name}</span>
                        </div>
                        <div class="col-lg-12">
                            Type: <span style={{ fontWeight: 600 }}>{accountItem?.type}</span>
                        </div>
                        <div class="col-lg-12">
                            User: <span style={{ fontWeight: 600 }}>{accountItem?.user}</span>
                        </div>
                        <div class="col-lg-12">
                            Merchant: <span style={{ fontWeight: 600 }}>{accountItem?.merchant}</span>
                        </div>
                        <div class="col-lg-12">
                            Balance: <span style={{ fontWeight: 600 }}>{accountItem?.balance}</span>
                        </div>
                    </div>
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
            </div>
        </div>
    );
};
export default FinancialAccountInfo;
