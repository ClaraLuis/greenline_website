import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import { LanguageContext } from '../../../LanguageContext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';
import CircularProgress from 'react-cssfx-loading/lib/CircularProgress';
import { components } from 'react-select';
import formstyles from '../Generalfiles/CSS_GENERAL/form.module.css';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons
import { BsTrash } from 'react-icons/bs';
import { NotificationManager } from 'react-notifications';
import API from '../../../API/API.js';
import SelectComponent from '../../SelectComponent.js';

const { ValueContainer, Placeholder } = components;

const AddSheetNew = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, setpagetitle_context, dateformatter, orderStatusEnumContext, user, isAuth, buttonLoadingContext, setbuttonLoadingContext } = useContext(Contexthandlerscontext);
    const { useQueryGQL, updateupdateOrderIdsStatus, addCourierSheet, addOrdersToCourierSheet, useMutationGQL, fetchCouriers, fetchCourierSheet, useLazyQueryGQL, fetchHubs } = API();

    const { lang, langdetect } = useContext(LanguageContext);
    const [submit, setsubmit] = useState(false);

    const [fetchCourierSheetQuery, setfetchCourierSheetQuery] = useState({});

    const [sheetpayload, setsheetpayload] = useState({
        functype: 'add',
        name: '',
        courier: '',
        orders: [],
        orderIds: [],
    });

    const [search, setsearch] = useState('');
    const [openModal, setopenModal] = useState(false);
    const [assignOpenModal, setassignOpenModal] = useState(false);

    const [filterCouriers, setfilterCouriers] = useState({
        isAsc: true,
        limit: 10,
        afterCursor: undefined,
        beforeCursor: undefined,
    });
    const fetchCouriersQuery = useQueryGQL('cache-first', fetchCouriers(), filterCouriers);

    const [filterHubs, setfilterHubs] = useState({
        isAsc: true,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
    });

    const fetchHubsQuery = useQueryGQL('cache-first', fetchHubs(), filterHubs);

    const [addCourierSheetMutation] = useMutationGQL(addCourierSheet(), {
        userId: sheetpayload?.courier,
        orderIds: sheetpayload?.orderIds,
    });
    const [updateupdateOrderIdsStatusMutation] = useMutationGQL(updateupdateOrderIdsStatus(), {
        status:
            window.location.pathname == '/dispatched'
                ? 'arrivedAtSortFacilities'
                : window.location.pathname == '/fulfilled'
                ? 'dispatched'
                : window.location.pathname == '/sortfacilities'
                ? 'transferred'
                : 'arrivedAtHub',
        ids: sheetpayload?.orderIds,
        toHubId: sheetpayload?.toHubId,
    });

    const [addOrdersToCourierSheetMutation] = useMutationGQL(addOrdersToCourierSheet(), {
        sheetId: parseInt(queryParameters.get('sheetId')),
        orderIds: sheetpayload?.orderIds,
    });

    const handleAddCourierSheet = async () => {
        if (buttonLoadingContext) return;
        setbuttonLoadingContext(true);
        if (queryParameters.get('sheetId')) {
            try {
                const { data } = await addOrdersToCourierSheetMutation();
                if (data?.addOrdersToCourierSheet?.success == true) {
                    NotificationManager.success('Manifest Updated Successfully', 'Success');
                    history.push('/couriersheets');
                } else {
                    NotificationManager.warning(data?.addOrdersToCourierSheet?.message, 'Warning!');
                }
            } catch (error) {
                // alert(JSON.stringify(error));
                let errorMessage = 'An unexpected error occurred';
                // // Check for GraphQL errors
                if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                    errorMessage = error.graphQLErrors[0].message || errorMessage;
                } else if (error.networkError) {
                    errorMessage = error.networkError.message || errorMessage;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                NotificationManager.warning(errorMessage, 'Warning!');
                if (errorMessage == 'Courier has an open sheet') {
                    setassignOpenModal(true);
                }
            }
        } else {
            try {
                const { data } = await addCourierSheetMutation();
                if (data?.createCourierSheet?.success == true) {
                    NotificationManager.success('Manifest Added Successfully', 'Success');

                    history.push('/couriersheets');
                } else {
                    NotificationManager.warning(data?.createCourierSheet?.message, 'Warning!');
                }
            } catch (error) {
                // alert(JSON.stringify(error));
                let errorMessage = 'An unexpected error occurred';
                // // Check for GraphQL errors
                if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                    errorMessage = error.graphQLErrors[0].message || errorMessage;
                } else if (error.networkError) {
                    errorMessage = error.networkError.message || errorMessage;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                NotificationManager.warning(errorMessage, 'Warning!');
                if (errorMessage == 'Courier has an open sheet') {
                    setassignOpenModal(true);
                }
            }
        }

        setbuttonLoadingContext(false);
    };
    useEffect(() => {
        setpageactive_context(window.location.pathname);
        setpagetitle_context(
            window.location.pathname == '/addsheet'
                ? 'Courier'
                : window.location.pathname === '/dispatched' || window.location.pathname === '/sortfacilities' || window.location.pathname === '/fulfilled'
                ? 'Warehouses'
                : 'Hubs',
        );
    }, []);
    const [fetchCourierSheetLazyQuery] = useLazyQueryGQL(fetchCourierSheet());

    useEffect(async () => {
        if (queryParameters.get('sheetId')) {
            var { data } = await fetchCourierSheetLazyQuery({
                variables: {
                    id: parseInt(queryParameters.get('sheetId')),
                },
            });
            var orderIdstemp = [];
            data?.CourierSheet?.sheetOrders?.map((order) => {
                orderIdstemp.push(order.orderId);
            });
            setsheetpayload({ ...sheetpayload, orderIdsOld: orderIdstemp });
            setfetchCourierSheetQuery({ data: data });
        }
    }, [queryParameters.get('sheetId')]);

    const [barcode, setBarcode] = useState('');
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore control keys and functional keys
            if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'CapsLock' || e.key === 'Shift' || e.key === 'Tab' || e.key === 'Backspace' || e.key === 'Control' || e.key === 'Alt') {
                return;
            }

            if (e.key === 'Enter') {
                var temp = { ...sheetpayload };
                var exist = false;
                temp.orderIds.map((i, ii) => {
                    if (i == barcode) {
                        exist = true;
                    }
                });
                temp?.orderIdsOld?.map((i, ii) => {
                    if (i == search) {
                        exist = true;
                    }
                });
                if (!exist) {
                    if (barcode?.length != 0 && !isNaN(parseInt(barcode))) {
                        temp.orderIds.push(parseInt(barcode));
                    } else {
                        NotificationManager.warning('Order has to be numbers', 'Warning!');
                    }
                } else {
                    NotificationManager.warning('Order already added', 'Warning!');
                }
                setsheetpayload({ ...temp });

                // setsearch(barcode); // Update the search state with the scanned barcode
                setBarcode('');
                setsearch(''); // Clear the barcode state
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
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                {window.location.pathname == '/addsheet' && (
                    <div class="col-lg-12 px-3">
                        <div class={generalstyles.card + ' row m-0 w-100'}>
                            {queryParameters.get('sheetId') != undefined && (
                                <>
                                    <div class="col-lg-12 mb-2" style={{ fontWeight: 600 }}>
                                        Sheet # {queryParameters.get('sheetId')}
                                    </div>
                                    <div class="col-lg-12 mb-4">{fetchCourierSheetQuery?.data?.CourierSheet?.userInfo?.name}</div>
                                </>
                            )}
                            {queryParameters.get('sheetId') == undefined && (
                                <div class={'col-lg-3'}>
                                    <SelectComponent
                                        title={'Courier'}
                                        filter={filterCouriers}
                                        setfilter={setfilterCouriers}
                                        options={fetchCouriersQuery}
                                        attr={'paginateCouriers'}
                                        payload={sheetpayload}
                                        payloadAttr={'courier'}
                                        label={'name'}
                                        value={'id'}
                                        onClick={(option) => {
                                            setsheetpayload({ ...sheetpayload, courier: option?.id });
                                        }}
                                        removeAll={true}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {(window.location.pathname == '/fulfilled' || window.location.pathname == '/sortfacilities') && (
                    <div class="col-lg-12 px-3">
                        <div class={generalstyles.card + ' row m-0 w-100'}>
                            {queryParameters.get('sheetId') == undefined && (
                                <div class={'col-lg-3'}>
                                    <SelectComponent
                                        title={'Hub'}
                                        filter={filterHubs}
                                        setfilter={setfilterHubs}
                                        options={fetchHubsQuery}
                                        attr={'paginateHubs'}
                                        payload={sheetpayload}
                                        payloadAttr={'toHubId'}
                                        label={'name'}
                                        value={'id'}
                                        onClick={(option) => {
                                            setsheetpayload({ ...sheetpayload, toHubId: option?.id });
                                        }}
                                        removeAll={true}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <div class="col-lg-12 px-3">
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
                                    var temp = { ...sheetpayload };
                                    var exist = false;
                                    temp.orderIds.map((i, ii) => {
                                        if (i == search) {
                                            exist = true;
                                        }
                                    });
                                    temp?.orderIdsOld?.map((i, ii) => {
                                        if (i == search) {
                                            exist = true;
                                        }
                                    });
                                    if (!exist) {
                                        if (search?.length != 0 && !isNaN(parseInt(search))) {
                                            temp.orderIds.push(parseInt(search));
                                        } else {
                                            NotificationManager.warning('Order has to be numbers', 'Warning!');
                                        }
                                    } else {
                                        NotificationManager.warning('Order already added', 'Warning!');
                                    }
                                    setsheetpayload({ ...temp });
                                    setsearch('');
                                }}
                            >
                                Add order
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 px-3">
                    <div class={generalstyles.card + ' row m-0 w-100'}>
                        <div class={' col-lg-6 col-md-6 col-sm-6 p-0 d-flex align-items-center justify-content-start pb-2 '}>
                            <p class=" p-0 m-0" style={{ fontSize: '17px' }}>
                                Orders ({sheetpayload?.orderIds?.length})
                            </p>
                        </div>
                    </div>
                </div>

                <div class="col-lg-12">
                    <div class={' row m-0 w-100 scrollmenuclasssubscrollbar'} style={{ overflow: 'scroll' }}>
                        <div class="col-lg-12 p-0">
                            <>
                                {sheetpayload?.orderIdsOld?.length != 0 && (
                                    <div class="col-lg-12 p-0">
                                        <div style={{ maxHeight: '40vh', overflow: 'scroll' }} class="row m-0 w-100 scrollmenuclasssubscrollbar">
                                            {sheetpayload?.orderIdsOld?.map((item, index) => {
                                                return (
                                                    <div class={' col-lg-3 '}>
                                                        <div class={generalstyles.card + ' p-2 row m-0 mb-3 w-100 allcentered'}>
                                                            <div style={{ fontWeight: 700 }} class="col-lg-10 p-0 mb-2">
                                                                # {item}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                {sheetpayload?.orderIds?.length != 0 && (
                                    <div class="col-lg-12 p-0">
                                        <div style={{ maxHeight: '40vh', overflow: 'scroll' }} class="row m-0 w-100 scrollmenuclasssubscrollbar">
                                            {sheetpayload?.orderIds?.map((item, index) => {
                                                return (
                                                    <div class={' col-lg-3 '}>
                                                        <div class={generalstyles.card + ' p-2 row m-0 mb-3 w-100 allcentered'}>
                                                            <div style={{ fontWeight: 700 }} class="col-lg-10 p-0 mb-2">
                                                                # {item}
                                                            </div>
                                                            <div class="col-lg-2 p-0 allcentered">
                                                                <BsTrash
                                                                    onClick={() => {
                                                                        var temp = { ...sheetpayload };
                                                                        temp.orderIds.splice(index, 1);
                                                                        setsheetpayload({ ...temp });
                                                                    }}
                                                                    class="text-danger text-dangerhover"
                                                                    // size={20}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        </div>
                    </div>
                </div>
                <div style={{ position: 'fixed', bottom: 0, width: '79.5%' }} class="col-lg-12 px-3">
                    <div class={generalstyles.card + ' row m-0 w-100 d-flex justify-content-end'}>
                        {window.location.pathname == '/addsheet' && (
                            <button
                                // style={{ height: '30px', minWidth: '80%' }}
                                class={generalstyles.roundbutton + ' allcentered p-0'}
                                onClick={() => {
                                    if ((queryParameters.get('sheetId') == undefined && isAuth([1, 36, 53])) || (queryParameters.get('sheetId') != undefined && isAuth([1, 35, 53]))) {
                                        if ((sheetpayload?.courier?.length == 0 || sheetpayload?.courier == undefined) && queryParameters.get('sheetId') == undefined) {
                                            NotificationManager.warning('Choose Courier first', 'Warning!');
                                            return;
                                        }
                                        if (sheetpayload?.orderIds?.length == 0 || sheetpayload?.orderIds == undefined) {
                                            NotificationManager.warning('Choose Orders first', 'Warning!');
                                        } else {
                                            handleAddCourierSheet();
                                        }
                                    } else {
                                        NotificationManager.warning('Not Authorized', 'Warning!');
                                    }
                                }}
                                disabled={buttonLoadingContext}
                            >
                                {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoadingContext && <span>{queryParameters.get('sheetId') == undefined ? 'Add Manifest' : 'Update Manifest'}</span>}
                                {/* Add Manifest */}
                            </button>
                        )}
                        {window.location.pathname != '/addsheet' && (
                            <button
                                style={{ height: '30px', minWidth: '170px' }}
                                class={generalstyles.roundbutton + ' allcentered  p-0'}
                                onClick={async () => {
                                    if (buttonLoadingContext) return;
                                    setbuttonLoadingContext(true);
                                    if (sheetpayload?.orderIds?.length != 0) {
                                        try {
                                            const { data } = await updateupdateOrderIdsStatusMutation();
                                            if (data?.updateOrdersStatus?.success == true) {
                                                NotificationManager.success('Orders status updated successfully', 'Success');
                                            } else {
                                                NotificationManager.warning(data?.updateOrdersStatus?.message, 'Warning!');
                                            }
                                        } catch (error) {
                                            // alert(JSON.stringify(error));
                                            let errorMessage = 'An unexpected error occurred';
                                            // // Check for GraphQL errors
                                            if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                                                errorMessage = error.graphQLErrors[0].message || errorMessage;
                                            } else if (error.networkError) {
                                                errorMessage = error.networkError.message || errorMessage;
                                            } else if (error.message) {
                                                errorMessage = error.message;
                                            }
                                            NotificationManager.warning(errorMessage, 'Warning!');
                                        }
                                    }

                                    setbuttonLoadingContext(false);
                                }}
                                disabled={buttonLoadingContext}
                            >
                                {buttonLoadingContext && <CircularProgress color="white" width="15px" height="15px" duration="1s" />}
                                {!buttonLoadingContext && (
                                    <span>
                                        {window.location.pathname == '/dispatched'
                                            ? 'Arrived At Sort Facilities'
                                            : window.location.pathname == '/fulfilled'
                                            ? 'Dispatch'
                                            : window.location.pathname == '/sortfacilities'
                                            ? 'Transfer'
                                            : 'Arrived at hub'}
                                    </span>
                                )}
                                {/* Add Manifest */}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AddSheetNew;
