import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import shimmerstyles from '../Generalfiles/CSS_GENERAL/shimmer.module.css';
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
    const { setpageactive_context, isAuth, dateformatter, financialAccountTypeContext } = useContext(Contexthandlerscontext);

    const { lang, langdetect } = useContext(LanguageContext);

    return (
        <>
            {props?.fetchFinancialAccountsQuery?.loading && (
                <div className="row m-0 w-100">
                    {[1, 2, 3].map((item, index) => (
                        <div key={index} className="col-lg-4">
                            <div className={`${generalstyles.card} p-3 row m-0 w-100 allcentered`}>
                                <div className="col-lg-6 p-0">
                                    <div className={shimmerstyles.shimmer} style={{ height: '12px', width: '60px', borderRadius: '4px' }}></div>
                                </div>
                                <div className="col-lg-6 col-md-6 p-0 d-flex justify-content-end align-items-center">
                                    <div className="row m-0 w-100 d-flex justify-content-end align-items-center">
                                        <div className={shimmerstyles.shimmer} style={{ height: '24px', width: '100px', borderRadius: '20px', marginRight: '8px' }}></div>
                                        <div className={shimmerstyles.shimmer} style={{ height: '28px', width: '28px', borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                                <div className="col-lg-12 p-0 my-2">
                                    <hr className="m-0" />
                                </div>
                                <div className="col-lg-12 p-0 mb-2">
                                    <div className={shimmerstyles.shimmer} style={{ height: '16px', width: '150px', borderRadius: '4px' }}></div>
                                </div>
                                <div className="col-lg-6 p-0 mb-2">
                                    <div className={shimmerstyles.shimmer} style={{ height: '16px', width: '120px', borderRadius: '4px' }}></div>
                                </div>
                                <div className="col-lg-6 col-md-6 p-0 mb-2 d-flex justify-content-end">
                                    <div className={shimmerstyles.shimmer} style={{ height: '12px', width: '100px', borderRadius: '4px' }}></div>
                                </div>
                                <div className="col-lg-12 p-0 allcentered mt-2">
                                    <div className={shimmerstyles.shimmer} style={{ height: '35px', width: '150px', borderRadius: '20px' }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
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
                            <div className="col-lg-4">
                                <div class={generalstyles.card + ' p-3 row m-0 w-100 allcentered'}>
                                    <div className="col-lg-6 p-0">
                                        <span style={{ fontSize: '12px', color: 'grey' }}># {item?.id}</span>
                                    </div>
                                    <div className="col-lg-6 col-md-6 p-0 d-flex justify-content-end align-items-center">
                                        <div class="row m-0 w-100 d-flrx justify-content-end align-items-center">
                                            <div className={' wordbreak text-success bg-light-success rounded-pill font-weight-600 allcentered text-capitalize '}>
                                                {/* {financialAccountTypeContext?.map((i, ii) => {
                                                    if (i.value == item?.type) {
                                                        return <span>{i.label}</span>;
                                                    }
                                                })} */}
                                                {item?.status?.split(/(?=[A-Z])/).join(' ')}
                                            </div>
                                            {isAuth([1, 51, 21]) && (
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
                                                    <Dropdown.Menu style={{ minWidth: '170px', fontSize: '12px' }}>
                                                        <Dropdown.Item
                                                            onClick={() => {
                                                                props?.editFunc(item);
                                                            }}
                                                            class="py-2"
                                                        >
                                                            <p class={' mb-0 pb-0 avenirmedium text-secondaryhover d-flex align-items-center '}>Change account name</p>
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            )}
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
                                    <div className="col-lg-6 p-0 mb-2">
                                        <span class="d-flex align-items-center" style={{ fontWeight: 600 }}>
                                            <FaMoneyBill class="mr-1" />
                                            {item?.balance}
                                        </span>
                                    </div>
                                    <div className="col-lg-6 col-md-6 p-0 mb-2 d-flex justify-content-end">
                                        <span class="d-flex align-items-center" style={{ fontWeight: 500, color: 'grey', fontSize: '12px' }}>
                                            <IoMdTime class="mr-1" />
                                            {dateformatter(item?.createdAt)}
                                        </span>
                                    </div>
                                    {isAuth([1, 51, 27]) && (
                                        <div class="col-lg-12 p-0 allcentered mt-2">
                                            <button
                                                onClick={() => {
                                                    if (props?.clickable) {
                                                        history.push('/financialaccountinfo?accountId=' + item?.id + '&accountName=' + item?.name);
                                                    }
                                                }}
                                                class={generalstyles.roundbutton}
                                            >
                                                View Transactions
                                            </button>
                                        </div>
                                    )}
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
