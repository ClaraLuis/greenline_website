import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel, AccordionItemState } from 'react-accessible-accordion';
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
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import ItemsTable from './ItemsTable.js';
import { NotificationManager } from 'react-notifications';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress/index.js';
import ReturnsTable from './ReturnsTable.js';
import { IoMdClose } from 'react-icons/io';

const MerchanReturns = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, paymentTypeContext, returnPackageTypeContext, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const { useMutationGQL, fetchMerchants, findItemReturnByOrder, useLazyQueryGQL, fetchMerchantItemReturns, useQueryGQL, createReturnPackage } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [cartItems, setcartItems] = useState([]);
    const [search, setsearch] = useState('');

    const [packagepayload, setpackagepayload] = useState({
        ids: [],
        type: '',
        toInventoryId: undefined,
        toMerchantId: undefined,
    });

    const [filterMerchants, setfilterMerchants] = useState({
        isAsc: true,
        limit: 10,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchMerchantsQuery = useQueryGQL('cache-first', fetchMerchants(), filterMerchants);
    const [findItemReturnByOrderQuery] = useLazyQueryGQL(findItemReturnByOrder());

    const [filter, setfilter] = useState({
        limit: 20,
        isAsc: true,
        afterCursor: '',
        beforeCursor: '',
        assignedToPackage: false,
        merchantId: undefined,
    });
    const fetchMerchantItemReturnsQuery = useQueryGQL('', fetchMerchantItemReturns(), filter);
    const { refetch: refetchMerchantItemReturnsQuery } = useQueryGQL('', fetchMerchantItemReturns(), filter);

    const [createReturnPackageMutation] = useMutationGQL(createReturnPackage(), {
        orderItemIds: cartItems,
        type: 'merchant',
        toMerchantId: filter?.merchantId,
    });

    useEffect(() => {
        setpageactive_context('/merchantreturns');
        setpagetitle_context('Hubs');
    }, []);

    const [barcode, setBarcode] = useState('');

    const addItemRetun = async (orderId) => {
        if (filter?.merchantId == undefined || filter.merchantId?.length == 0 || filter.merchantId == null) {
            NotificationManager.warning('Filter by merchant first', 'Warning');
        } else {
            var temp = { ...packagepayload };
            var exist = false;
            var chosenindex = null;
            temp.ids.map((i, ii) => {
                if (i?.id == orderId) {
                    exist = true;
                    chosenindex = ii;
                }
            });
            if (!exist) {
                var inData = fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.data?.filter((i) => i.id == orderId)[0];
                if (orderId?.length != 0 && !isNaN(parseInt(orderId)) && inData) {
                    temp.ids.push(inData);
                } else {
                    try {
                        var { data } = await findItemReturnByOrderQuery({
                            variables: {
                                input: {
                                    orderId: [parseInt(orderId)],
                                },
                            },
                        });
                        if (data?.findItemReturnByOrder) {
                            temp.ids.push(data?.findItemReturnByOrder);
                        } else {
                            NotificationManager.warning('No order with this id', 'Warning!');
                        }
                    } catch (e) {
                        let errorMessage = 'An unexpected error occurred';
                        if (e.graphQLErrors && e.graphQLErrors.length > 0) {
                            errorMessage = e.graphQLErrors[0].message || errorMessage;
                        } else if (e.networkError) {
                            errorMessage = e.networkError.message || errorMessage;
                        } else if (e.message) {
                            errorMessage = e.message;
                        }
                        NotificationManager.warning(errorMessage, 'Warning!');
                    }
                }
            } else {
                NotificationManager.warning('Already added', 'Warning!');
            }
            setpackagepayload({ ...temp });
        }
    };
    useEffect(() => {
        const handleKeyDown = async (e) => {
            // Ignore control keys and functional keys
            if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'CapsLock' || e.key === 'Shift' || e.key === 'Tab' || e.key === 'Backspace' || e.key === 'Control' || e.key === 'Alt') {
                return;
            }

            if (e.key === 'Enter') {
                addItemRetun(barcode);
                setBarcode('');
                setsearch('');
            } else {
                setBarcode((prevBarcode) => prevBarcode + e.key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [barcode]);
    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex  justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div className={' col-lg-8 '} style={{}}>
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
                                            <div class={'col-lg-4'} style={{ marginBottom: '15px' }}>
                                                <SelectComponent
                                                    title={'Merchant'}
                                                    filter={filterMerchants}
                                                    setfilter={setfilterMerchants}
                                                    options={fetchMerchantsQuery}
                                                    attr={'paginateMerchants'}
                                                    label={'name'}
                                                    value={'id'}
                                                    payload={filter}
                                                    payloadAttr={'merchantId'}
                                                    onClick={(option) => {
                                                        setfilter({ ...filter, merchantId: option?.id });
                                                        setpackagepayload({ ...packagepayload, toMerchantId: option?.id, ids: [] });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </AccordionItemPanel>
                                </AccordionItem>
                            </Accordion>
                        </div>
                        <div class={generalstyles.card + ' row m-0 w-100'}>
                            <div class="col-lg-10 p-0 ">
                                <div class={`${formstyles.form__group} ${formstyles.field}` + ' m-0'}>
                                    <input
                                        type="number"
                                        class={formstyles.form__field}
                                        value={search}
                                        placeholder={'Search by order ID'}
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
                                        addItemRetun(search);
                                        setsearch('');
                                    }}
                                >
                                    Add order
                                </button>
                            </div>
                        </div>
                        <div class={' row m-0 w-100 scrollmenuclasssubscrollbar'} style={{ overflow: 'scroll' }}>
                            {packagepayload?.ids?.map((item, index) => {
                                return (
                                    <div class={'col-lg-4'}>
                                        <div class={generalstyles.card + ' p-0 row m-0 w-100'}>
                                            <span class="mr-3" style={{ fontSize: '12px', color: 'grey' }}>
                                                # {item?.id}
                                            </span>

                                            {item?.orderItems?.map((subitem, subindex) => {
                                                return (
                                                    <div class="row m-0">
                                                        {subitem?.count}{' '}
                                                        <div style={{ width: '25px', height: '25px', borderRadius: '2px', marginInline: '5px', border: '1px solid #eee' }}>
                                                            <img
                                                                src={
                                                                    subitem?.info?.imageUrl
                                                                        ? subitem?.info?.imageUrl
                                                                        : 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'
                                                                }
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div
                                                style={{ position: 'absolute', top: 10, right: 10 }}
                                                onClick={() => {
                                                    const temp = { ...packagepayload };
                                                    temp.ids.splice(index, 1);
                                                    setpackagepayload({ ...temp });
                                                }}
                                                className="text-dangerhover"
                                            >
                                                <IoMdClose />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div class="col-lg-12 p-0 mb-3">
                            <Pagination
                                beforeCursor={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.cursor?.beforeCursor}
                                afterCursor={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.cursor?.afterCursor}
                                filter={filter}
                                setfilter={setfilter}
                            />
                        </div>

                        <ReturnsTable
                            clickable={true}
                            selectedItems={packagepayload?.ids}
                            actiononclick={(item) => {
                                if (filter?.merchantId == undefined || filter.merchantId?.length == 0 || filter.merchantId == null) {
                                    NotificationManager.warning('Filter by merchant first', 'Warning');
                                } else {
                                    const temp = { ...packagepayload };
                                    const existingIndex = temp.ids.findIndex((i) => i?.id === item?.id);

                                    if (existingIndex === -1) {
                                        temp.ids.push(item); // Add item if not already in the list
                                    } else {
                                        temp.ids.splice(existingIndex, 1); // Remove item if already in the list
                                    }
                                    setpackagepayload({ ...temp });
                                }
                            }}
                            card="col-lg-6 "
                            items={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.data?.filter((item) => !packagepayload?.ids?.some((selected) => selected?.id === item?.id))}
                        />

                        <div class="col-lg-12 p-0">
                            <Pagination
                                beforeCursor={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.cursor?.beforeCursor}
                                afterCursor={fetchMerchantItemReturnsQuery?.data?.paginateItemReturns?.cursor?.afterCursor}
                                filter={filter}
                                setfilter={setfilter}
                            />
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 mb-3 " style={{}}>
                    <div class={generalstyles.card + ' row m-0 w-100 p-2 py-3'}>
                        {/* <div class="col-lg-12">
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
                        </div> */}

                        <div class="col-lg-12 p-0 allcentered">
                            <button
                                onClick={async () => {
                                    if (buttonLoadingContext) return;
                                    setbuttonLoadingContext(true);
                                    try {
                                        if (packagepayload?.ids?.length != 0 && packagepayload?.toMerchantId != undefined) {
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
                                                    type: '',
                                                    toInventoryId: undefined,
                                                    toMerchantId: undefined,
                                                });
                                                setfilter({
                                                    limit: 20,
                                                    isAsc: true,
                                                    afterCursor: '',
                                                    beforeCursor: '',
                                                    assignedToPackage: false,
                                                    merchantId: undefined,
                                                });
                                                refetchMerchantItemReturnsQuery();
                                                NotificationManager.success('Return Items package created', 'Success');
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
                                disabled={buttonLoadingContext}
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
export default MerchanReturns;
