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
import MerchantSelect from '../MerchantHome/MerchantSelect.js';

const { ValueContainer, Placeholder } = components;

const Finance = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, isAuth } = useContext(Contexthandlerscontext);

    const { lang, langdetect } = useContext(LanguageContext);

    const [statistics, seetstatistics] = useState([
        {
            title: 'Total Transactions',
            number: '10000',
        },
        {
            title: 'Awaiting Transactions',
            number: '5000',
        },
        {
            title: 'Invoices',
            number: '300',
        },
    ]);

    useEffect(() => {
        setpageactive_context('/merchantfinance');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <MerchantSelect />

            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Finance
                    </p>
                </div>
                <div class="col-lg-12 p-0">
                    <div class="row m-0 w-100">
                        {statistics?.map((item, index) => {
                            return (
                                <div class="col-lg-3">
                                    <div class={generalstyles.card + ' row m-0 p-3 w-100'}>
                                        <div style={{ fontSize: '17px' }} class="col-lg-12 mb-1">
                                            {item?.title}
                                        </div>
                                        <div class="col-lg-12">
                                            <span style={{ fontWeight: 800, fontSize: '23px' }}>{item?.number}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-2'}>
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
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <TransactionsTable />
                    </div>
                </div>

                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Awaiting Transactions</span>
                        </p>
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <TransactionsTable />
                    </div>
                </div>

                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                    <div class={' col-lg-12 col-md-12 col-sm-12 p-0 d-flex align-items-center justify-content-start '}>
                        <p class=" p-0 m-0" style={{ fontSize: '15px' }}>
                            <span style={{ color: 'var(--info)' }}>Invoices</span>
                        </p>
                    </div>
                    <div style={{ maxHeight: '630px' }} className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-2 '}>
                        <TransactionsTable />
                    </div>
                </div> */}
            </div>
        </div>
    );
};
export default Finance;
