import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaEllipsisV, FaLayerGroup, FaMoneyBill } from 'react-icons/fa';
import Select, { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';
import { IoMdArrowDown, IoMdArrowUp, IoMdTime } from 'react-icons/io';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { Dropdown } from 'react-bootstrap';

const { ValueContainer, Placeholder } = components;

const AccountsTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, financialAccountTypesContext } = useContext(Contexthandlerscontext);

    const { lang, langdetect } = useContext(LanguageContext);

    const [itemsarray, setitemsarray] = useState([
        { id: '1', name: 'Account 1', type: 'hub', user: 'User 1', merchant: 'Merchant 1', balance: '1000' },
        { id: '2', name: 'Account 2', type: 'merchant', user: 'User 1', merchant: 'Merchant 1', balance: '3000' },
        { id: '3', name: 'Account 3', type: 'bank', user: 'User 1', merchant: 'Merchant 2', balance: '40000' },
    ]);

    return (
        <>
            {props?.fetchFinancialAccountsQuery?.loading && (
                <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                </div>
            )}
            {!props?.fetchFinancialAccountsQuery?.loading && props?.fetchFinancialAccountsQuery?.data != undefined && (
                <>
                    {props?.fetchFinancialAccountsQuery?.data?.paginateFinancialAccounts?.data?.length == 0 && (
                        <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                            <div class="row m-0 w-100">
                                <FaLayerGroup size={40} class=" col-lg-12" />
                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                    No Accounts
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            {props?.fetchFinancialAccountsQuery?.data?.length != 0 && (
                <div class="row m-0 w-100">
                    {props?.fetchFinancialAccountsQuery?.data?.paginateFinancialAccounts?.data?.map((item, index) => {
                        return (
                            <div className="col-lg-4 p-1">
                                <div class={generalstyles.card + ' p-3 row m-0 w-100 allcentered'}>
                                    <div className="col-lg-6 p-0">
                                        <span style={{ fontWeight: 700, fontSize: '16px' }}># {item?.id}</span>
                                    </div>
                                    <div className="col-lg-6 p-0 d-flex justify-content-end align-items-center">
                                        <div class="row m-0 w-100 d-flrx justify-content-end align-items-center">
                                            <div className={' wordbreak text-success bg-light-success rounded-pill allcentered  '}>
                                                {financialAccountTypesContext?.map((i, ii) => {
                                                    if (i.value == item?.type) {
                                                        return <span>{i.label}</span>;
                                                    }
                                                })}
                                            </div>
                                            <Dropdown>
                                                <Dropdown.Toggle>
                                                    <div
                                                        class="iconhover allcentered"
                                                        style={{
                                                            color: 'var(--primary)',
                                                            // borderRadius: '10px',
                                                            width: '28px',
                                                            height: '28px',
                                                            transition: 'all 0.4s',
                                                        }}
                                                    >
                                                        <FaEllipsisV />
                                                    </div>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu style={{ minWidth: '100px' }}>
                                                    <div class="row m-0 w-100 p-1">
                                                        <div class="col-lg-12 p-0 mb-2 ">
                                                            <p
                                                                style={{ borderBottom: '1px solid #eee' }}
                                                                class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center pb-1  '}
                                                                onClick={() => {
                                                                    props?.editFunc(item);
                                                                }}
                                                            >
                                                                Edit
                                                            </p>
                                                        </div>
                                                        <div class="col-lg-12 p-0">
                                                            <p
                                                                // style={{ borderBottom: '1px solid #eee' }}
                                                                class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center  '}
                                                                onClick={() => {
                                                                    if (props?.clickable) {
                                                                        history.push('/financialaccountinfo?accountId=' + item?.id + '&accountName=' + item?.name);
                                                                    }
                                                                }}
                                                            >
                                                                Show
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 p-0 my-2">
                                        <hr className="m-0" />
                                    </div>
                                    <div className="col-lg-12 p-0 mb-2">
                                        <span class="d-flex align-items-center" style={{ fontWeight: 600 }}>
                                            <MdOutlineAccountCircle class="mr-1" />
                                            {item?.name}
                                        </span>
                                    </div>
                                    <div className="col-lg-12 p-0 mb-2">
                                        <span class="d-flex align-items-center" style={{ fontWeight: 600 }}>
                                            <FaMoneyBill class="mr-1" />
                                            {item?.balance}
                                        </span>
                                    </div>
                                    <div className="col-lg-12 p-0 mb-2 d-flex justify-content-end">
                                        <span class="d-flex align-items-center" style={{ fontWeight: 500, color: 'grey', fontSize: '12px' }}>
                                            <IoMdTime class="mr-1" />
                                            {item?.createdAt}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
};
export default AccountsTable;
