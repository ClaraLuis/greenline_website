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

const SettlemantsTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { chosenMerchantSettlemant, setchosenMerchantSettlemant, isAuth, dateformatter, financialAccountTypeContext } = useContext(Contexthandlerscontext);

    const { lang, langdetect } = useContext(LanguageContext);

    return (
        <>
            {props?.paginateMerchantSettlementsQuery?.loading && (
                <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                </div>
            )}
            {!props?.paginateMerchantSettlementsQuery?.loading && props?.paginateMerchantSettlementsQuery?.data != undefined && (
                <>
                    {props?.paginateMerchantSettlementsQuery?.data[props?.attr]?.data?.length == 0 && (
                        <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                            <div class="row m-0 w-100">
                                <FaLayerGroup size={40} class=" col-lg-12" />
                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                    No Settlements
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {props?.paginateMerchantSettlementsQuery?.data[props?.attr]?.data?.length != 0 && (
                <div class="row m-0 w-100">
                    {props?.paginateMerchantSettlementsQuery?.data[props?.attr]?.data?.map((item, index) => {
                        return (
                            <div className="col-lg-4">
                                <div class={generalstyles.card + ' p-3 row m-0 w-100 allcentered'}>
                                    <div className="col-lg-6 p-0">
                                        <span style={{ fontSize: '12px', color: 'grey' }}>
                                            # {item?.id},{item?.merchant?.name}
                                        </span>
                                    </div>
                                    <div className="col-lg-6 col-md-6 p-0 d-flex justify-content-end align-items-center">
                                        <div class="row m-0 w-100 d-flrx justify-content-end align-items-center"></div>
                                    </div>
                                    <div className="col-lg-12 p-0 my-2">
                                        <hr className="m-0" />
                                    </div>

                                    <div className="col-lg-6 p-0 mb-2">
                                        <span class="d-flex align-items-center" style={{ fontWeight: 600 }}>
                                            <FaMoneyBill class="mr-1" />
                                            {item?.totalAmount} EGP
                                        </span>
                                    </div>
                                    <div className="col-lg-6 col-md-6 p-0 mb-2 d-flex justify-content-end">
                                        <span class="d-flex align-items-center" style={{ fontWeight: 500, color: 'grey', fontSize: '12px' }}>
                                            <IoMdTime class="mr-1" />
                                            {dateformatter(item?.createdAt)}
                                        </span>
                                    </div>
                                    <div class="col-lg-12 p-0 allcentered mt-2">
                                        <div class="row m-0 w-100 allcentered">
                                            <button
                                                onClick={() => {
                                                    window.open(item.pdfUrl, '_blank');
                                                }}
                                                class={generalstyles.roundbutton + ' mx-1'}
                                            >
                                                View PDF
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setchosenMerchantSettlemant(item);
                                                    history.push('/merchantsettlement?id=' + item.id);
                                                }}
                                                class={generalstyles.roundbutton}
                                            >
                                                View Details
                                            </button>
                                        </div>
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
export default SettlemantsTable;
