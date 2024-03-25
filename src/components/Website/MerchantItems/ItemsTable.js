import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup, FaPlus } from 'react-icons/fa';
import Select, { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';
import { defaultstyles } from '../Generalfiles/selectstyles.js';

import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import API from '../../../API/API.js';

const { ValueContainer, Placeholder } = components;

const ItemsTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { fetchMerchantItems, useQueryGQL } = API();

    const { lang, langdetect } = useContext(LanguageContext);

    return (
        <>
            {props?.fetchMerchantItemsQuery?.loading && (
                <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                </div>
            )}
            {!props?.fetchMerchantItemsQuery?.loading && props?.fetchMerchantItemsQuery?.data != undefined && (
                <>
                    {props?.fetchMerchantItemsQuery?.data?.paginateItems?.data?.length == 0 && (
                        <div style={{ height: '70vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                            <div class="row m-0 w-100">
                                <FaLayerGroup size={40} class=" col-lg-12" />
                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                    No Items
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            {props?.fetchMerchantItemsQuery?.data?.paginateItems?.data?.length != 0 && (
                <div class="row m-0 w-100">
                    {props?.fetchMerchantItemsQuery?.data?.paginateItems?.data?.map((item, index) => {
                        return (
                            <div class={props?.card}>
                                <div class={generalstyles.card + ' p-3 row m-0 w-100'}>
                                    <div class="col-lg-12 p-0">
                                        <div style={{ width: '100%', height: '200px' }}>
                                            <img
                                                src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                            />
                                        </div>
                                    </div>
                                    <div class="col-lg-8 p-0 mt-2 wordbreak" style={{ fontWeight: 700, fontSize: '16px' }}>
                                        {item?.name}
                                    </div>

                                    {props?.clickable && (
                                        <div class="col-lg-4 d-flex justify-content-end mt-2 p-0">
                                            <div
                                                onClick={() => {
                                                    props?.actiononclick(item);
                                                }}
                                                class={generalstyles.cart_button}
                                            >
                                                <FaPlus color="white" />
                                            </div>
                                        </div>
                                    )}
                                    <div class="col-lg-12 p-0" style={{ fontWeight: 600, fontSize: '13px', color: 'lightgray' }}>
                                        {item?.sku}
                                    </div>
                                    <div class="col-lg-12 p-0 mt-2" style={{ fontWeight: 700, fontSize: '15px' }}>
                                        {item?.prices?.map((price, priceindex) => {
                                            return (
                                                <>
                                                    {price?.info[0]?.price} {price?.info[0]?.currency}
                                                </>
                                            );
                                        })}
                                    </div>
                                    <div class="col-lg-12 p-0 mt-1">
                                        <div class="row m-0 w-100">
                                            {item?.colors?.map((color, colorindex) => {
                                                return <div style={{ width: '18px', height: '18px', borderRadius: '100%', backgroundColor: color, marginInlineEnd: '5px' }}></div>;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                //     )}
                //     {/* <Pagespaginatecomponent
                //     totaldatacount={props?.fetchMerchantItemsQuery?.data?.data?.total}
                //     numofitemsperpage={props?.fetchMerchantItemsQuery?.data?.data?.per_page}
                //     pagenumbparams={props?.fetchMerchantItemsQuery?.data?.data?.current_page}
                //     nextpagefunction={(nextpage) => {
                //         history.push({
                //             pathname: '/users',
                //             search: '&page=' + nextpage,
                //         });
                //     }}
                // /> */}
                // </>
            )}
        </>
    );
};
export default ItemsTable;
