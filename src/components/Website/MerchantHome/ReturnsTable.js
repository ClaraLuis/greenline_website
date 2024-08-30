import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaCheck, FaLayerGroup, FaPlus } from 'react-icons/fa';
import { components } from 'react-select';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import API from '../../../API/API.js';
import ImportNewItem from '../InventoryItems/ImportNewItem.js';
import { FiCheckCircle } from 'react-icons/fi';

const { ValueContainer, Placeholder } = components;

const ReturnsTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { useQueryGQL } = API();
    const [importItemModel, setimportItemModel] = useState(false);

    const [importItemPayload, setimportItemPayload] = useState({
        itemSku: '',
        ownedByOneMerchant: true,
        ballotId: '',
        inventoryId: '',
        boxName: '',
        count: 0,
        minCount: 0,
    });

    const { lang, langdetect } = useContext(LanguageContext);

    return (
        <>
            {props?.fetchMerchantItemVariantsQuery?.loading && (
                <div style={{ height: '70vh' }} class="row w-100 allcentered m-0">
                    <CircularProgress color="var(--primary)" width="60px" height="60px" duration="1s" />
                </div>
            )}
            {!props?.items != undefined && (
                <>
                    {props?.items?.length == 0 && (
                        <div style={{ height: '70vh' }} class="col-lg-12 p-0 w-100 allcentered align-items-center m-0 text-lightprimary">
                            <div class="row m-0 w-100">
                                <FaLayerGroup size={40} class=" col-lg-12" />
                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                    No Returns
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            {props?.items?.length != 0 && (
                <div class="row m-0 w-100">
                    {props?.items?.map((item, index) => {
                        var selected = false;
                        props?.selectedItems?.map((i) => {
                            if (i?.id == item?.id) {
                                selected = true;
                            }
                        });
                        return (
                            <div class={props?.card}>
                                <div
                                    style={{
                                        cursor: props?.clickable ? 'pointer' : '',
                                        background: selected ? 'var(--secondary)' : '',
                                        transition: 'all 0.4s',
                                    }}
                                    onClick={() => {
                                        props?.actiononclick(item);
                                    }}
                                    class={generalstyles.card + ' p-0 row m-0 w-100'}
                                >
                                    {/* {selected && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 20,
                                                zIndex: 100,
                                            }}
                                            class={generalstyles.cart_button}
                                        >
                                            <FaCheck color="white" />
                                        </div>
                                    )} */}
                                    <div class="col-lg-12 py-2 px-3">
                                        <span style={{ fontSize: '12px', color: 'grey' }}># {item?.id}</span>
                                    </div>
                                    <div className="col-lg-12 p-0 my-2">
                                        <hr className="m-0" />
                                    </div>
                                    <div class="col-lg-12 mb-1" style={{ color: 'grey', fontSize: '12px' }}>
                                        <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                            <div>Items</div>
                                        </div>
                                    </div>
                                    {item?.orderItems?.map((subitem, subindex) => {
                                        return (
                                            <div class={'col-lg-12 mb-2'}>
                                                <div style={{ border: '1px solid #eee', borderRadius: '18px' }} class="row m-0 w-100 p-2">
                                                    <div style={{ width: '35px', height: '35px', borderRadius: '7px', marginInlineEnd: '5px' }}>
                                                        <img
                                                            src={
                                                                subitem?.info?.imageUrl
                                                                    ? subitem?.info?.imageUrl
                                                                    : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                            }
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                        />
                                                    </div>
                                                    <div class="col-lg-10 d-flex align-items-center">
                                                        <div className="row m-0 w-100">
                                                            <div style={{ fontSize: '14px', fontWeight: 500 }} className={' col-lg-12 p-0 wordbreak wordbreak1'}>
                                                                {subitem?.info?.item?.name ?? '-'}
                                                            </div>
                                                            <div style={{ fontSize: '12px' }} className={' col-lg-12 p-0 wordbreak wordbreak1'}>
                                                                {subitem?.info?.name ?? '-'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div class="col-lg-8 p-0 mt-2 wordbreak" style={{ fontWeight: 700, fontSize: '16px' }}>
                                        {item?.orderItem?.info?.name}
                                    </div>

                                    <div class="col-lg-12 p-0" style={{ fontWeight: 600, fontSize: '13px', color: 'lightgray' }}>
                                        {item?.orderItem?.info?.sku}
                                    </div>
                                    <div class="col-lg-12 p-0 mt-2" style={{ fontWeight: 700, fontSize: '15px' }}>
                                        {item?.orderItem?.info?.prices?.map((price, priceindex) => {
                                            return (
                                                <>
                                                    {price?.info[0]?.price} {price?.info[0]?.currency}
                                                </>
                                            );
                                        })}
                                    </div>
                                    <div class="col-lg-12 p-0 mt-1">
                                        <div class="row m-0 w-100">
                                            {item?.orderItem?.info?.colors?.map((color, colorindex) => {
                                                return <div style={{ width: '18px', height: '18px', borderRadius: '100%', backgroundColor: color, marginInlineEnd: '5px' }}></div>;
                                            })}
                                        </div>
                                    </div>
                                    {/* <div class="col-lg-12 p-0 mt-1">
                                        <p class=" p-0 m-0" style={{ fontSize: '14px' }}>
                                            <span
                                                onClick={() => {
                                                    setimportItemPayload({
                                                        itemSku: item?.orderItem?.info?.sku,
                                                        ownedByOneMerchant: true,
                                                        ballotId: '',
                                                        inventoryId: '',
                                                        boxName: '',
                                                        count: 0,
                                                        minCount: 0,
                                                    });
                                                    setimportItemModel(true);
                                                }}
                                                class="text-primary text-secondaryhover"
                                                style={{ textDecoration: 'underline' }}
                                            >
                                                Import new item
                                            </span>
                                        </p>
                                    </div> */}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <ImportNewItem openModal={importItemModel} setopenModal={setimportItemModel} importItemPayload={importItemPayload} setimportItemPayload={setimportItemPayload} />
        </>
    );
};
export default ReturnsTable;
