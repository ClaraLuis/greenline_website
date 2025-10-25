import { useContext, useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Contexthandlerscontext } from '../../../Contexthandlerscontext.js';
import generalstyles from '../Generalfiles/CSS_GENERAL/general.module.css';
// import { fetch_collection_data } from '../../../API/API';

import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Icons

import Decimal from 'decimal.js';
import { Modal } from 'react-bootstrap';
import { FaLayerGroup } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { NotificationManager } from 'react-notifications';
import API from '../../../API/API.js';
import MerchantSelectComponent from '../../selectComponents/MerchantSelectComponent.js';
import '../Generalfiles/CSS_GENERAL/react-accessible-accordion.css';
// Utility functions for number formatting and calculations
const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return new Decimal(num).toFixed(2);
};

const calculateOrderTotal = (item) => {
    if (!item?.transactions) return 0;
    
    const merchantPayment = item.transactions.reduce(
        (sum, i) => (i.type === 'merchantOrderPayment' ? new Decimal(sum).plus(i.amount) : new Decimal(sum)),
        new Decimal(0)
    );
    const shippingCollection = item.transactions.reduce(
        (sum, i) => (i.type === 'shippingCollection' ? new Decimal(sum).minus(i.amount) : new Decimal(sum)),
        new Decimal(0)
    );
    return merchantPayment.plus(shippingCollection).toNumber();
};

const calculateMerchantPayment = (item) => {
    if (!item?.transactions) return 0;
    return item.transactions
        .filter(i => i.type === 'merchantOrderPayment')
        .reduce((sum, i) => new Decimal(sum).plus(i.amount), new Decimal(0))
        .toNumber();
};

const calculateShippingCollection = (item) => {
    if (!item?.transactions) return 0;
    return item.transactions
        .filter(i => i.type === 'shippingCollection')
        .reduce((sum, i) => new Decimal(sum).minus(i.amount), new Decimal(0))
        .toNumber();
};

const Settlements = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    let history = useHistory();
    const { setpageactive_context, isAuth, setpagetitle_context, buttonLoadingContext, setbuttonLoadingContext, ready, setReady } = useContext(Contexthandlerscontext);
    const { useQueryGQL, useMutationGQL, createMerchantSettlement, paginateSettlementPayouts, paginateMerchantDebts, useLazyQueryGQL } = API();

    const [settlementPayload, setsettlementPayload] = useState({
        sheetOrderIds: [],
        merchantDebtIds: [],
    });
    
    // Use ref to persist state across re-renders
    const settlementPayloadRef = useRef({
        sheetOrderIds: [],
        merchantDebtIds: [],
    });
    
    // Sync ref with state
    useEffect(() => {
        settlementPayloadRef.current = settlementPayload;
    }, [settlementPayload]);
    
    // Track component renders
    const renderCount = useRef(0);
    renderCount.current += 1;
    
    // Debug component renders
    useEffect(() => {
        console.log('🔄 Component rendered, count:', renderCount.current);
        console.log('Current settlement payload:', settlementPayload);
    });

    useEffect(() => {
        setpageactive_context('/settlements');
        setpagetitle_context('Finance');
    }, []);

    const [createsettlementModal, setcreatesettlementModal] = useState(false);
    const [choosemerchant, setchoosemerchant] = useState(false);
    const [fetchSettlementsQuery, setfetchSettlementsQuery] = useState([]);
    const [fetchMerchantDebtsQuery, setfetchMerchantDebtsQuery] = useState([]);

    const [paginateSettlementPayoutsLazyQuery] = useLazyQueryGQL(paginateSettlementPayouts());
    const [paginateMerchantDebtsLazyQuery] = useLazyQueryGQL(paginateMerchantDebts());

    const [settlementsFilter, setsettlementsFilter] = useState({
        isAsc: false,
        limit: 20,
        afterCursor: undefined,
        beforeCursor: undefined,
        merchantId: queryParameters.get('merchantId') ?? undefined,
    });

    // Initialize ready state by setting it to true immediately
    useEffect(() => {
        setReady(true);
    }, [setReady]);

    // Optimized data fetching with combined useEffect
    const fetchData = useCallback(async () => {
        console.log('🔄 fetchData called');
        const merchantId = parseInt(queryParameters.get('merchantId'));
        if (!merchantId) return;

        const input = { ...settlementsFilter, merchantId };
        
        try {
            const [settlementsResult, debtsResult] = await Promise.all([
                paginateSettlementPayoutsLazyQuery({ variables: { input } }),
                paginateMerchantDebtsLazyQuery({ variables: { input } })
            ]);
            
            setfetchSettlementsQuery({ data: settlementsResult.data });
            setfetchMerchantDebtsQuery({ data: debtsResult.data });
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
    }, [settlementsFilter, paginateSettlementPayoutsLazyQuery, paginateMerchantDebtsLazyQuery]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const [createMerchantSettlementMutation] = useMutationGQL(createMerchantSettlement(), {
        merchantId: parseInt(settlementsFilter?.merchantId),
    });
    useEffect(() => {
        if (!queryParameters.get('merchantId')) {
            setchoosemerchant(true);
        }
    }, [queryParameters.get('merchantId')]);

    // Memoized calculations for selected settlement totals
    const selectedOrdersTotal = useMemo(() => {
        if (!settlementPayload?.sheetOrderIds?.length) return 0;
        return settlementPayload.sheetOrderIds.reduce((acc, item) => {
            return new Decimal(acc).plus(calculateOrderTotal(item)).toNumber();
        }, 0);
    }, [settlementPayload]);

    const selectedServicesTotal = useMemo(() => {
        if (!settlementPayload?.merchantDebtIds?.length) return 0;
        return settlementPayload.merchantDebtIds.reduce((sum, item) => {
            return new Decimal(sum).plus(item?.amount || 0).mul(-1).toNumber();
        }, 0);
    }, [settlementPayload]);

    const selectedGrandTotal = useMemo(() => {
        return new Decimal(selectedOrdersTotal).plus(selectedServicesTotal).toFixed(2);
    }, [selectedOrdersTotal, selectedServicesTotal]);

    // Debug settlement payload changes
    useEffect(() => {
        console.log('Settlement payload changed:', settlementPayload);
        console.log('Render count:', renderCount.current);
        
        // Check if state was reset to empty arrays
        if (settlementPayload.sheetOrderIds.length === 0 && settlementPayload.merchantDebtIds.length === 0) {
            console.log('⚠️ Settlement payload was reset to empty arrays!');
            console.trace('Stack trace for state reset:');
        }
    }, [settlementPayload]);


    // Optimized click handlers
    const handleOrderClick = useCallback((item) => {
        console.log('Order clicked:', item.id);
        setsettlementPayload(prev => {
            const exists = prev.sheetOrderIds.some(i => i.id === item.id);
            const nextSheetOrderIds = exists
                ? prev.sheetOrderIds.filter(i => i.id !== item.id)
                : [...prev.sheetOrderIds, item];
            return { ...prev, sheetOrderIds: nextSheetOrderIds };
        });
    }, []);

    const handleServiceClick = useCallback((item) => {
        setsettlementPayload(prev => {
            const exists = prev.merchantDebtIds.some(i => i.id === item.id);
            const nextMerchantDebtIds = exists
                ? prev.merchantDebtIds.filter(i => i.id !== item.id)
                : [...prev.merchantDebtIds, item];
            return { ...prev, merchantDebtIds: nextMerchantDebtIds };
        });
    }, []);

    const handleMerchantSelect = useCallback((option) => {
        console.log('handleMerchantSelect called with option:', option);
        if (option) {
            console.log('Resetting settlement payload in handleMerchantSelect');
            // Reset settlement payload when changing merchant
            setsettlementPayload({
                sheetOrderIds: [],
                merchantDebtIds: [],
            });
            // Navigate to new merchant
            history.push(`/settlements?merchantId=${option.id}&m=${option.name}`);
            // Close the modal
            setchoosemerchant(false);
        }
    }, [history]);

    return (
        <div class="row m-0 w-100 p-md-2 pt-2">
            <div class="row m-0 w-100 d-flex align-items-center justify-content-start mt-sm-2 pb-5 pb-md-0">
                <div class={' col-lg-6 col-md-6 col-sm-6 d-flex align-items-center justify-content-start pb-2 px-3 '}>
                    <p class=" p-0 m-0" style={{ fontSize: '27px' }}>
                        Settlements
                    </p>
                </div>
                <div class="col-lg-12 px-3 d-flex justify-content-end mb-3">
                    <button
                        class={generalstyles.roundbutton + ' px-4 py-2'}
                        onClick={() => {
                            console.log('Change Merchant button clicked - resetting settlement payload');
                            // Reset settlement payload when changing merchant
                            setsettlementPayload({
                                sheetOrderIds: [],
                                merchantDebtIds: [],
                            });
                            // Open merchant selection modal
                            setchoosemerchant(true);
                        }}
                        style={{ fontSize: '14px', minHeight: '40px' }}
                    >
                        Change Merchant
                    </button>
                </div>
                {queryParameters?.get('merchantId') != undefined && (
                    <div class="col-lg-12 p-0 ">
                        <div class="row m-0 w-100">
                            <div class="col-lg-7 p-0">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-12 pl-3">
                                        <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                                            {fetchSettlementsQuery?.data && (
                                                <>
                                                    <div class="col-lg-12 p-0" style={{ fontSize: '17px', fontWeight: 700 }}>
                                                        Orders
                                                    </div>
                                                    {fetchSettlementsQuery?.data?.paginateSettlementPayouts?.data?.length != 0 && (
                                                        <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-3 '}>
                                                            <table className="table table-hover">
                                                                <thead style={{ position: 'sticky', top: '0px' }}>
                                                                    <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>#</th>
                                                                    <th style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>Type</th>
                                                                    <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Amount</th>
                                                                    <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Shipping</th>
                                                                    <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Total</th>
                                                                </thead>
                                                                <tbody>
                                                                    {/* {alert(JSON.stringify(fetchSettlementsQuery?.data?.paginateSettlementPayouts?.))} */}
                                                                    {fetchSettlementsQuery?.data?.paginateSettlementPayouts?.data?.map((item, index) => {
                                                                        var selected = false;
                                                                        settlementPayload?.sheetOrderIds?.map((orderitem, orderindex) => {
                                                                            if (orderitem?.id == item?.id) {
                                                                                selected = true;
                                                                            }
                                                                        });
                                                                        return (
                                                                            <tr
                                                                                style={{ background: selected ? 'var(--secondary)' : '' }}
                                                                                onClick={() => handleOrderClick(item)}
                                                                            >
                                                                                <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                                    <p className={' m-0 p-0 wordbreak '}>{item?.order?.id}</p>
                                                                                </td>
                                                                                <td style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>
                                                                                    <div
                                                                                        style={{ color: 'white' }}
                                                                                        className={' wordbreak bg-primary rounded-pill font-weight-600 allcentered mx-1 text-capitalize'}
                                                                                    >
                                                                                        {item?.order?.type?.split(/(?=[A-Z])/).join(' ')}
                                                                                    </div>
                                                                                </td>
                                                                                <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                                    <p className="m-0 p-0 wordbreak">
                                                                                        {formatNumber(calculateMerchantPayment(item))}
                                                                                    </p>
                                                                                </td>

                                                                                <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                                    <p className="m-0 p-0 wordbreak">
                                                                                        {formatNumber(calculateShippingCollection(item))}
                                                                                    </p>
                                                                                </td>

                                                                                <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                                    <p className="m-0 p-0 wordbreak">
                                                                                        {formatNumber(calculateOrderTotal(item))}
                                                                                    </p>
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                    {fetchSettlementsQuery?.data?.paginateSettlementPayouts?.data?.length == 0 && (
                                                        <div style={{ height: '20vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                                            <div class="row m-0 w-100">
                                                                <FaLayerGroup size={40} class=" col-lg-12" />
                                                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                                    No Orders
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div class="col-lg-12 pl-3">
                                        <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-2 px-3'}>
                                            {fetchMerchantDebtsQuery?.data && (
                                                <>
                                                    <div class="col-lg-12 p-0" style={{ fontSize: '17px', fontWeight: 700 }}>
                                                        Services
                                                    </div>
                                                    {fetchMerchantDebtsQuery?.data?.paginateMerchantDebts?.data?.length != 0 && (
                                                        <div className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-3 '}>
                                                            <table className="table table-hover">
                                                                <thead style={{ position: 'sticky', top: '0px' }}>
                                                                    <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>#</th>
                                                                    <th style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>Type</th>
                                                                    <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Amount</th>
                                                                </thead>
                                                                <tbody>
                                                                    {/* {alert(JSON.stringify(fetchMerchantDebtsQuery?.data?.paginateSettlementPayouts?.))} */}
                                                                    {fetchMerchantDebtsQuery?.data?.paginateMerchantDebts?.data?.map((item, index) => {
                                                                        var selected = false;
                                                                        settlementPayload?.merchantDebtIds?.map((orderitem, orderindex) => {
                                                                            if (orderitem?.id == item?.id) {
                                                                                selected = true;
                                                                            }
                                                                        });
                                                                        return (
                                                                            <tr
                                                                                style={{ background: selected ? 'var(--secondary)' : '' }}
                                                                                onClick={() => handleServiceClick(item)}
                                                                            >
                                                                                <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                                    <p className={' m-0 p-0 wordbreak '}>{item?.id}</p>
                                                                                </td>
                                                                                <td style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>
                                                                                    <p className={' m-0 p-0 wordbreak '}>
                                                                                        {' '}
                                                                                        <div
                                                                                            style={{ color: 'white' }}
                                                                                            className={' wordbreak bg-primary rounded-pill font-weight-600 allcentered mx-1 text-capitalize'}
                                                                                        >
                                                                                            {item?.type?.split(/(?=[A-Z])/).join(' ')}
                                                                                        </div>
                                                                                    </p>
                                                                                </td>
                                                                                <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                                    <p className={' m-0 p-0 wordbreak '}>{formatNumber(item?.amount)}</p>
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                    {fetchMerchantDebtsQuery?.data?.paginateMerchantDebts?.data?.length == 0 && (
                                                        <div style={{ height: '20vh' }} class="col-lg-12 w-100 allcentered align-items-center m-0 text-lightprimary">
                                                            <div class="row m-0 w-100">
                                                                <FaLayerGroup size={40} class=" col-lg-12" />
                                                                <div class="col-lg-12 w-100 allcentered p-0 m-0" style={{ fontSize: '20px' }}>
                                                                    No Services
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-5 pr-1 ">
                                <div class={generalstyles.card + ' row m-0 w-100 mb-2 p-0 '}>
                                    <div class="col-lg-12 p-0 mb-2" style={{ fontSize: '17px', fontWeight: 700 }}>
                                        Details
                                    </div>
                                    <div class="col-lg-12 p-0 mb-2">
                                        <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                            <div>Merchant Name</div>
                                            <div style={{ fontWeight: 700 }}>{queryParameters.get('m')}</div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 p-0 mb-2">
                                        {settlementPayload?.sheetOrderIds?.length != 0 && (
                                            <>
                                                <div
                                                    style={{ border: '1px solid #eee', borderRadius: '0.5rem' }}
                                                    className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 '}
                                                >
                                                    <table className="table table-hover">
                                                        <thead style={{ position: 'sticky', top: '0px' }}>
                                                            <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Orders</th>
                                                            <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Amount</th>
                                                            <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Shipping</th>
                                                            <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Total</th>
                                                        </thead>
                                                        <tbody>
                                                            {/* {alert(JSON.stringify(fetchSettlementsQuery?.data?.paginateSettlementPayouts?.))} */}
                                                            {settlementPayload?.sheetOrderIds?.map((item, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                            <p className={' m-0 p-0 wordbreak '}>{item?.order?.id}</p>
                                                                        </td>

                                                                        <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                            <p className="m-0 p-0 wordbreak">{formatNumber(calculateMerchantPayment(item))}</p>
                                                                        </td>
                                                                        <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                            <p className="m-0 p-0 wordbreak">{formatNumber(calculateShippingCollection(item))}</p>
                                                                        </td>
                                                                        <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                            <p className={' m-0 p-0 wordbreak '}>
                                                                                {formatNumber(calculateOrderTotal(item))}
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </>
                                        )}
                                        {settlementPayload?.merchantDebtIds?.length != 0 && (
                                            <>
                                                <div
                                                    style={{ border: '1px solid #eee', borderRadius: '0.5rem' }}
                                                    className={generalstyles.subcontainertable + ' col-lg-12 table_responsive  scrollmenuclasssubscrollbar p-0 mt-2'}
                                                >
                                                    <table className="table table-hover">
                                                        <thead style={{ position: 'sticky', top: '0px' }}>
                                                            <th style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>Service</th>
                                                            <th style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>Amount</th>
                                                        </thead>
                                                        <tbody>
                                                            {/* {alert(JSON.stringify(fetchMerchantDebtsQuery?.data?.paginateSettlementPayouts?.))} */}
                                                            {settlementPayload?.merchantDebtIds?.map((item, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td style={{ maxWidth: '150px', minWidth: '150px', width: '150px' }}>
                                                                            <p className={' m-0 p-0 wordbreak '}>
                                                                                {' '}
                                                                                <div
                                                                                    style={{ color: 'white' }}
                                                                                    className={' wordbreak bg-primary rounded-pill font-weight-600 allcentered mx-1 text-capitalize'}
                                                                                >
                                                                                    {item?.type?.split(/(?=[A-Z])/).join(' ')}
                                                                                </div>
                                                                            </p>
                                                                        </td>
                                                                        <td style={{ maxWidth: '100px', minWidth: '100px', width: '100px' }}>
                                                                            <p className={' m-0 p-0 wordbreak '}>{formatNumber(item?.amount)}</p>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div class="col-lg-12 p-0 mb-3">
                                        <div class="row m-0 w-100 p-3" style={{ border: '1px solid #eee', borderRadius: '0.5rem' }}>
                                            <div class="col-lg-12 p-0 mb-2">
                                                <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                                    <div>Orders</div>
                                                    <div style={{ fontWeight: 700 }}>
                                                        {formatNumber(selectedOrdersTotal)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12 p-0 mb-2">
                                                <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                                    <div>Services</div>
                                                    <div style={{ fontWeight: 700 }}>
                                                        {formatNumber(selectedServicesTotal)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12 p-0 mb-2">
                                                <div class="row m-0 w-100 d-flex align-items-center justify-content-between">
                                                    <div style={{ fontWeight: 700 }}>Total</div>
                                                    <div style={{ fontWeight: 700 }}>
                                                        {selectedGrandTotal}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 mb-3">
                                        <button
                                            class={generalstyles.roundbutton + ' allcentered w-100'}
                                            onClick={async () => {
                                                if (buttonLoadingContext) return;
                                                setbuttonLoadingContext(true);
                                                try {
                                                    const { data } = await createMerchantSettlementMutation({
                                                        variables: {
                                                            sheetOrderIds: settlementPayload?.sheetOrderIds?.map((item) => item.id)?.length != 0 ? settlementPayload?.sheetOrderIds?.map((item) => item.id) : undefined,
                                                            merchantDebtIds: settlementPayload?.merchantDebtIds?.map((item) => item.id)?.length != 0 ? settlementPayload?.merchantDebtIds?.map((item) => item.id) : undefined,
                                                        }
                                                    });
                                                    if (data?.createMerchantSettlement?.success) {
                                                        NotificationManager.success(data?.createMerchantSettlement?.message, 'Success!');
                                                        setcreatesettlementModal({ open: true, data: data });
                                                        // Don't reload immediately - let user close modal or view PDF first
                                                    } else {
                                                        NotificationManager.warning(data?.createMerchantSettlement?.message, 'Warning!');
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
                                                }
                                                setbuttonLoadingContext(false);
                                            }}
                                        >
                                            Create Settlement
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Modal
                show={createsettlementModal?.open}
                onHide={() => {
                    setcreatesettlementModal({ open: false });
                    window.location.reload(); // Refresh page when modal is closed
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0 d-flex align-items-center">
                        <div class="col-lg-6 p-0 ">
                            <div className="row w-100 m-0 p-0 d-flex align-items-center">Create Settlement</div>
                        </div>
                        <div class="col-lg-6 col-md-2 col-sm-2 d-flex align-items-center justify-content-end p-2">
                            <div
                                class={'close-modal-container'}
                                onClick={() => {
                                    setcreatesettlementModal({ open: false });
                                    window.location.reload(); // Refresh page when close button is clicked
                                }}
                            >
                                <IoMdClose />
                            </div>
                        </div>{' '}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 p-4">
                        <div class="col-lg-12 p-0 mb-3">Total: {formatNumber(createsettlementModal?.data?.createMerchantSettlement?.data?.total)}</div>
                        <div class="col-lg-12 p-0 allcentered text-center">
                            <button
                                class={generalstyles.roundbutton + ' allcentered w-100'}
                                onClick={async () => {
                                    window.open(createsettlementModal?.data?.createMerchantSettlement?.data?.pdfUrl, '_blank');
                                    setcreatesettlementModal({ open: false });
                                    window.location.reload(); // Refresh page after opening PDF
                                }}
                            >
                                Open PDF
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                show={choosemerchant}
                onHide={() => {
                    setchoosemerchant(false);
                }}
                centered
                size={'md'}
            >
                <Modal.Header>
                    <div className="row w-100 m-0 p-0 d-flex align-items-center">
                        <div class="col-lg-6 ">
                            <div className="row w-100 m-0 p-0 d-flex align-items-center">Choose Merchant</div>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div class="row m-0 w-100 px-4 pt-0 pb-4">
                        <div class="col-lg-12 p-0">
                            <MerchantSelectComponent
                                type="single"
                                label={'name'}
                                value={'id'}
                                payload={settlementsFilter}
                                payloadAttr={'merchantId'}
                                removeAll={true}
                                onClick={handleMerchantSelect}
                            />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default Settlements;
