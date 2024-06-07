import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { FaPlus, FaWindowMinimize } from 'react-icons/fa';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import Select from 'react-select';
import API from '../../../API/API.js';
import Form from '../../Form.js';
import Pagination from '../../Pagination.js';
import SelectComponent from '../../SelectComponent.js';
import { defaultstyles } from '../Generalfiles/selectstyles.js';
import ItemsTable from './ItemsTable.js';
import { NotificationManager } from 'react-notifications';

const MerchanReturns = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, paymentTypeContext, returnPackageTypesContext } = useContext(Contexthandlerscontext);
    const { useMutationGQL, fetchMerchants, fetchInventories, fetchCustomerAddresses, fetchMerchantItemReturns, useQueryGQL, createReturnPackage } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [cartItems, setcartItems] = useState([]);
    const [packagepayload, setpackagepayload] = useState({
        ids: [],
        type: '',
        toInventoryId: undefined,
        toMerchantId: undefined,
    });

    const [filterInventories, setfilterInventories] = useState({
        limit: 100,
        afterCursor: null,
        beforeCursor: null,
    });
    const fetchinventories = useQueryGQL('', fetchInventories(), filterInventories);

    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 10,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchMerchantsQuery = useQueryGQL('', fetchMerchants(), filterMerchants);

    const [filter, setfiter] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
    });

    const fetchMerchantItemReturnsQuery = useQueryGQL('', fetchMerchantItemReturns(), filter);
    const { refetch: refetchMerchantItemReturnsQuery } = useQueryGQL('', fetchMerchantItemReturns(), filter);

    const [createReturnPackageMutation] = useMutationGQL(createReturnPackage(), {
        ids: cartItems,
        type: packagepayload?.type,
        toInventoryId: packagepayload?.toInventoryId,
        toMerchantId: packagepayload?.toMerchantId,
    });

    useEffect(() => {
        setpageactive_context('/merchantreturns');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex  justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div className={' col-lg-8 p-0 '}>
                    <div class="row m-0 w-100">
                        <div class="col-lg-12 p-0 my-3 ">
                            <div class="row m-0 w-100">
                                <div class="col-lg-6 p-0">
                                    <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                        <input
                                            // disabled={props?.disabled}
                                            // type={props?.type}
                                            class={formstyles.form__field}
                                            value={filter?.name}
                                            placeholder={'Search by name '}
                                            onChange={() => {
                                                setfiter({ ...filter, name: event.target.value });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div class="col-lg-6 p-0 px-1">
                                    <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                        <input
                                            // disabled={props?.disabled}
                                            // type={props?.type}
                                            class={formstyles.form__field}
                                            value={filter?.sku}
                                            placeholder={'Search by SKU'}
                                            onChange={() => {
                                                setfiter({ ...filter, sku: event.target.value });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12 p-0 mb-3">
                            <Pagination
                                beforeCursor={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.cursor?.beforeCursor}
                                afterCursor={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.cursor?.afterCursor}
                                filter={filter}
                                setfiter={setfiter}
                            />
                        </div>
                        <ItemsTable
                            clickable={true}
                            actiononclick={(item) => {
                                var temp = { ...packagepayload };
                                var exist = false;
                                var chosenindex = null;
                                temp.ids.map((i, ii) => {
                                    if (i?.orderItem?.info?.sku == item?.orderItem?.info?.sku) {
                                        exist = true;
                                        chosenindex = ii;
                                    }
                                });
                                if (!exist) {
                                    temp.ids.push(item);
                                }
                                setpackagepayload({ ...temp });
                            }}
                            card="col-lg-4 px-1"
                            items={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.data}
                        />
                        <div class="col-lg-12 p-0">
                            <Pagination
                                beforeCursor={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.cursor?.beforeCursor}
                                afterCursor={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.cursor?.afterCursor}
                                filter={filter}
                                setfiter={setfiter}
                            />
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 mb-3 px-1">
                    <div class={generalstyles.card + ' row m-0 w-100 p-2 py-3'}>
                        <div class="col-lg-12">
                            {packagepayload?.ids?.length != 0 && (
                                <>
                                    <div class="col-lg-12 pb-2 px-3" style={{ fontSize: '17px', fontWeight: 700 }}>
                                        Package ({packagepayload?.ids?.length})
                                    </div>
                                    <div class="col-lg-12 p-0">
                                        <div style={{ maxHeight: '40vh', overflow: 'scroll' }} class="row m-0 w-100 scrollmenuclasssubscrollbar">
                                            {packagepayload?.ids?.map((item, index) => {
                                                return (
                                                    <div class={' col-lg-12 p-0'}>
                                                        <div class={generalstyles.filter_container + ' py-2 row m-0 mb-2 w-100 allcentered'}>
                                                            <div class="col-lg-2 mr-2 p-0">
                                                                <div style={{ width: '100%', height: '40px' }}>
                                                                    <img
                                                                        src={
                                                                            item?.orderItem?.info?.imageUrl
                                                                                ? item?.orderItem?.info?.imageUrl
                                                                                : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                                        }
                                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div class="col-lg-4 p-0 wordbreak" style={{ fontWeight: 700, fontSize: '16px' }}>
                                                                {item?.orderItem?.info?.name}
                                                            </div>

                                                            <div class="col-lg-5 d-flex justify-content-end  p-0">
                                                                <div class="row m-0 w-100 d-flex align-items-center justify-content-end">
                                                                    <FaWindowMinimize
                                                                        onClick={() => {
                                                                            var temp = { ...packagepayload };
                                                                            temp.ids.splice(index, 1);
                                                                            setpackagepayload({ ...temp });
                                                                        }}
                                                                        class=" mb-2 text-danger text-dangerhover"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div class={'col-lg-12'} style={{ marginBottom: '15px' }}>
                            <label for="name" class={formstyles.form__label}>
                                Package Type
                            </label>
                            <Select
                                options={returnPackageTypesContext}
                                styles={defaultstyles}
                                value={returnPackageTypesContext.filter((option) => option.value == packagepayload?.type)}
                                onChange={(option) => {
                                    setpackagepayload({ ...packagepayload, type: option.value });
                                }}
                            />
                        </div>
                        {packagepayload?.type == 'inventory' && (
                            <div class={'col-lg-12'} style={{ marginBottom: '15px' }}>
                                <SelectComponent
                                    title={'Inventory'}
                                    filter={filterInventories}
                                    setfilter={setfilterInventories}
                                    options={fetchinventories}
                                    attr={'paginateInventories'}
                                    label={'name'}
                                    value={'id'}
                                    payload={packagepayload}
                                    payloadAttr={'toInventoryId'}
                                    onClick={(option) => {
                                        setpackagepayload({ ...packagepayload, toInventoryId: option.id });
                                    }}
                                />
                            </div>
                        )}
                        {packagepayload?.type == 'merchant' && (
                            <div class={'col-lg-12'} style={{ marginBottom: '15px' }}>
                                <SelectComponent
                                    title={'Merchant'}
                                    filter={filterMerchants}
                                    setfilter={setfilterMerchants}
                                    options={fetchMerchantsQuery}
                                    attr={'paginateMerchants'}
                                    label={'name'}
                                    value={'id'}
                                    payload={packagepayload}
                                    payloadAttr={'toMerchantId'}
                                    onClick={(option) => {
                                        setpackagepayload({ ...packagepayload, toMerchantId: option.id });
                                    }}
                                />
                            </div>
                        )}
                        <div class="col-lg-12 p-0 allcentered">
                            <button
                                onClick={async () => {
                                    try {
                                        // if (
                                        //     packagepayload?.ids?.length != 0 &&
                                        //     packagepayload?.type?.length != 0 &&
                                        //     ((packagepayload?.type == 'inventory' && packagepayload?.toInventoryId != undefined) ||
                                        //         (packagepayload?.type == 'merchat' && packagepayload?.toMerchantId != undefined))
                                        // ) {
                                        var temp = [];
                                        await packagepayload?.ids?.map((item, index) => {
                                            temp.push(item.id);
                                        });
                                        await setcartItems([...temp]);
                                        await createReturnPackageMutation();
                                        refetchMerchantItemReturnsQuery();
                                        // } else {
                                        //     NotificationManager.warning('Please Complete all fields', 'Warning!');
                                        // }
                                    } catch {}
                                }}
                                class={generalstyles.roundbutton}
                            >
                                Add Package
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MerchanReturns;
