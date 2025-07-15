import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
import { FaWindowMinimize } from 'react-icons/fa';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { NotificationManager } from 'react-notifications';
import API from '../../../API/API.js';
import Pagination from '../../Pagination.js';
import SelectComponent from '../../SelectComponent.js';
import ReturnsTable from '../MerchantHome/ReturnsTable.js';
import InventorySelectComponent from '../../selectComponents/InventorySelectComponent.js';
import Select, { components } from 'react-select';
import { defaultstyles } from '../Generalfiles/selectstyles.js';

const InventoryReturns = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, paymentTypeContext, isAuth, buttonLoadingContext, setbuttonLoadingContext, useLoadQueryParamsToPayload, updateQueryParamContext } =
        useContext(Contexthandlerscontext);
    const { useMutationGQL, fetchMerchants, fetchInventories, fetchCustomerAddresses, fetchInventoryItemReturns, useQueryGQL, createReturnPackage } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [cartItems, setcartItems] = useState([]);
    const [search, setsearch] = useState('');

    const [packagepayload, setpackagepayload] = useState({
        ids: [],
        type: 'inventory',
        toInventoryId: undefined,
        toMerchantId: undefined,
    });

    const [filter, setfilter] = useState({
        limit: 20,
        isAsc: false,
        afterCursor: '',
        beforeCursor: '',
        assigned: false,
        inventoryId: undefined,
    });
    useLoadQueryParamsToPayload(setfilter);

    const fetchInventoryItemReturnsQuery = useQueryGQL('', fetchInventoryItemReturns(), filter);
    // const { refetch: refetchInventoryItemReturnsQuery } = useQueryGQL('', fetchInventoryItemReturns(), filter);
    const refetchInventoryItemReturnsQuery = () => fetchInventoryItemReturnsQuery.refetch();

    const [createReturnPackageMutation] = useMutationGQL(createReturnPackage(), {
        orderItemIds: cartItems,
        type: 'inventory',
        toInventoryId: packagepayload?.toInventoryId ?? filter?.inventoryId,
    });

    useEffect(() => {
        setpageactive_context('/inventoryreturns');
        setpagetitle_context('Hubs');
    }, []);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex  justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div className={' col-lg-8 '}>
                    <div class="row m-0 w-100">
                        <div class={generalstyles.card + ' mb-3 col-lg-12 p-2'}>
                            <Accordion allowMultipleExpanded={true} allowZeroExpanded={true}>
                                <AccordionItem class={`${generalstyles.innercard}` + '  p-2'}>
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
                                                                        <BsChevronUp />
                                                                    </i>
                                                                );
                                                            } else {
                                                                return (
                                                                    <i class="h-100 d-flex align-items-center justify-content-center">
                                                                        <BsChevronDown />
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
                                            <div class="col-lg-3" style={{ marginBottom: '15px' }}>
                                                <div class="row m-0 w-100  ">
                                                    <div class={`${formstyles.form__group} ${formstyles.field}`}>
                                                        <label class={formstyles.form__label}>Order by</label>
                                                        <Select
                                                            options={[
                                                                { label: 'Oldest', value: true },
                                                                { label: 'Latest', value: false },
                                                            ]}
                                                            styles={defaultstyles}
                                                            value={[
                                                                { label: 'Oldest', value: true },
                                                                { label: 'Latest', value: false },
                                                            ].find((option) => option.value === (filter?.isAsc ?? true))}
                                                            onChange={(option) => {
                                                                setfilter({ ...filter, isAsc: option?.value });
                                                                updateQueryParamContext('isAsc', option?.value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class={'col-lg-3'} style={{ marginBottom: '15px' }}>
                                                <InventorySelectComponent
                                                    type="single"
                                                    label={'name'}
                                                    value={'id'}
                                                    payload={filter}
                                                    payloadAttr={'inventoryId'}
                                                    onClick={(option) => {
                                                        setfilter({ ...filter, inventoryId: option?.id });
                                                        setpackagepayload({ ...packagepayload, toInventoryId: option?.id });
                                                        updateQueryParamContext('inventoryId', option?.id);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </AccordionItemPanel>
                                </AccordionItem>
                            </Accordion>
                        </div>
                        <div class="col-lg-12 p-0">
                            <div class={generalstyles.card + ' row m-0 w-100'}>
                                <div class="col-lg-10 p-0 ">
                                    <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                        <input
                                            type="number"
                                            class={formstyles.form__field}
                                            value={search}
                                            placeholder={'Search by ID'}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    if (search?.length != 0) {
                                                        setfilter({ ...filter, inventoryId: parseInt(search) });
                                                    } else {
                                                        setfilter({ ...filter, inventoryId: undefined });
                                                    }

                                                    setsearch('');
                                                }
                                            }}
                                            onChange={(event) => {
                                                setsearch(event.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div class="col-lg-2 p-0 allcentered">
                                    <button
                                        style={{ height: '30px', minWidth: '80%' }}
                                        class={generalstyles.roundbutton + ' allcentered p-0'}
                                        onClick={() => {
                                            if (search?.length != 0) {
                                                setfilter({ ...filter, inventoryId: parseInt(search) });
                                            } else {
                                                setfilter({ ...filter, inventoryId: undefined });
                                            }

                                            setsearch('');
                                        }}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                        {isAuth([1, 94, 61]) && (
                            <>
                                {' '}
                                <div class="col-lg-12 p-0 mb-3">
                                    <Pagination
                                        total={fetchInventoryItemReturnsQuery?.data?.paginateInventoryReturns?.totalCount}
                                        beforeCursor={fetchInventoryItemReturnsQuery?.data?.paginateInventoryReturns?.cursor?.beforeCursor}
                                        afterCursor={fetchInventoryItemReturnsQuery?.data?.paginateInventoryReturns?.cursor?.afterCursor}
                                        filter={filter}
                                        setfilter={setfilter}
                                    />
                                </div>
                                <ReturnsTable
                                    clickable={true}
                                    actiononclick={(item) => {
                                        var temp = { ...packagepayload };
                                        var exist = false;
                                        var chosenindex = null;
                                        temp.ids.map((i, ii) => {
                                            if (i?.id == item?.id) {
                                                exist = true;
                                                chosenindex = ii;
                                                temp.ids.splice(ii, 1);
                                            }
                                        });
                                        if (!exist) {
                                            temp.ids.push(item);
                                        }
                                        setpackagepayload({ ...temp });
                                    }}
                                    selectedItems={packagepayload.ids}
                                    card="col-lg-4 px-1"
                                    items={fetchInventoryItemReturnsQuery?.data?.paginateInventoryReturns?.data}
                                />
                                <div class="col-lg-12 p-0">
                                    <Pagination
                                        total={fetchInventoryItemReturnsQuery?.data?.paginateInventoryReturns?.totalCount}
                                        beforeCursor={fetchInventoryItemReturnsQuery?.data?.paginateInventoryReturns?.cursor?.beforeCursor}
                                        afterCursor={fetchInventoryItemReturnsQuery?.data?.paginateInventoryReturns?.cursor?.afterCursor}
                                        filter={filter}
                                        setfilter={setfilter}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div class="col-lg-4 mb-3 ">
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
                                                        <div class={generalstyles.card + ' py-2 row m-0 mb-2 w-100 allcentered'}>
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
                            <InventorySelectComponent
                                type="single"
                                label={'name'}
                                value={'id'}
                                payload={packagepayload}
                                payloadAttr={'toInventoryId'}
                                onClick={(option) => {
                                    setpackagepayload({ ...packagepayload, toInventoryId: option?.id });
                                }}
                                removeAll={true}
                            />
                        </div>

                        <div class="col-lg-12 p-0 allcentered">
                            <button
                                disabled={buttonLoadingContext}
                                onClick={async () => {
                                    if (!isAuth([1, 99, 100])) {
                                        NotificationManager.warning('Not Authorized', 'Warning!');
                                        return;
                                    }
                                    if (buttonLoadingContext) return;
                                    setbuttonLoadingContext(true);
                                    try {
                                        if (packagepayload?.ids?.length != 0 && packagepayload?.type?.length != 0) {
                                            try {
                                                var temp = [];
                                                await packagepayload?.ids?.map((item, index) => {
                                                    item?.orderItems?.map((i, ii) => {
                                                        temp.push(i.id);
                                                    });
                                                });
                                                await setcartItems([...temp]);
                                                await createReturnPackageMutation();
                                                setcartItems([]);
                                                setpackagepayload({
                                                    ids: [],
                                                    type: 'inventory',
                                                    toInventoryId: undefined,
                                                    toMerchantId: undefined,
                                                });
                                                refetchInventoryItemReturnsQuery();
                                                history.push('/packages');
                                            } catch (error) {
                                                let errorMessage = 'An unexpected error occurred';
                                                if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                                                    errorMessage = error.graphQLErrors[0].message || errorMessage;
                                                } else if (error.networkError) {
                                                    errorMessage = error.networkError.message || errorMessage;
                                                } else if (error.message) {
                                                    errorMessage = error.message;
                                                }

                                                NotificationManager.warning(errorMessage, 'Warning!');
                                            }
                                        } else {
                                            NotificationManager.warning('Please Complete all fields', 'Warning!');
                                        }
                                    } catch (error) {
                                        let errorMessage = 'An unexpected error occurred';
                                        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                                            errorMessage = error.graphQLErrors[0].message || errorMessage;
                                        } else if (error.networkError) {
                                            errorMessage = error.networkError.message || errorMessage;
                                        } else if (error.message) {
                                            errorMessage = error.message;
                                        }

                                        NotificationManager.warning(errorMessage, 'Warning!');
                                        console.error('Error adding Merchant:', error);
                                    }
                                    setbuttonLoadingContext(false);
                                }}
                                class={generalstyles.roundbutton}
                            >
                                {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoadingContext && <span>Add Package</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default InventoryReturns;
