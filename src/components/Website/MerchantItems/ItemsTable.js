import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { FaLayerGroup, FaShopify } from 'react-icons/fa';
import { components } from 'react-select';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { TbEdit, TbEye, TbMinus, TbPlus } from 'react-icons/tb';
import Cookies from 'universal-cookie';
import API from '../../../API/API.js';
import ImportNewItem from '../InventoryItems/ImportNewItem.js';

const { ValueContainer, Placeholder } = components;

const ItemsTable = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setchosenItemContext, setpagetitle_context, dateformatter } = useContext(Contexthandlerscontext);
    const { useQueryGQL } = API();
    const [importItemModel, setimportItemModel] = useState(false);
    const cookies = new Cookies();

    const [importItemPayload, setimportItemPayload] = useState({
        itemSku: '',
        ownedByOneMerchant: true,
        palletId: '',
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
            <>
                {props?.items?.length == 0 && (
                    <div style={{ height: '70vh' }} class="col-lg-12 p-0 w-100 allcentered align-items-center m-0 text-lightprimary">
                        <div class="row m-0 w-100">
                            <FaLayerGroup size={40} class=" col-lg-12" />
                            <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                No Items
                            </div>
                        </div>
                    </div>
                )}
            </>
            {props?.items?.length != 0 && (
                <div class="row m-0 w-100">
                    {props?.items?.map((item, index) => {
                        var selected = false;
                        var count = 0;
                        props?.selectedItems?.map((i) => {
                            if (i.item.sku == item.sku) {
                                selected = true;
                                count = i?.count;
                            }
                        });
                        return (
                            <div class={props?.card}>
                                <div
                                    style={{
                                        backgroundColor: props?.selectBackground && selected ? 'var(--secondary)' : '',
                                        transition: 'all 0.4s',
                                        cursor: props?.clickable ? 'pointer' : '',
                                    }}
                                    onClick={() => {
                                        if (props?.actiononclick) {
                                            props?.actiononclick(item);
                                        }
                                    }}
                                    class={generalstyles.card + ' p-3 row m-0 w-100'}
                                >
                                    {props?.showEllipsis && (
                                        <div class={generalstyles.product_action + ' row m-0'}>
                                            <a
                                                class={generalstyles.buttonxs + ' allcentered'}
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    await setchosenItemContext(item);
                                                    history.push(`/itemdetails?id=` + item.id);
                                                }}
                                            >
                                                <i>
                                                    <TbEye color="white" size={17} />
                                                </i>
                                            </a>
                                            <a
                                                class={generalstyles.buttonxs + ' allcentered ml-2'}
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    await setchosenItemContext(item);
                                                    history.push(`/updateitem?id=` + item.id);
                                                }}
                                            >
                                                <i>
                                                    <TbEdit color="white" size={17} />
                                                </i>
                                            </a>
                                        </div>
                                    )}

                                    {props?.addToCount && (
                                        // <div
                                        //     style={{
                                        //         position: 'absolute',
                                        //         top: 10,
                                        //         right: 20,
                                        //         zIndex: 100,
                                        //         color: 'white',
                                        //     }}
                                        //     class={generalstyles.cart_button}
                                        // >
                                        //     {/* <FaCheck color="white" /> */}
                                        //     {count}
                                        // </div>
                                        <div style={{ right: 0, position: 'absolute', zIndex: 100 }} class={' row m-0'}>
                                            <a
                                                class={generalstyles.buttonxs + ' allcentered'}
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    props?.addToCount(item);
                                                }}
                                            >
                                                <i>
                                                    <TbPlus color="white" size={17} />
                                                </i>
                                            </a>
                                            <a class={generalstyles.buttonxs + ' allcentered'} style={{ background: 'white', fontSize: '16px' }}>
                                                <i>{count}</i>
                                            </a>
                                            <a
                                                class={generalstyles.buttonxs + ' allcentered bg-danger bg-dangerhover '}
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    props?.subtractFromCount(item);
                                                }}
                                            >
                                                <i>
                                                    <TbMinus color="white" size={17} />
                                                </i>
                                            </a>
                                        </div>
                                    )}
                                    <div class="col-lg-12 p-0">
                                        <div style={{ width: '100%', height: '200px' }}>
                                            <img
                                                src={
                                                    item?.imageUrl?.lenth != 0 && item?.imageUrl != null
                                                        ? item?.imageUrl
                                                        : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                }
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0rem' }}
                                            />
                                        </div>
                                    </div>

                                    <div class="col-lg-12 pl-0 pr-0 pb-0 wordbreak" style={{ fontWeight: 700, fontSize: '16px', paddingTop: '1.5rem' }}>
                                        <div class="row m-0 w-100">
                                            <div class="col-lg-12 p-0 " style={{ fontSize: '11px', fontWeight: 600, color: 'grey' }}>
                                                {item?.shopifyId && <FaShopify class="mt-1 mr-1" />}
                                                {cookies.get('userInfo')?.type == 'employee' && <>{item?.merchant?.name}</>}
                                            </div>
                                            <div class="col-lg-12 p-0 ">{item?.fullName ?? item?.name}</div>
                                        </div>
                                    </div>
                                    {/* {props?.clickable && (
                                        <div class="col-lg-4 d-flex justify-content-end mt-2 p-0">
                                            <div
                                                
                                                class={generalstyles.cart_button}
                                            >
                                                <FaPlus color="white" />
                                            </div>
                                        </div>
                                    )} */}
                                    <div class="col-lg-12 p-0" style={{ fontWeight: 600, fontSize: '13px', color: props?.selectBackground && selected ? 'white' : 'lightgray' }}>
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

                                    {item?.itemVariants && (
                                        <div class="col-lg-12 p-0 d-flex align-items-cent6er justify-content-between " style={{ fontSize: '11px', fontWeight: 600, color: 'grey' }}>
                                            <div>{item?.itemVariants?.length} Variant(s)</div>
                                            <div>
                                                {' '}
                                                {item.itemVariants.length > 0 && (
                                                    <span>
                                                        {Math.min(...item.itemVariants.map((variant) => parseFloat(variant.price || 0)))} {item?.currency}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
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
export default ItemsTable;
